package com.swp391.Enum;

import lombok.Data;

@Data
public class LatLong {
    private final double latitude;
    private final double longitude;

    public LatLong(double latitude, double longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
