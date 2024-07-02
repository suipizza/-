var map;
var selectedRentalStation = null;
var culturalFacilities = []; // 전역 변수로 정의
var locations = []; // 전역 변수로 정의
var selectedLat = null; // 대여소의 위도를 저장할 변수
var selectedLng = null; // 대여소의 경도를 저장할 변수
var selectedMarker = null; // 선택된 마커를 저장할 변수
var selectedInfowindow = null; // 선택된 마커의 인포윈도우를 저장할 변수



function initMap() {
  var center = new naver.maps.LatLng(centerLat, centerLng);
  var mapOption = {
    center: center,
    level: mapZoom
  };

  // 지도 생성
  map = new naver.maps.Map('map', mapOption);




  // 마커 생성 함수
  function addMarker(position, iconContent, title, infoContent, isRentalStation, facilityObj) {
    var markerOptions = {
      position: position,
      map: map,
      icon: {
        content: `<div style="font-size:13px; font-weight:bold;">${iconContent}</div>`,
        size: new naver.maps.Size(13, 13),
        anchor: new naver.maps.Point(7, 7)
      },
      title: title
    };
    var marker = new naver.maps.Marker(markerOptions);


    // 인포윈도우 스타일
    var contentString = `
      <div style="width:150px;text-align:center;padding:10px; background-color:#dfe7fd; border-radius:20px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">
        <div>${infoContent}</div>
      </div>
    `;

    // 인포윈도우 생성
    var infowindow = new naver.maps.InfoWindow({
      content: contentString,
      borderWidth: 0,
      disableAnchor: true,
      backgroundColor: 'transparent',
      pixelOffset: new naver.maps.Point(0, -10)
      });

    // 마커에 마우스 오버 이벤트 추가
    naver.maps.Event.addListener(marker, 'mouseover', function() {
        infowindow.open(map, marker);

    });

    // 마커에 마우스 아웃 이벤트 추가
    naver.maps.Event.addListener(marker, 'mouseout', function() {
      if (selectedInfowindow !== infowindow) { // 수정된 부분
        infowindow.close();
      }
    });




    // 마커에 마우스 클릭 이벤트 추가
    if (isRentalStation) {
      naver.maps.Event.addListener(marker, 'click', function() {
        // 기존 선택된 마커가 있다면 원래 아이콘으로 변경
        if (selectedMarker && selectedMarker !== marker) {
          selectedMarker.setIcon({
            content: `<div style="font-size:13px; font-weight:bold; color: blue;">🅿️</div>`,
            size: new naver.maps.Size(13, 13),
            anchor: new naver.maps.Point(7, 7)
          });
          if (selectedInfowindow) {
            selectedInfowindow.close(); // 기존 선택된 인포윈도우 닫기
          }
        }

        // 선택된 마커를 새로운 아이콘으로 변경
        marker.setIcon({
          content: `<div style="font-size:30px; font-weight:bold; color: red;">🏁</div>`,
          size: new naver.maps.Size(35, 35),
          anchor: new naver.maps.Point(10, 10)
        });

        // 선택된 마커 저장
        selectedMarker = marker;
        selectedInfowindow = infowindow;

        // 인포윈도우 열린 상태 유지
        infowindow.setContent(contentString);
        infowindow.open(map, marker);

        // 선택된 대여소 정보 업데이트
        selectedRentalStation = {
          lat: position.lat(),
          lng: position.lng(),
          name: title
        };
        selectedLat = position.lat(); // 위도 저장
        selectedLng = position.lng(); // 경도 저장

        document.getElementById('selectedRentalStation').innerText = `선택한 대여소: ${title}`;
        console.log(`대여소 ${title} 클릭됨. 위도: ${selectedLat}, 경도: ${selectedLng}`); // 콘솔에 출력
        alert(`대여소 ${title}가 선택되었습니다.`);
      });
    }
}

  // 이모티콘 설정
  var bikeEmoji = "🅿️";
  var facEmoji = "✅";

  // 예시 대여소 위치 마커
  addMarker(new naver.maps.LatLng(37.5665, 126.9780), bikeEmoji, '서울 시청');
  addMarker(new naver.maps.LatLng(37.57419968, 127.0065918), bikeEmoji, '대여소 2');
  addMarker(new naver.maps.LatLng(37.5796, 126.9770), bikeEmoji, '문화시설 1');


  // Django에서 전달된 JSON 데이터를 사용하여 마커 추가
  locations = JSON.parse(locationsData);
  culturalFacilities = JSON.parse(culturalFacilitiesData);

  // 데이터 구조 확인을 위해 콘솔에 출력
  console.log('Cultural Facilities:', culturalFacilities);
  console.log('Locations:', locations);


  culturalFacilities.forEach(function (facility) {
    var position = new naver.maps.LatLng(facility.fields.latitude, facility.fields.longitude);
    var title = facility.fields.name;
    var address = facility.fields.address;
    var rate = facility.fields.rate;
    var infoContent = `
        <strong>${title}</strong><br>
        <div style="font-size:12px;">${address}</div><br>
        <div style="text-decoration:underline;">평점: ${rate}</div>
    `;
    addMarker(position, facEmoji, title, infoContent, false, facility.pk);
  });




  locations.forEach(function (location) {
    var position = new naver.maps.LatLng(location.fields.latitude, location.fields.longitude);
    var title = location.fields.name;
    addMarker(position, bikeEmoji, title, title, true, location.pk);
    });
  }



