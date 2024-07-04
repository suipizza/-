var top5Facilities1 = [];
var bestFacilities2 = [];
var closestRentalStations = [];
var currentlyOpenedCourse = null; // 현재 열려 있는 코스를 추적


// 네이버 지도 길찾기 URL을 새 탭에서 열기 위한 함수 추가
function openNaverMap(startLat, startLng, startName, endLat, endLng, endName) {
    const startLocation = `${startLat},${startLng},${encodeURIComponent(startName + '자전거대여소')}`;
    const endLocation = `${endLat},${endLng},${encodeURIComponent(endName + '자전거대여소')}`;
    const naverMapUrl = `https://map.naver.com/p/directions/${startLocation},PLACE_POI/${endLocation},PLACE_POI/-/bike?c=15.00,0,0,0,dh`;
    window.open(naverMapUrl, '_blank');
}




// Haversine 공식을 사용한 거리 계산 함수
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // 지구 반경(km)
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
        0.5 - Math.cos(dLat)/2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        (1 - Math.cos(dLng))/2;

    return R * 2 * Math.asin(Math.sqrt(a));
}

// 값을 정규화하는 함수.
function normalize(value, min, max) {
    return (value - min) / (max - min);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('filterButton').addEventListener('click', function() {
        var category1 = document.getElementById('categoryDropdown1').value;
        var category2 = document.getElementById('categoryDropdown2').value;

        var url = `/filter/${region}/?category1=` + category1 + `&category2=` + category2;
        console.log(`Fetching URL: ${url}`);

        fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log('Category 1 Filtered Facilities:', data.filtered_facilities1);
                console.log('Category 2 Filtered Facilities:', data.filtered_facilities2);
                console.log('Rental Locations in Region:', data.rental_locations);

                if (data.filtered_facilities1.length === 0 || data.filtered_facilities2.length === 0) {
                    let missingCategory = '';

                    if (data.filtered_facilities1.length === 0 && data.filtered_facilities2.length === 0) {
                        missingCategory = `${category1}와 ${category2}`;
                    } else if (data.filtered_facilities1.length === 0) {
                        missingCategory = category1;
                    } else if (data.filtered_facilities2.length === 0) {
                        missingCategory = category2;
                    }

                    alert(`해당 지역구에는 ${missingCategory}이(가) 없습니다. 다른 카테고리를 선택해주세요.`);
                    return;
                }

                if (selectedLat !== null && selectedLng !== null) {
                    let facilities1 = data.filtered_facilities1.map(facility => {
                        let distance = calculateDistance(selectedLat, selectedLng, facility.latitude, facility.longitude);
                        return {
                            ...facility,
                            distance: distance
                        };
                    });

                    // 거리와 평점의 최소값과 최대값 계산
                    let minDistance1 = Math.min(...facilities1.map(f => f.distance));
                    let maxDistance1 = Math.max(...facilities1.map(f => f.distance));
                    let minRate1 = Math.min(...facilities1.map(f => f.rate));
                    let maxRate1 = Math.max(...facilities1.map(f => f.rate));

                    facilities1 = facilities1.map(facility => {
                        let normalizedDistance = normalize(facility.distance, minDistance1, maxDistance1);
                        let normalizedRate = normalize(facility.rate, minRate1, maxRate1);
                        let score = (0.2*(1 - normalizedDistance)) + 0.8*(normalizedRate); // 거리 점수를 최소화하고 평점 점수를 최대화
                        return {
                            ...facility,
                            normalizedDistance: normalizedDistance,
                            normalizedRate: normalizedRate,
                            score: score
                        };
                    });

                    facilities1.sort((a, b) => b.score - a.score);
                    // 높은 순서로 정렬된 상위 5개의 시설만 선택
                    top5Facilities1 = facilities1.slice(0, 5); // 상위 5개 시설 선택

                    console.log('Top 5 Facilities by Score:', top5Facilities1);


                    // 각 카테고리 1 시설마다 가장 가까운 대여소 찾기
                    let closestRentalStations = top5Facilities1.map(facility1 => {
                        let closestRental = data.rental_locations.reduce((prev, curr) => {
                            let prevDistance = calculateDistance(facility1.latitude, facility1.longitude, prev.latitude, prev.longitude);
                            let currDistance = calculateDistance(facility1.latitude, facility1.longitude, curr.latitude, curr.longitude);
                            return (currDistance < prevDistance) ? curr : prev;
                        });

                        return {
                            facility: facility1,
                            closestRental: closestRental
                        };
                    });

                    console.log('Closest Rental Stations for Top 5 Facilities:', closestRentalStations);

                    // 각 카테고리 1 시설마다 카테고리 2 시설에서 가장 가까운 베스트 1 시설 찾기
                    bestFacilities2 = top5Facilities1.map(facility1 => {
                        let facilities2 = data.filtered_facilities2.map(facility2 => {
                            let distance = calculateDistance(facility1.latitude, facility1.longitude, facility2.latitude, facility2.longitude);
                            return {
                                ...facility2,
                                distance: distance
                            };
                        });

                        // 거리와 평점의 최소값과 최대값 계산
                        let minDistance2 = Math.min(...facilities2.map(f => f.distance));
                        let maxDistance2 = Math.max(...facilities2.map(f => f.distance));
                        let minRate2 = Math.min(...facilities2.map(f => f.rate));
                        let maxRate2 = Math.max(...facilities2.map(f => f.rate));

                        facilities2 = facilities2.map(facility2 => {
                            let normalizedDistance = normalize(facility2.distance, minDistance2, maxDistance2);
                            let normalizedRate = normalize(facility2.rate, minRate2, maxRate2);
                            let score = (0.85*(1 - normalizedDistance)) + (0.15* normalizedRate); // 거리 점수를 최소화하고 평점 점수를 최대화
                            return {
                                ...facility2,
                                normalizedDistance: normalizedDistance,
                                normalizedRate: normalizedRate,
                                score: score
                            };
                        });

                        facilities2.sort((a, b) => b.score - a.score);
                        return facilities2[0]; // 가장 높은 점수를 가진 카테고리 2 시설 반환
                    });

                    console.log('Best Facilities for Each Top 5 Category 1 Facility:', bestFacilities2);

                    // 추가: top5Facilities1 또는 bestFacilities2가 비어 있는지 확인
                    if (top5Facilities1.length === 0 || bestFacilities2.length === 0) {
                        alert('선택한 카테고리에 해당하는 문화시설이 없습니다. 다른 카테고리를 선택해주세요.');
                        return;
                    }

                    // 각 코스를 HTML로 표시
                    const resultsContainer = document.getElementById('results');
                    resultsContainer.innerHTML = ''; // 기존 결과 초기화


                    // 결과를 HTML에 표시
                    let coursesDiv = document.getElementById('courses');
                    coursesDiv.innerHTML = '';

                    top5Facilities1.forEach((facility1, index) => {
                        let courseDiv = document.createElement('div');
                        courseDiv.classList.add('course');

                        // 거리 계산
                        let distanceAtoB = calculateDistance(selectedLat, selectedLng, closestRentalStations[index].closestRental.latitude, closestRentalStations[index].closestRental.longitude).toFixed(2);
                        let distanceBtoFacility1 = calculateDistance(closestRentalStations[index].closestRental.latitude, closestRentalStations[index].closestRental.longitude, facility1.latitude, facility1.longitude).toFixed(2);
                        let distanceFacility1toFacility2 = calculateDistance(facility1.latitude, facility1.longitude, bestFacilities2[index].latitude, bestFacilities2[index].longitude).toFixed(2);

                        courseDiv.innerHTML = `
                            <h3>🔽 코스 ${String.fromCharCode(65 + index)}</h3>
                            <div class="details" style="display: none;">
                                <p><strong><u>사용자가 선택한 대여소:</u></strong> ${selectedRentalStation.name}</p>
                                <p><strong><u>반납할 대여소:</u></strong> ${closestRentalStations[index].closestRental.name} (${distanceAtoB} km)</p>
                                <p><strong><u>첫 번째 문화시설:</u></strong> ${facility1.name} (${distanceBtoFacility1} km)</p>
                                <p><strong><u>두 번째 문화시설:</u></strong> ${bestFacilities2[index].name} (${distanceFacility1toFacility2} km)</p>
                                <button class="details-button" onclick="openNaverMap(${selectedLat}, ${selectedLng}, '${selectedRentalStation.name}', ${closestRentalStations[index].closestRental.latitude}, ${closestRentalStations[index].closestRental.longitude}, '${closestRentalStations[index].closestRental.name}')">자세히</button>

                            </div>
                        `;
                         courseDiv.addEventListener('click', function () {
                            let detailsDiv = this.querySelector('.details');

                            // 현재 열려 있는 코스가 있으면 닫기
                            if (currentlyOpenedCourse && currentlyOpenedCourse !== detailsDiv) {
                                currentlyOpenedCourse.style.display = 'none';
                            }

                            detailsDiv.style.display = (detailsDiv.style.display === 'none') ? 'block' : 'none';

                            // 현재 열린 코스를 업데이트
                            currentlyOpenedCourse = detailsDiv.style.display === 'none' ? null : detailsDiv;

                            // 선택된 코스의 정보를 콘솔에 출력
                            console.log('사용자가 선택한 대여소:', {
                                name: selectedRentalStation.name,
                                latitude: selectedLat,
                                longitude: selectedLng
                            });

                            console.log('반납할 대여소:', {
                                name: closestRentalStations[index].closestRental.name,
                                latitude: closestRentalStations[index].closestRental.latitude,
                                longitude: closestRentalStations[index].closestRental.longitude
                            });

                            console.log('카테고리 1 문화시설:', {
                                name: facility1.name,
                                latitude: facility1.latitude,
                                longitude: facility1.longitude
                            });

                            console.log('카테고리 2 문화시설:', {
                                name: bestFacilities2[index].name,
                                latitude: bestFacilities2[index].latitude,
                                longitude: bestFacilities2[index].longitude
                            });

                            // 선택된 코스의 선을 그림
                            drawCourseLines(selectedRentalStation, closestRentalStations[index].closestRental, facility1, bestFacilities2[index]);



                         });
                        coursesDiv.appendChild(courseDiv);
                    });



                } else {
                    alert('대여소가 선택되지 않았습니다.');
                    console.error('대여소가 선택되지 않았습니다.');
                }
            })
            .catch(error => console.error('Error fetching filtered facilities:', error));
    });
});