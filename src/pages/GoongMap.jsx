import React, { useEffect, useRef } from "react";
import GoongMapGL from "@goongmaps/goong-js";
import "@goongmaps/goong-js/dist/goong-js.css";

GoongMapGL.accessToken = "dLLZb0IXCxlzZP815YgypEH6oX9tnxDkLo03T5rK";

const GoongMap = ({ center, donors, selectedRoute }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Khởi tạo bản đồ và marker
  useEffect(() => {
    if (!center) return;

    map.current = new GoongMapGL.Map({
      container: mapContainer.current,
      style: "https://tiles.goong.io/assets/goong_map_web.json",
      center: [center.longitude, center.latitude],
      zoom: 12,
    });

    // Thêm marker nhà tài trợ
    donors.forEach((donor) => {
      new GoongMapGL.Marker()
        .setLngLat([donor.longitude, donor.latitude])
        .setPopup(
          new GoongMapGL.Popup().setHTML(`
            <h3>${donor.name}</h3>
            <p>${donor.address}</p>
            <p>Nhóm máu: ${donor.bloodType}</p>
            <p>Khoảng cách: ${donor.distance.toFixed(2)} km</p>
          `)
        )
        .addTo(map.current);
    });

    // Thêm marker địa chỉ người tìm
    new GoongMapGL.Marker({ color: "red" })
      .setLngLat([center.longitude, center.latitude])
      .setPopup(new GoongMapGL.Popup().setHTML("<h3>Vị trí của bạn</h3>"))
      .addTo(map.current);

    return () => map.current.remove();
  }, [center, donors]);

  // Vẽ tuyến đường nếu selectedRoute thay đổi
  useEffect(() => {
    if (map.current && selectedRoute) {
      const routeGeoJSON = {
        type: "Feature",
        properties: {},
        geometry: {
          type: "LineString",
          coordinates: selectedRoute.map(coord => [coord.lng, coord.lat]), // đúng định dạng GeoJSON
        },
      };
  
      if (map.current.getSource("route")) {
        map.current.getSource("route").setData(routeGeoJSON);
      } else {
        map.current.addSource("route", {
          type: "geojson",
          data: routeGeoJSON,
        });
  
        map.current.addLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#007bff",
            "line-width": 6,
          },
        });
      }
    }
  }, [selectedRoute]);
  

  return <div ref={mapContainer} style={{ width: "100%", height: "400px" }} />;
};

export default GoongMap;
