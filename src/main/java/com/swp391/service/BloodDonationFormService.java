package com.swp391.service;

import com.google.firebase.database.core.EventRegistration;
import com.swp391.dto.request.BloodDonationFormCheckInRequest;
import com.swp391.dto.request.BloodDonationFormCreateRequest;
import com.swp391.dto.request.BloodDonationFormUpdateRequest;
import com.swp391.dto.response.BloodDonationFormResponse;
import com.swp391.entity.*;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.BloodDonationFormMapper;
import com.swp391.repository.*;
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
    BloodTypeRepository bloodTypeRepository;

    // Tạo mới đơn đăng ký
    public BloodDonationFormResponse createForm(BloodDonationFormCreateRequest request) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_FOUND));

        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new AppException(ErrorCode.MEMBER_NOT_FOUND));

        Staff staff = staffRepository.findById(event.getCreatedBy().getId())
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));

        BloodType bloodType = null;
        if (request.getBloodTypeId() != null && request.getBloodTypeId() != 0) {
            bloodType = bloodTypeRepository.findById(request.getBloodTypeId())
                    .orElseThrow(() -> new AppException(ErrorCode.BLOOD_TYPE_NOT_FOUND));
        }

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
        form.setBloodType(bloodType);
        form.setStatus("APPROVED"); // Mặc định là đã duyệt
        form.setCreatedAt(LocalDate.now());
        form.setStartTime(startTime);
        form.setEndTime(endTime);

        form = formRepository.save(form);

        //  Thêm member vào danh sách registeredMembers để tự insert vào event_registrations
        event.getRegisteredMembers().add(member);
        eventRepository.save(event);

        // Gửi thông báo cho staff
        notificationService.createNotificationForStaff(
                staff.getId(),
                member.getId(),
                "Có đơn đăng ký hiến máu mới từ thành viên: " + member.getName()
                        + " cho sự kiện: " + event.getTitle()
        );
        //  Gửi thông báo cho chính member
        notificationService.createNotificationForMember(
                member.getId(),
                "Chúc mừng! Bạn đã đăng ký thành công sự kiện: '"
                        + event.getTitle()
                        + "' diễn ra vào ngày " + event.getDate() + ". Hẹn gặp lại!"
        );
        return formMapper.toFormResponse(form);
    }
    public BloodDonationFormResponse checkInForm(BloodDonationFormCheckInRequest request) {
        BloodDonationForm form = formRepository.findById(request.getFormId())
                .orElseThrow(() -> new AppException(ErrorCode.FORM_NOT_FOUND));

        // Kiểm tra trạng thái form
        if (request.getStatus() != null && request.getStatus().equalsIgnoreCase("COMPLETED")) {
            if (!form.getStatus().equals("CHECKIN")) {
                throw new AppException(ErrorCode.FORM_NOT_CHECKIN);
            }
        } else if (!form.getStatus().equals("APPROVED")) {
            throw new AppException(ErrorCode.FORM_NOT_APPROVED);
        }

        // Cập nhật các trường cơ bản từ request
        formMapper.updateFormFromCheckIn(form, request);

        // Cập nhật thông tin staff và ngày duyệt
        Staff staff = staffRepository.findById(request.getApprovedByStaffId())
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));
        form.setApprovedBy(staff);
        form.setApprovedDate(LocalDate.now());

        // Xử lý cập nhật trạng thái
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            String status = request.getStatus().toUpperCase();
            form.setStatus(status);

            // Nếu là CHECKIN hoặc REJECT thì update luôn event_registration qua native query
            if ("CHECKIN".equals(status) || "REJECTED".equals(status)) {
                int updatedRows = eventRepository.updateRegistrationStatus(
                        (long)  form.getEvent().getId(),
                        (long)  form.getMember().getId(),
                        status
                );
                if (updatedRows == 0) {
                    throw new AppException(ErrorCode.EVENT_REGISTRATION_NOT_FOUND);
                }
            }
        }

        form = formRepository.save(form);

        // Gửi thông báo cho member
        notificationService.createNotificationForMember(
                form.getMember().getId(),
                "Đơn đăng ký hiến máu #" + form.getId() + " của bạn đã được cập nhật trạng thái: " + form.getStatus()
        );

        return formMapper.toFormResponse(form);
    }

    // Member cập nhật lại form nếu chưa duyệt
    public BloodDonationFormResponse memberUpdateForm(int formId, int memberId, BloodDonationFormUpdateRequest request) {
        BloodDonationForm form = formRepository.findById(formId)
                .orElseThrow(() -> new AppException(ErrorCode.FORM_NOT_FOUND));

        if (form.getMember().getId() != memberId) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (!form.getStatus().equals("APPROVED")) {
            throw new AppException(ErrorCode.FORM_NOT_APPROVED);
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

        // Update BloodType if provided
        if (request.getBloodTypeId() != null) {
            if (request.getBloodTypeId() == 0) {
                form.setBloodType(null); // Set bloodType to null for "Không biết"
            } else {
                BloodType bloodType = bloodTypeRepository.findById(request.getBloodTypeId())
                        .orElseThrow(() -> new AppException(ErrorCode.BLOOD_TYPE_NOT_FOUND));
                form.setBloodType(bloodType);
            }
        }

        // Cập nhật dữ liệu từ request
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