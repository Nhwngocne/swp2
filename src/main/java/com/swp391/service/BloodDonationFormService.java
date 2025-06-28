package com.swp391.service;


import com.swp391.dto.request.BloodDonationFormCreateRequest;
import com.swp391.dto.request.BloodDonationFormUpdateRequest;
import com.swp391.dto.response.BloodDonationFormResponse;
import com.swp391.entity.BloodDonationForm;
import com.swp391.entity.Event;
import com.swp391.entity.Member;
import com.swp391.entity.Staff;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.BloodDonationFormMapper;
import com.swp391.repository.BloodDonationFormRepository;
import com.swp391.repository.EventRepository;
import com.swp391.repository.MemberRepository;
import com.swp391.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.AccessLevel;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BloodDonationFormService {

    BloodDonationFormRepository formRepository;
    BloodDonationFormMapper formMapper;
    EventRepository eventRepository;
    MemberRepository memberRepository;
    StaffRepository staffRepository;
    NotificationService notificationService;

    // Tạo mới đơn đăng ký
    public BloodDonationFormResponse createForm(BloodDonationFormCreateRequest request) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_FOUND));

        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new AppException(ErrorCode.MEMBER_NOT_FOUND));
        Staff staff = staffRepository.findById(event.getCreatedBy().getId())
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));

        LocalTime startTime;
        LocalTime endTime;

        if ("MORNING".equalsIgnoreCase(request.getSession())) {
            startTime = event.getDonationMorningStart();
            endTime = event.getDonationMorningEnd();
        } else if ("AFTERNOON".equalsIgnoreCase(request.getSession())) {
            startTime = event.getDonationAfternoonStart();
            endTime = event.getDonationAfternoonEnd();
        } else {
            throw new AppException(ErrorCode.INVALID_SESSION);
        }

        BloodDonationForm form = formMapper.toForm(request);
        form.setEvent(event);
        form.setMember(member);
        form.setApprovedBy(staff);
        form.setStatus("PENDING");
        form.setCreatedAt(LocalDate.now());

        form.setStartTime(startTime);
        form.setEndTime(endTime);

        form = formRepository.save(form);

        //  Gửi thông báo cho staff
        notificationService.createNotificationForStaff(
                staff.getId(),
                member.getId(),
                "Có đơn đăng ký hiến máu mới từ thành viên: " + member.getName()
                        + " cho sự kiện: " + event.getTitle()
        );


        return formMapper.toFormResponse(form);
    }

    // Cập nhật đơn đăng ký (dành cho staff duyệt đơn)
    public BloodDonationFormResponse updateForm(BloodDonationFormUpdateRequest request) {
        BloodDonationForm form = formRepository.findById(request.getFormId())
                .orElseThrow(() -> new AppException(ErrorCode.FORM_NOT_FOUND));

        // Cập nhật các trường cơ bản từ request
        formMapper.updateForm(form, request);

        // Nếu có chỉ định staff duyệt
        if (request.getApprovedByStaffId() != null && request.getApprovedByStaffId() > 0) {
            Staff staff = staffRepository.findById(request.getApprovedByStaffId())
                    .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));
            form.setApprovedBy(staff);
            form.setApprovedDate(LocalDate.now());

            // Gửi thông báo cho Member
            notificationService.createNotificationForMember(
                    form.getMember().getId(),
                    "Đơn đăng ký hiến máu #" + form.getId() + " của bạn đã được duyệt."
            );
        }

        // Nếu có cập nhật trạng thái
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            form.setStatus(request.getStatus().toUpperCase());
        }

        form = formRepository.save(form);
        return formMapper.toFormResponse(form);
    }


    // Member cập nhật lại form nếu chưa duyệt
    public BloodDonationFormResponse memberUpdateForm(int formId, int memberId, BloodDonationFormUpdateRequest request) {
        BloodDonationForm form = formRepository.findById(formId)
                .orElseThrow(() -> new AppException(ErrorCode.FORM_NOT_FOUND));

        if (form.getMember().getId() != memberId) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (!form.getStatus().equals("PENDING")) {
            throw new AppException(ErrorCode.FORM_ALREADY_APPROVED);
        }
        Event event = form.getEvent();

        // Xác định session sáng/chiều và set lại thời gian
        LocalTime startTime;
        LocalTime endTime;

        if ("MORNING".equalsIgnoreCase(request.getSession())) {
            startTime = event.getDonationMorningStart();
            endTime = event.getDonationMorningEnd();
        } else if ("AFTERNOON".equalsIgnoreCase(request.getSession())) {
            startTime = event.getDonationAfternoonStart();
            endTime = event.getDonationAfternoonEnd();
        } else {
            throw new AppException(ErrorCode.INVALID_SESSION);
        }

        // Cập nhật dữ liệu từ request (tương tự create)
        form.setStartTime(startTime);
        form.setEndTime(endTime);

        formMapper.updateForm(form, request);
        form = formRepository.save(form);
        return formMapper.toFormResponse(form);
    }

    // Lấy danh sách form của 1 member
    public List<BloodDonationFormResponse> getFormsByMemberId(int memberId) {
        memberRepository.findById(memberId)
                .orElseThrow(() -> new AppException(ErrorCode.MEMBER_NOT_FOUND));

        return formRepository.findByMemberId(memberId)
                .stream()
                .map(formMapper::toFormResponse)
                .toList();
    }

    // Lấy đơn cụ thể của member
    public BloodDonationFormResponse getFormByIdAndMember(int formId, int memberId) {
        BloodDonationForm form = formRepository.findById(formId)
                .orElseThrow(() -> new AppException(ErrorCode.FORM_NOT_FOUND));

        if (form.getMember().getId() != memberId) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return formMapper.toFormResponse(form);
    }

    // Xoá đơn đăng ký
    public void deleteForm(int id) {
        formRepository.deleteById(id);
    }

    // Lấy danh sách tất cả đơn đăng ký
    public List<BloodDonationFormResponse> getAllForms() {
        return formRepository.findAll()
                .stream()
                .map(formMapper::toFormResponse)
                .toList();
    }

    // Lấy đơn đăng ký theo id
    public BloodDonationFormResponse getFormById(int id) {
        BloodDonationForm form = formRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.FORM_NOT_FOUND));
        return formMapper.toFormResponse(form);
    }

    // Lấy danh sách đơn theo sự kiện
    public List<BloodDonationFormResponse> getFormsByEvent(int eventId) {
        return formRepository.findByEventId(eventId)
                .stream()
                .map(formMapper::toFormResponse)
                .toList();
    }
}
