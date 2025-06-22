package com.swp391.mapper;

import com.swp391.dto.request.CertificateCreateRequest;
import com.swp391.dto.response.CertificateResponse;
import com.swp391.entity.Certificate;
import com.swp391.entity.DonationHistory;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CertificateMapper {

    // Tạo Certificate từ DTO và entity DonationHistory đã lấy từ DB
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "issuedDate", expression = "java(java.time.LocalDate.now())")
    @Mapping(target = "imageUrl", ignore = true) // sẽ gán sau khi upload
    @Mapping(source = "donationHistory", target = "donationHistory")
    Certificate toEntity(CertificateCreateRequest request, DonationHistory donationHistory);

    // Chuyển Certificate entity sang DTO để trả ra frontend
    @Mapping(source = "donationHistory.id", target = "donationHistoryId")
    CertificateResponse toResponse(Certificate certificate);
}
