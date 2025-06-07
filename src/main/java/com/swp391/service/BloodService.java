package com.swp391.service;

import com.swp391.dto.request.BloodInventoryCreateRequest;
import com.swp391.dto.request.BloodInventoryUpdateRequest;
import com.swp391.dto.request.BloodTypeCreateRequest;
import com.swp391.dto.request.BloodTypeUpdateRequest;
import com.swp391.dto.response.BloodInventoryResponse;
import com.swp391.dto.response.BloodTypeResponse;
import com.swp391.entity.BloodInventory;
import com.swp391.entity.BloodType;
import com.swp391.mapper.BloodMapper;
import com.swp391.repository.BloodInventoryRepository;
import com.swp391.repository.BloodTypeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BloodService {

    BloodTypeRepository bloodTypeRepository;
    BloodInventoryRepository bloodInventoryRepository;
    BloodMapper bloodMapper;

    // ===== BLOOD TYPE =====
    // Create
    public BloodTypeResponse createBloodType(BloodTypeCreateRequest request) {
        BloodType bloodType = bloodMapper.toBloodType(request);
        bloodType = bloodTypeRepository.save(bloodType);
        return bloodMapper.toBloodTypeResponse(bloodType);
    }
    // Update
    public BloodTypeResponse updateBloodType(int id, BloodTypeUpdateRequest request) {
        BloodType bloodType = bloodTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blood type not found"));
        bloodMapper.updateBloodType(bloodType, request);
        bloodType = bloodTypeRepository.save(bloodType);
        return bloodMapper.toBloodTypeResponse(bloodType);
    }
    // Delete
    public void deleteBloodType(int id) {
        bloodTypeRepository.deleteById(id);
    }
    // Read
    public List<BloodTypeResponse> getAllBloodTypes() {
        return bloodTypeRepository.findAll()
                .stream()
                .map(bloodMapper::toBloodTypeResponse)
                .toList();
    }
    // Get by ID
    public BloodTypeResponse getBloodTypeById(int id) {
        BloodType bloodType = bloodTypeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blood type not found"));
        return bloodMapper.toBloodTypeResponse(bloodType);
    }

    // ===== BLOOD INVENTORY =====
    // Create
    public BloodInventoryResponse createBloodInventory(BloodInventoryCreateRequest request) {
        BloodInventory inventory = bloodMapper.toBloodInventory(request);
        inventory = bloodInventoryRepository.save(inventory);
        return bloodMapper.toBloodInventoryResponse(inventory);
    }
    // Update
    public BloodInventoryResponse updateBloodInventory(int id, BloodInventoryUpdateRequest request) {
        BloodInventory inventory = bloodInventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blood inventory not found"));
        bloodMapper.updateBloodInventory(inventory, request);
        inventory = bloodInventoryRepository.save(inventory);
        return bloodMapper.toBloodInventoryResponse(inventory);
    }
    // Delete
    public void deleteBloodInventory(int id) {
        bloodInventoryRepository.deleteById(id);
    }
    // Read
    public List<BloodInventoryResponse> getAllBloodInventories() {
        return bloodInventoryRepository.findAll()
                .stream()
                .map(bloodMapper::toBloodInventoryResponse)
                .toList();
    }
    // Get by ID
    public BloodInventoryResponse getBloodInventoryById(int id) {
        BloodInventory inventory = bloodInventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blood inventory not found"));
        return bloodMapper.toBloodInventoryResponse(inventory);
    }
}
