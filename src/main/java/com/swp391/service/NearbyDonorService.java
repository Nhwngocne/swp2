package com.swp391.service;


import com.swp391.Enum.GoongDistanceMatrixResponse;
import com.swp391.Enum.GoongGeocodeResponse;
import com.swp391.Enum.GoongGeocodeResult;
import com.swp391.Enum.LatLong;
import com.swp391.dto.request.DonorSearchRequest;
import com.swp391.dto.response.DonorResponse;
import com.swp391.entity.NearbyDonor;
import com.swp391.exception.AppException;
import com.swp391.exception.ErrorCode;
import com.swp391.mapper.NearbyDonorMapper;
import com.swp391.repository.NearbyDonorRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class NearbyDonorService {
    NearbyDonorRepository donorRepository;
    NearbyDonorMapper donorMapper;
    RestTemplate restTemplate;

    @NonFinal
    @Value("${goong.api.key}")
    String goongApiKey;

    @NonFinal
    @Value("${goong.geocode.url}")
    String geocodeUrl;

    @NonFinal
    @Value("${goong.distance.matrix.url}")
    String distanceMatrixUrl;

    public List<DonorResponse> findNearestDonors(DonorSearchRequest request) {
        LatLong requesterLatLong = getLatLongFromAddress(request.getAddress());
        if (requesterLatLong == null) {
            throw new AppException(ErrorCode.INVALID_ADDRESS);
        }

        List<NearbyDonor> donors = donorRepository.findByBloodType(request.getBloodType());

        List<DonorResponse> donorResponses = donors.stream()
                .map(donorMapper::toDonorResponse)
                .peek(response -> {
                    Double distance = getDistance(
                            requesterLatLong,
                            new LatLong(response.getLatitude(), response.getLongitude())
                    );
                    response.setDistance(distance);
                })
                .sorted(Comparator.comparing(DonorResponse::getDistance))
                .limit(10)
                .collect(Collectors.toList());

        return donorResponses;
    }

    public LatLong getLatLongFromAddress(String address) {
        String url = String.format("%s?address=%s&api_key=%s", geocodeUrl, address, goongApiKey);
        GoongGeocodeResponse response = restTemplate.getForObject(url, GoongGeocodeResponse.class);
        if (response != null && response.getResults() != null && !response.getResults().isEmpty()) {
            GoongGeocodeResult result = response.getResults().get(0);
            return new LatLong(
                    result.getGeometry().getLocation().getLat(),
                    result.getGeometry().getLocation().getLng()
            );
        }
        return null;
    }

    private Double getDistance(LatLong origin, LatLong destination) {
        String url = String.format(
                "%s?origins=%s,%s&destinations=%s,%s&api_key=%s",
                distanceMatrixUrl,
                origin.getLatitude(), origin.getLongitude(),
                destination.getLatitude(), destination.getLongitude(),
                goongApiKey
        );
        GoongDistanceMatrixResponse response = restTemplate.getForObject(url, GoongDistanceMatrixResponse.class);
        if (response != null && response.getRows() != null && !response.getRows().isEmpty()) {
            return response.getRows().get(0).getElements().get(0).getDistance().getValue() / 1000.0;
        }
        return Double.MAX_VALUE;
    }
}