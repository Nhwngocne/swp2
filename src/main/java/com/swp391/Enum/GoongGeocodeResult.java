package com.swp391.Enum;

import lombok.Data;

@Data
public class GoongGeocodeResult {
    private String formatted_address;
    private Geometry geometry;
}
