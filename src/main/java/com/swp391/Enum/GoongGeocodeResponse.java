package com.swp391.Enum;

import lombok.Data;

import java.util.List;

@Data
public class GoongGeocodeResponse {
    private String status;
    private List<GoongGeocodeResult> results;
}
