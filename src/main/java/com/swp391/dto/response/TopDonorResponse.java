package com.swp391.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TopDonorResponse {
    private int memberId;
    private String memberName;
    private int totalVolume;
    private int donationCount;
}