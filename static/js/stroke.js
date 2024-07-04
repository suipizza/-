var map; // 전역 변수로 선언
var courseLines = []; // 현재 그려진 코스를 저장하는 배열

function drawCourseLines(selectedRentalStation, closestRentalStation, facility1, facility2) {
    // 기존의 모든 선을 지도에서 제거
    courseLines.forEach(line => line.setMap(null));
    courseLines = [];


    // 바깥 선 스타일
    var outerLineStyles = [
        {color: '#E88D67', thickness: 5},
        {color: '#8DDFCB', thickness: 5, dashArray: [3, 3]},
        {color: '#FFAD84', thickness: 5, dashArray: [1, 1]}
    ];


    // 선 스타일
    var lineStyles = [
        {color: '#FF70AB', thickness: 6},
        {color: '#0802A3', thickness: 6, dashArray: [2, 2]},
        {color: '#DF826C', thickness: 6, dashArray: [1, 1]}
    ];


    // 선A 테두리 : 사용자가 선택한 대여소 -> 반납할 대여소
//    var outerlineA = new naver.maps.Polyline({
//        map: map,
//        path: [
//            new naver.maps.LatLng(selectedLat, selectedLng),
//            new naver.maps.LatLng(closestRentalStation.latitude, closestRentalStation.longitude)
//        ],
//        strokeColor: outerLineStyles[0].color,
//        strokeWeight: outerLineStyles[0].thickness
//
//    });
//    courseLines.push(outerlineA);

    // 선A: 사용자가 선택한 대여소 -> 반납할 대여소
    var lineA = new naver.maps.Polyline({
        map: map,
        path: [
            new naver.maps.LatLng(selectedLat, selectedLng),
            new naver.maps.LatLng(closestRentalStation.latitude, closestRentalStation.longitude)
        ],
        strokeColor: lineStyles[0].color,
        strokeWeight: lineStyles[0].thickness

    });
    courseLines.push(lineA);


    // 선B 테두리: 반납할 대여소 -> 문화시설1
    var outerlineB = new naver.maps.Polyline({
        map: map,
        path: [
            new naver.maps.LatLng(closestRentalStation.latitude, closestRentalStation.longitude),
            new naver.maps.LatLng(facility1.latitude, facility1.longitude)
        ],
        strokeColor: outerLineStyles[1].color,
        strokeWeight: outerLineStyles[1].thickness,
        strokeStyle: 'shortdash',
        strokeDasharray: outerLineStyles[1].dashArray

    });
    courseLines.push(outerlineB);


    // 선B: 반납할 대여소 -> 문화시설1
    var lineB = new naver.maps.Polyline({
        map: map,
        path: [
            new naver.maps.LatLng(closestRentalStation.latitude, closestRentalStation.longitude),
            new naver.maps.LatLng(facility1.latitude, facility1.longitude)
        ],
        strokeColor: lineStyles[1].color,
        strokeWeight: lineStyles[1].thickness,
        strokeStyle: 'shortdash',
        strokeDasharray: lineStyles[1].dashArray

    });
    courseLines.push(lineB);


    // 선C 테두리: 문화시설1 -> 문화시설2
    var outerlineC = new naver.maps.Polyline({
        map: map,
        path: [
            new naver.maps.LatLng(facility1.latitude, facility1.longitude),
            new naver.maps.LatLng(facility2.latitude, facility2.longitude)
        ],
        strokeColor: outerLineStyles[2].color,
        strokeWeight: outerLineStyles[2].thickness,
        strokeStyle: 'shortdash',
        strokeDasharray: outerLineStyles[2].dashArray
    });
    courseLines.push(outerlineC);

    // 선C: 문화시설1 -> 문화시설2
    var lineC = new naver.maps.Polyline({
        map: map,
        path: [
            new naver.maps.LatLng(facility1.latitude, facility1.longitude),
            new naver.maps.LatLng(facility2.latitude, facility2.longitude)
        ],
        strokeColor: lineStyles[2].color,
        strokeWeight: lineStyles[2].thickness,
        strokeStyle: 'shortdash',
        strokeDasharray: lineStyles[2].dashArray


    });
    courseLines.push(lineC);
}