package com.swp391.service;

import com.swp391.dto.request.BloodIntentFormRequest;
import com.swp391.dto.response.BloodIntentFormResponse;
import com.swp391.entity.BloodIntentForm;
import com.swp391.entity.Member;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.BloodIntentFormMapper;
import com.swp391.repository.BloodIntentFormRepository;
import com.swp391.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

import static lombok.AccessLevel.PRIVATE;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class BloodIntentFormService {

    BloodIntentFormRepository intentFormRepository;
    MemberRepository memberRepository;
    BloodIntentFormMapper intentFormMapper;
    NotificationService notificationService;
    BloodService bloodService;
    // Tạo mới form ý định cho/nhận máu
    public BloodIntentFormResponse create(BloodIntentFormRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        BloodIntentForm entity = intentFormMapper.toEntity(request);
        entity.setMember(member); // nhớ set member nếu cần
        entity.setAvailableFrom(LocalDate.now());
        entity.setAvailableTo(LocalDate.now().plusMonths(1));
        entity.setStatus("PENDING");

        entity = intentFormRepository.save(entity);

        // Sau khi lưu thành công, tạo thông báo cho staff
        String message = String.format(
                "Thành viên %s vừa đăng ký %s máu.",
                member.getName(), entity.getIntentType()
        );

        notificationService.createNotificationForStaff(1, member.getId(), message);

        return intentFormMapper.toResponse(entity);
    }

    // Lấy tất cả form ý định (cho staff xem)
    public List<BloodIntentFormResponse> getAll() {
        return intentFormRepository.findAll()
                .stream()
                .map(intentFormMapper::toResponse)
                .toList();
    }

    // Lấy form của 1 member
    public List<BloodIntentFormResponse> getByMember(int memberId) {
        memberRepository.findById(memberId)
                .orElseThrow(() -> new AppException(ErrorCode.MEMBER_NOT_FOUND));

        return intentFormRepository.findByMemberId(memberId)
                .stream()
                .map(intentFormMapper::toResponse)
                .toList();
    }

    // Xoá form
    public void deleteById(int id) {
        if (!intentFormRepository.existsById(id)) {
            throw new AppException(ErrorCode.FORM_NOT_FOUND);
        }
        intentFormRepository.deleteById(id);
    }

    // Tìm theo ID
    public BloodIntentFormResponse getById(int id) {
        BloodIntentForm form = intentFormRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FORM_NOT_FOUND));

        return intentFormMapper.toResponse(form);
    }
    public BloodIntentFormResponse approveForm(int formId) {
        BloodIntentForm form = intentFormRepository.findById(formId)
                .orElseThrow(() -> new AppException(ErrorCode.FORM_NOT_FOUND));

        if (!"PENDING".equalsIgnoreCase(form.getStatus())) {
            throw new AppException(ErrorCode.FORM_ALREADY_PROCESSED);
        }

        String message;
        if ("NHAN".equalsIgnoreCase(form.getIntentType())) {
            String bloodType = form.getBloodType();
            int quantityNeeded = form.getQuantity();

            boolean available = bloodService.checkBloodInventory(bloodType, quantityNeeded);

            if (available) {
                form.setStatus("COMPLETED");
                form.setApprovedAt(LocalDate.now());
                message = String.format(
                        "Kho máu đã sẵn sàng cho nhóm máu %s của bạn. Mời bạn đến Trung Tâm Y Tế Hiến máu vì cộng đồng để nhận.",
                        bloodType
                );
            } else {
                form.setStatus("PROCESSING");
                message = String.format(
                        "Đơn nhận máu nhóm %s của bạn đã được duyệt. Chúng tôi sẽ sớm tìm người hiến máu phù hợp để giúp bạn.",
                        bloodType
                );
            }
        } else if ("CHO".equalsIgnoreCase(form.getIntentType())) {
            form.setStatus("COMPLETED");
            form.setApprovedAt(LocalDate.now());
            message = "Cảm ơn bạn đã đăng ký hiến máu. Trung Tâm Y Tế Hiến máu vì cộng đồng sẽ liên hệ với bạn để xác nhận lịch hẹn.";
        } else {
            throw new AppException(ErrorCode.INVALID_INTENT_TYPE);
        }

        // Gửi thông báo
        notificationService.createNotificationForMember(form.getMember().getId(), message);

        form = intentFormRepository.save(form);
        return intentFormMapper.toResponse(form);
    }
    public BloodIntentFormResponse rejectForm(int formId, String rejectReason) {
        BloodIntentForm form = intentFormRepository.findById(formId)
                .orElseThrow(() -> new AppException(ErrorCode.FORM_NOT_FOUND));

        if (!"PENDING".equalsIgnoreCase(form.getStatus())) {
            throw new AppException(ErrorCode.FORM_ALREADY_PROCESSED);
        }

        form.setStatus("REJECTED");
        form.setRejectReason(rejectReason);
        form.setApprovedAt(LocalDate.now());

        notificationService.createNotificationForMember(
                form.getMember().getId(),
                "Đơn đăng ký của bạn đã bị từ chối. Lý do: " + rejectReason
        );

        form = intentFormRepository.save(form);
        return intentFormMapper.toResponse(form);
    }

}
