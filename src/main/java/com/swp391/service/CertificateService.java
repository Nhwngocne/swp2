package com.swp391.service;

import com.swp391.dto.request.CertificateCreateRequest;
import com.swp391.dto.response.CertificateResponse;
import com.swp391.entity.Certificate;
import com.swp391.entity.DonationHistory;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.CertificateMapper;
import com.swp391.repository.CertificateRepository;
import com.swp391.repository.DonationHistoryRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CertificateService {

    CertificateRepository certificateRepository;
    DonationHistoryRepository donationHistoryRepository;
    CertificateMapper certificateMapper;
    ImageService imageService;

    @PreAuthorize("hasRole('STAFF')")
    public CertificateResponse createCertificate(CertificateCreateRequest request) {
        DonationHistory donationHistory = donationHistoryRepository.findById(request.getDonationHistoryId())
                .orElseThrow(() -> new AppException(ErrorCode.DONATION_HISTORY_NOT_FOUND));

        if (donationHistory.getCertificate() != null) {
            throw new AppException(ErrorCode.CERTIFICATE_ALREADY_EXISTS);
        }

        Certificate certificate = Certificate.builder()
                .donationHistory(donationHistory)
                .donorName(request.getDonorName())
                .donatedDate(request.getDonatedDate())
                .location(request.getLocation())
                .volume(request.getVolume())
                .build();



        certificate = certificateRepository.save(certificate);
        return certificateMapper.toResponse(certificate);
    }

    public CertificateResponse getById(int id) {
        Certificate certificate = certificateRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CERTIFICATE_NOT_FOUND));
        return certificateMapper.toResponse(certificate);
    }

    public CertificateResponse getByDonationHistoryId(int historyId) {
        Certificate certificate = certificateRepository.findByDonationHistory_Id(historyId)
                .orElseThrow(() -> new AppException(ErrorCode.CERTIFICATE_NOT_FOUND));
        return certificateMapper.toResponse(certificate);
    }

}
