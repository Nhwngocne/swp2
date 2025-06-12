package com.swp391.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {
    //1001: already existed
    USER_EXISTED(1001,"User already exists", HttpStatus.BAD_REQUEST),

    //1002: not existed
    USER_NOT_EXISTED(1002, "User does not exist", HttpStatus.NOT_FOUND),
    FEEDBACK_NOT_EXISTED(1002, "Feedback does not exist", HttpStatus.NOT_FOUND),
    EMERGENCY_NOT_EXISTED(1002, "Emergency does not exist", HttpStatus.NOT_FOUND),
    BLOOD_TYPE_NOT_EXISTED(1002, "Blood type does not exist", HttpStatus.NOT_FOUND),
    BLOOD_INVENTORY_NOT_EXISTED(1002, "Blood inventory does not exist", HttpStatus.NOT_FOUND),
    BLOG_NOT_EXISTED(1002, "Blog does not exist", HttpStatus.NOT_FOUND),
    NEAR_BY_DONOR_NOT_EXISTED(1002, "NearbyDonor does not exist", HttpStatus.NOT_FOUND),
    Donation_REGISTRATION_NOT_EXISTED(1002, "Donation registration does not exist", HttpStatus.NOT_FOUND),
    Donation_HISTORY_NOT_EXISTED(1002, "Donation history does not exist", HttpStatus.NOT_FOUND),
    Donation_RECEIVE_NOT_EXISTED(1002, "Donation receive does not exist", HttpStatus.NOT_FOUND),
    Donation_REGISTRATION_OFFLINE_NOT_EXISTED(1002, "Donation registration offline does not exist", HttpStatus.NOT_FOUND),

    //1006:Unauthenticated
    UNAUTHENTICATED(1006, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    ;

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }


}
