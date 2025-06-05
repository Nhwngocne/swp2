package com.swp391.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class NearbyDonorResponse {
    Long id;
    Double distanceKm;
    MemberResponse member;
    RegisReceiveResponse regisReceive;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class MemberResponse {
        Long id;
        String fullName;
        String email;
        String phoneNumber;
        String bloodType;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    public static class RegisReceiveResponse {
        Long id;
        String requestDate;
        String status;
        String urgencyLevel;
    }
}