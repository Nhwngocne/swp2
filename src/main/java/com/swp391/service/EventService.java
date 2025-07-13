package com.swp391.service;

import com.swp391.dto.request.EventCreateRequest;
import com.swp391.dto.response.AuthenticationResponse;
import com.swp391.dto.response.EventResponse;
import com.swp391.entity.BloodType;
import com.swp391.entity.DonationHistory;
import com.swp391.entity.Event;
import com.swp391.entity.Member;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.EventMapper;
import com.swp391.repository.*;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EventService {
    EventRepository eventRepository;
    EventMapper eventMapper;
    ImageService imageService;
    StaffRepository staffRepository;
    BloodDonationFormRepository formRepository;
    NotificationService notificationService;
    MemberRepository   memberRepository;
    AuthenticationService authenticationService;
    DonationHistoryRepository donationHistoryRepository;

    @PreAuthorize("hasRole('STAFF')")
    public EventResponse createEvent(EventCreateRequest request) throws IOException {
        var event = eventMapper.toEvent(request);
        var staff = staffRepository.findById(request.getStaffId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        event.setCreatedBy(staff);
        // Upload image to Cloudinary and get URL
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            String imageUrl = imageService.uploadImage(request.getImage());
            event.setImageUrl(imageUrl);
        }
        // Tự động set status là UPCOMING khi tạo
        event.setStatus("UPCOMING");
        event = eventRepository.save(event);
        return eventMapper.toEventResponse(event);
    }

    public EventResponse updateEvent(int eventId, EventCreateRequest request) throws IOException {
        var event = eventRepository.findById(eventId)
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_EXISTED));

        // Rest of the update logic remains the same
        if (request.getImage() != null && !request.getImage().isEmpty()) {
            String imageUrl = imageService.uploadImage(request.getImage());
            event.setImageUrl(imageUrl);
        }

        eventMapper.updateEvent(event, request);
        event = eventRepository.save(event);
        return eventMapper.toEventResponse(event);
    }

    public void deleteEvent(int id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        // Lấy tất cả members đã đăng ký
        Set<Member> members = event.getRegisteredMembers();

        // Gửi thông báo cho từng member
        for (Member member : members) {
            String message = String.format(
                    "Sự kiện '%s' mà bạn đã đăng ký đã bị hủy. Vui lòng xem và đăng ký các sự kiện khác.",
                    event.getTitle()
            );
            notificationService.createNotificationForMember(member.getId(), message);
        }

        // Sau đó mới xóa
        eventRepository.delete(event);
    }

    public List<EventResponse> getAllEvents(HttpServletRequest request) {
        // B1: Lấy memberId từ token nếu có
        Integer memberId = null;
        try {
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                AuthenticationResponse userInfo = authenticationService.getCurrentUserFromToken(token);

                if ("MEMBER".equals(userInfo.getRole())) {
                    memberId = ((Member) userInfo.getUser()).getId();
                }
            }
        } catch (Exception e) {
            memberId = null;
        }

        final Integer finalMemberId = memberId;

        // B2: Cập nhật các sự kiện quá hạn
        LocalDate currentDate = LocalDate.now();
        List<Event> allEvents = eventRepository.findAll();

        for (Event event : allEvents) {
            if (event.getDate().isBefore(currentDate) && !"COMPLETED".equals(event.getStatus())) {
                event.setStatus("COMPLETED");
                eventRepository.save(event);
            }
        }

        // B3: Lọc và map sang EventResponse
        return allEvents.stream()
                .filter(event -> !"COMPLETED".equals(event.getStatus()))
                .map(event -> {
                    EventResponse response = eventMapper.toEventResponse(event);

                    // Số người đã được duyệt
                    int approvedCount = formRepository.countByEventIdAndStatus(event.getId(), "APPROVED");
                    response.setRegisteredMemberCount(approvedCount);

                    boolean isRegistered = false;
                    boolean canDonate = true;

                    if (finalMemberId != null) {
                        // ✅ Dùng repository để kiểm tra chính xác trong DB
                        isRegistered = formRepository.existsByEventIdAndMemberId(event.getId(), finalMemberId);

                        // Kiểm tra lịch sử hiến máu để xác định có thể hiến hay không
                        List<DonationHistory> historyList = donationHistoryRepository
                                .findByMemberIdAndResult(finalMemberId, "Đạt");

                        if (!historyList.isEmpty()) {
                            LocalDate latestEligibleDate = historyList.stream()
                                    .map(DonationHistory::getNextEligibleDate)
                                    .filter(Objects::nonNull)
                                    .max(LocalDate::compareTo)
                                    .orElse(LocalDate.MIN);

                            if (event.getDate().isBefore(latestEligibleDate)) {
                                canDonate = false;
                            }
                        }
                    }

                    response.setRegistered(isRegistered);
                    response.setCanDonate(canDonate);

                    return response;
                })
                .toList();
    }


    public EventResponse getEventById(int id) {
        var event = eventRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_EXISTED));
        var response = eventMapper.toEventResponse(event);
        int count = formRepository.countByEventIdAndStatus(event.getId(), "APPROVED");
        response.setRegisteredMemberCount(count);
        return response;
    }

    public void registerMemberToEvent(int memberId, int eventId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new AppException(ErrorCode.EVENT_NOT_EXISTED));

        // Tránh duplicate
        if (!event.getRegisteredMembers().contains(member)) {
            event.getRegisteredMembers().add(member);
            eventRepository.save(event);
        }
    }

}