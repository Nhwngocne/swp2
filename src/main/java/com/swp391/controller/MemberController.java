package com.swp391.controller;

import com.swp391.dto.request.MemberCreateRequest;
import com.swp391.dto.response.ApiResponse;
import com.swp391.dto.response.MemberResponse;
import com.swp391.service.MemberService;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/members")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class MemberController {
    MemberService memberService;

    //create
    @PostMapping
    public ApiResponse<MemberResponse> createMember(@RequestBody @Valid MemberCreateRequest request) {
        return ApiResponse.<MemberResponse>builder()
                .result(memberService.createMember(request))
                .build();
    }
    //update
    @PutMapping("/{memberId}")
    public ApiResponse<MemberResponse> updateMember(
            @PathVariable int memberId,
            @RequestBody @Valid MemberCreateRequest request) {
        return ApiResponse.<MemberResponse>builder()
                .result(memberService.updateMember(request, memberId))
                .build();
    }
    //delete
    @DeleteMapping("/{memberId}")
    public ApiResponse<String> deleteMember(@PathVariable int memberId) {
        memberService.deleteMember(memberId);
        return ApiResponse.<String>builder()
                .result("Member has been deleted")
                .build();
    }
    //getAll
    @GetMapping
    public ApiResponse<List<MemberResponse>> getAllMembers() {
        return ApiResponse.<List<MemberResponse>>builder()
                .result(memberService.getAllMembers())
                .build();
    }
    //getMemberById
    @GetMapping("/{memberId}")
    public ApiResponse<MemberResponse> getMemberById(@PathVariable int memberId) {
        return ApiResponse.<MemberResponse>builder()
                .result(memberService.getMemberById(memberId))
                .build();
    }

}
