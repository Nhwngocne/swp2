package com.swp391.service;

import com.swp391.dto.request.QnAAnswerRequest;
import com.swp391.dto.request.QnAQuestionRequest;
import com.swp391.dto.response.QnAResponse;
import com.swp391.entity.Member;
import com.swp391.entity.QnA;
import com.swp391.entity.Staff;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.QnAMapper;
import com.swp391.repository.MemberRepository;
import com.swp391.repository.QnARepository;
import com.swp391.repository.StaffRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class QnAService {

    QnARepository qnaRepository;
    QnAMapper qnaMapper;
    MemberRepository memberRepository;
    StaffRepository staffRepository;
    NotificationService notificationService;

    @PreAuthorize("hasRole('MEMBER')")
    public QnAResponse createQuestion(QnAQuestionRequest request) {
        QnA qna = qnaMapper.toQnA(request);
        qna.setCreatedAt(LocalDateTime.now());

        // Lấy member đang đăng nhập
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        qna.setMember(member);

        qna = qnaRepository.save(qna);

        // Gửi thông báo cho staff
        String message = String.format("Thành viên %s vừa đặt câu hỏi mới.", member.getName());

        // Ví dụ gửi cho tất cả staff
        List<Staff> staffs = staffRepository.findAll();
        for (Staff staff : staffs) {
            notificationService.createNotificationForStaff(staff.getId(), member.getId(), message);
        }

        return qnaMapper.toQnAResponse(qna);
    }


    public List<QnAResponse> getAllAnswered() {
        return qnaRepository.findByAnswerIsNotNull()
                .stream()
                .limit(17)
                .map(qnaMapper::toQnAResponse)
                .toList();
    }


    @PreAuthorize("hasRole('STAFF')")
    public List<QnAResponse> getPendingQuestions() {
        return qnaRepository.findByAnswerIsNull()
                .stream()
                .map(qnaMapper::toQnAResponse)
                .toList();
    }

    public QnAResponse getById(int id) {
        QnA qna = qnaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.QNA_NOT_FOUND));
        return qnaMapper.toQnAResponse(qna);
    }
    @PreAuthorize("hasRole('STAFF')")
    public QnAResponse answerQuestion(QnAAnswerRequest request) {
        QnA qna = qnaRepository.findById(request.getQnaId())
                .orElseThrow(() -> new AppException(ErrorCode.QNA_NOT_FOUND));

        if (qna.getAnswer() != null) {
            throw new AppException(ErrorCode.QNA_ALREADY_ANSWERED);
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Staff staff = staffRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        qna.setAnswer(request.getAnswer());
        qna.setAnsweredAt(LocalDateTime.now());
        qna.setStaff(staff);

        qna = qnaRepository.save(qna);

        // Thông báo hiển thị cả câu hỏi và câu trả lời
        String message = String.format(
                "Câu hỏi của bạn: \"%s\"\nĐã được nhân viên trả lời: \"%s\"",
                qna.getQuestion(),
                request.getAnswer()
        );
        notificationService.createNotificationForMember(qna.getMember().getId(), message);

        return qnaMapper.toQnAResponse(qna);
    }


    @PreAuthorize("hasRole('STAFF')")
    public void changeQnAAnswer(int id, QnAAnswerRequest request) {
        QnA qna = qnaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.QNA_NOT_FOUND));

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Staff staff = staffRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        qna.setAnswer(request.getAnswer());
        qna.setAnsweredAt(LocalDateTime.now());
        qna.setStaff(staff);

        qnaRepository.save(qna);

        // Gửi thông báo cho member
        String message = String.format("Câu trả lời của bạn đã được cập nhật: \"%s\"", request.getAnswer());
        notificationService.createNotificationForMember(qna.getMember().getId(), message);
    }

}