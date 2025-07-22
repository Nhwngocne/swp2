package com.swp391.mapper;

import com.swp391.dto.request.CertificateCreateRequest;
import com.swp391.dto.response.CertificateResponse;
import com.swp391.entity.Certificate;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface CertificateMapper {

    @Mapping(source = "donationHistory.id", target = "donationHistoryId")
    CertificateResponse toResponse(Certificate certificate);

    default Certificate toEntity(CertificateCreateRequest request) {
        return Certificate.builder()
                .donorName(request.getDonorName())
                .donatedDate(request.getDonatedDate().toString())
                .location(request.getLocation())
                .volume(request.getVolume())
                .build();
    }
}
