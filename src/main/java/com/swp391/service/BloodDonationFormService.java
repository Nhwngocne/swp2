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

    // Tạo mới đơn đăng ký
    public BloodDonationFormResponse createForm(BloodDonationFormCreateRequest request) {
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_FOUND));

        Member member = memberRepository.findById(request.getMemberId())
                .orElseThrow(() -> new AppException(ErrorCode.MEMBER_NOT_FOUND));
        Staff staff = staffRepository.findById(event.getCreatedBy().getId())
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));

        BloodDonationForm form = formMapper.toForm(request);
        form.setEvent(event);
        form.setMember(member);
        form.setApprovedBy(staff);
        form.setStatus("PENDING");
        form.setCreatedAt(LocalDate.now());

        form = formRepository.save(form);
        return formMapper.toFormResponse(form);
    }

    // Cập nhật đơn đăng ký (dành cho staff duyệt đơn)
    public BloodDonationFormResponse updateForm(BloodDonationFormUpdateRequest request) {
        BloodDonationForm form = formRepository.findById(request.getFormId())
                .orElseThrow(() -> new AppException(ErrorCode.FORM_NOT_FOUND));

        formMapper.updateForm(form, request);

        if (request.getApprovedByStaffId() > 0) {
            Staff staff = staffRepository.findById(request.getApprovedByStaffId())
                    .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_FOUND));
            form.setApprovedBy(staff);
            form.setApprovedDate(LocalDate.now());
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
