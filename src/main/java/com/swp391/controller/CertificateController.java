package com.swp391.controller;

import com.swp391.dto.request.CertificateCreateRequest;
import com.swp391.dto.response.CertificateResponse;
import com.swp391.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/certificates")
@RequiredArgsConstructor
public class CertificateController {

    private final CertificateService certificateService;

    //  API tạo chứng chỉ (upload ảnh) — dành cho STAFF
    @PreAuthorize("hasRole('STAFF')")
    @PostMapping("/upload")
    public ResponseEntity<CertificateResponse> uploadCertificate(@ModelAttribute CertificateCreateRequest request) {
        CertificateResponse response = certificateService.createCertificate(request);
        return ResponseEntity.ok(response);
    }

    //  Lấy chứng chỉ theo ID
    @GetMapping("/{id}")
    public ResponseEntity<CertificateResponse> getById(@PathVariable int id) {
        CertificateResponse response = certificateService.getById(id);
        return ResponseEntity.ok(response);
    }

    // Lấy chứng chỉ theo donationHistoryId
    @GetMapping("/by-donation/{donationHistoryId}")
    public ResponseEntity<CertificateResponse> getByDonationHistoryId(@PathVariable int donationHistoryId) {
        CertificateResponse response = certificateService.getByDonationHistoryId(donationHistoryId);
        return ResponseEntity.ok(response);
    }
}
