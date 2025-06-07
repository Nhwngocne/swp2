package com.swp391.service;

import com.swp391.dto.request.StaffCreateRequest;
import com.swp391.dto.response.StaffResponse;
import com.swp391.entity.Staff;
import com.swp391.mapper.StaffMapper;
import com.swp391.repository.StaffRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class StaffService {
    StaffRepository staffRepository;
    StaffMapper staffMapper;
    PasswordEncoder passwordEncoder;

    //create staff
    public StaffResponse createStaff(StaffCreateRequest request){
        Staff staff = staffMapper.toStaff(request);
        staff.setPassword(passwordEncoder.encode(staff.getPassword()));
        try{
            staff = staffRepository.save(staff);

        } catch (Exception e) {
            throw new RuntimeException("Error creating staff: " + e.getMessage());
        }
        return staffMapper.toStaffResponse(staff);
    }
    //update staff
    public StaffResponse updateStaff(int id, StaffCreateRequest request) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found with id: " + id));

        staffMapper.updateStaff(staff, request);
        staff.setPassword(passwordEncoder.encode(staff.getPassword()));
        return staffMapper.toStaffResponse(staff);
    }
    //delete staff
    public void deleteStaff(int id) {
        staffRepository.deleteById(id);
    }
    //get all staff
    public List<StaffResponse> getAllStaff() {
        return staffRepository.findAll().stream().map(staffMapper::toStaffResponse).toList();
    }
    // get staff by id
    public StaffResponse getStaffById(int id) {
        Staff staff = staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found with id: " + id));
        return staffMapper.toStaffResponse(staff);
    }
}
