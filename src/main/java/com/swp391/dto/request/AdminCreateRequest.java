package com.swp391.dto.request;

import com.swp391.Enum.Gender;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AdminCreateRequest {
    @NotBlank(message = "Name cannot be blank")
    @Size(max = 100, message = "Name maximum 100 characters")
    String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email không hợp lệ")
    @Size(max = 100, message = "Email tối đa 100 ký tự")
    String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 100, message = "Password from 6 to 100 characters")
    String password;

    Gender gender;

    String phone;

    String numberCccd;

    String address;
}

