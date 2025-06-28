package com.swp391.service;

import com.swp391.dto.response.BloodComponentCompatibilityResponse;
import com.swp391.entity.BloodComponent;
import com.swp391.entity.BloodComponentCompatibility;
import com.swp391.entity.BloodType;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.BloodComponentCompatibilityMapper;
import com.swp391.repository.BloodComponentCompatibilityRepository;
import com.swp391.repository.BloodComponentRepository;
import com.swp391.repository.BloodTypeRepository;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class LookupService {

    BloodComponentRepository componentRepository;
    BloodTypeRepository bloodTypeRepository;
    BloodComponentCompatibilityRepository compatibilityRepository;
    BloodComponentCompatibilityMapper mapper;

    public BloodComponentCompatibilityResponse searchCompatibility(int componentId, int bloodTypeId) {

        // ✅ Trường hợp chỉ có bloodTypeId: lấy donor và recipient từ bloodType
        if (componentId == 0) {
            BloodType type = bloodTypeRepository.findById(bloodTypeId)
                    .orElseThrow(() -> new AppException(ErrorCode.BLOOD_TYPE_NOT_FOUND));

            List<BloodType> canDonateTo = bloodTypeRepository
                    .findAllByNameIn(List.of(type.getCanDonateTo().split(",\\s*")));

            List<BloodType> canReceiveFrom = bloodTypeRepository
                    .findAllByNameIn(List.of(type.getCanReceiveFrom().split(",\\s*")));

            return BloodComponentCompatibilityResponse.builder()
                    .bloodTypeId(type.getId())
                    .bloodTypeName(type.getName())
                    .canDonateTo(canDonateTo)
                    .canReceiveFrom(canReceiveFrom)
                    .build();
        }

        // ✅ Trường hợp chỉ có componentId: trả về mô tả
        if (bloodTypeId == 0) {
            BloodComponent component = componentRepository.findById(componentId)
                    .orElseThrow(() -> new AppException(ErrorCode.BLOOD_COMPONENT_NOT_FOUND));

            return BloodComponentCompatibilityResponse.builder()
                    .componentId(component.getId())
                    .componentName(component.getName())
                    .description(component.getDescription())
                    .build();
        }

        // ✅ Trường hợp cả hai: lấy donor & recipient từ bảng compatibility
        List<BloodComponentCompatibility> list = compatibilityRepository
                .findByComponentIdAndType(componentId, bloodTypeId);

        List<BloodType> canDonateTo = list.stream()
                .filter(c -> c.getDonor().getId() == bloodTypeId)
                .map(BloodComponentCompatibility::getRecipient)
                .distinct()
                .toList();

        List<BloodType> canReceiveFrom = list.stream()
                .filter(c -> c.getRecipient().getId() == bloodTypeId)
                .map(BloodComponentCompatibility::getDonor)
                .distinct()
                .toList();

        BloodComponent component = componentRepository.findById(componentId)
                .orElseThrow(() -> new AppException(ErrorCode.BLOOD_COMPONENT_NOT_FOUND));
        BloodType type = bloodTypeRepository.findById(bloodTypeId)
                .orElseThrow(() -> new AppException(ErrorCode.BLOOD_TYPE_NOT_FOUND));

        return BloodComponentCompatibilityResponse.builder()
                .componentId(componentId)
                .componentName(component.getName())
                .description(component.getDescription())
                .bloodTypeId(type.getId())
                .bloodTypeName(type.getName())
                .canDonateTo(canDonateTo)
                .canReceiveFrom(canReceiveFrom)
                .build();
    }
}
