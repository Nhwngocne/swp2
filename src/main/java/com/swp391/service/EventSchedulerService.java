package com.swp391.service;

import com.swp391.entity.BloodDonationForm;
import com.swp391.entity.Event;
import com.swp391.entity.Staff;
import com.swp391.repository.BloodDonationFormRepository;
import com.swp391.repository.EventRepository;
import com.swp391.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

import static lombok.AccessLevel.PRIVATE;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = PRIVATE, makeFinal = true)
public class EventSchedulerService {

    EventRepository eventRepository;
    BloodDonationFormRepository formRepository;
    NotificationService notificationService;

    @Scheduled(cron = "0 0 1 * * ?") // chạy mỗi ngày lúc 1h sáng
    public void notifyStaffForEndedEvents() {
        LocalDate today = LocalDate.now();
        List<Event> endedEvents = eventRepository.findByDateBefore(today);

        for (Event event : endedEvents) {
            List<BloodDonationForm> forms = formRepository.findByEventId(event.getId());
            if (!forms.isEmpty()) {
                // Lấy staff phụ trách
                Staff staff = event.getCreatedBy();
                if (staff != null) {
                    String message = String.format(
                            "Sự kiện '%s' đã kết thúc. Vui lòng kiểm tra các đơn đăng ký để xác nhận kết quả hiến.",
                            event.getTitle()
                    );
                    notificationService.createNotificationForStaff(staff.getId(), message);
                }
            }
        }
    }
}
