const greenMarker = "/img/greenMarker.png";
const coffeeMarker = "/img/coffee.png";
const dinnerMarker = "/img/dinner.png";
const storeMarker = "/img/store.png";
const martMarker = "/img/mart.png";
const bakeryMarker = "/img/bakery.png";
const hairMarker = "/img/barbershop.png";
const fuelMarker = "/img/fuel.png";
const redMarker = "/img/red_location.png";

const green = 'lawngreen';
const apiUrl = '/data';

let centerLat = 37.394914;
let centerLng = 127.1100797;
let container = document.getElementById('map');
let options = { //지도를 생성할 때 필요한 기본 옵션
    center: new kakao.maps.LatLng(centerLat, centerLng), //지도의 중심좌표.
    level: 5 //지도의 레벨(확대, 축소 정도)
};

let map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
let markers = [];
let circle = null;
let g_overlay = null;

function setCurrentPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            centerLat = position.coords.latitude; // 위도
            centerLng = position.coords.longitude; // 경도

            let locPosition = new kakao.maps.LatLng(centerLat, centerLng);

            let query = '?lat=' + centerLat + '&lng=' + centerLng;
            httpGetAsync(apiUrl + query, displayMarker);
            map.setCenter(locPosition);
        }, function(err) {
            console.log(err);
            if(err.TIMEOUT) {
                console.log('Get Current Position Timeout.');
            }
        }, {timeout: 5000});
    }
}

kakao.maps.event.addListener(map, 'dragend', function() {
    let latlng = map.getCenter();
    centerLat = latlng.getLat();
    centerLng = latlng.getLng();

    // let query = '?lat=' + centerLat + '&lng=' + centerLng + '&m=' + range;
    // httpGetAsync(apiUrl + query, displayMarker);
});

function isMarkerOnMap(lat, lng, arr = []) {
    let find = arr.find(o => o.lat == lat && o.lng == lng);
    if(find !== undefined) {
        lng = lng + 0.000065;
        return isMarkerOnMap(lat, lng, arr);
    }

    return parseFloat(lng.toFixed(7));
}

//0 기본\n1 음식점\n2 편의점\n3 카페\n4 베이커리, 떡, 샌드위치\n5 피자\n6 치킨\n\n101 헤어샵\n102 마트
function getMarkerImg(type) {
    return redMarker;
    // switch (type) {
    //     case 1 :
    //     case 5 :
    //     case 6 :
    //         return dinnerMarker;
    //     case 2 :
    //         return storeMarker;
    //     case 3 :
    //         return coffeeMarker;
    //     case 4 :
    //         return bakeryMarker;
    //     case 8 :
    //         return fuelMarker;
    //     case 101 :
    //         return hairMarker;
    //     case 102 :
    //         return martMarker;
    //     default :
    //         return greenMarker;
    // }
}

function displayMarker(arr, isSearch) {
    let latLngArray = [];
    let lat = null;
    let lng = null;
    let imageSize = null;

    markers.forEach(function (m) {
        m.setMap(null);
    });

    markers = [];

    if(isSearch) {
        map.setLevel(9);
    }

    arr.forEach(function (store) {
        lat = store.geo_location.y;
        lng = store.geo_location.x;
        lng = isMarkerOnMap(lat, lng, latLngArray);

        let type = store.type;
        let markerPath = getMarkerImg(type);

        imageSize = new kakao.maps.Size(22, 26);
        let markerImage = new kakao.maps.MarkerImage(markerPath, imageSize);
        let marker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(lat, lng),
            image : markerImage
        });

        let overlay = new kakao.maps.CustomOverlay({
            position: marker.getPosition()
        });

        let content = getOverlayContent(store, overlay);
        overlay.setContent(content);

        latLngArray.push({
            lat : lat,
            lng : lng
        });
        markers.push(marker);
        kakao.maps.event.addListener(marker, 'click', function() {
            if(g_overlay != null) {
                g_overlay.setMap(null);
            }

            overlay.setMap(map);
            g_overlay = overlay;
        });
    });
}

function getOverlayContent(store, overlay) {
    let content = document.createElement('div');
    content.classList.add('wrap');

    let info = document.createElement('div');
    info.classList.add('info');

    let title = document.createElement('div');
    let color = green;
    title.classList.add('title');
    // title.style.backgroundColor = color;
    title.style.color = 'black';
    title.appendChild(document.createTextNode(store.name));

    let closeBtn = document.createElement('div');
    closeBtn.classList.add('close');
    closeBtn.onclick = function() { overlay.setMap(null); };

    let body = document.createElement('div');
    body.classList.add('body');

    let bodyTop = document.createElement('div');
    if(store.addr_road.length > 0) {
        bodyTop.appendChild(document.createTextNode('주소: ' + store.addr_road));
    } else {
        bodyTop.appendChild(document.createTextNode('주소: ' + store.addr));
    }

    let bodyBottom = document.createElement('div');
    if(store.tel.length > 0) {
        bodyBottom.appendChild(document.createTextNode('tel : ' + store.tel));
    }

    body.appendChild(bodyTop);
    body.appendChild(bodyBottom);

    content.appendChild(info);
    info.appendChild(title);
    info.appendChild(body);

    title.appendChild(closeBtn);

    return content;
}

function displayCircle() {
    if(circle != null) circle.setMap(null);

    circle = new kakao.maps.Circle({
        center : new kakao.maps.LatLng(centerLat, centerLng),  // 원의 중심좌표 입니다
        radius: 700, // 미터 단위의 원의 반지름입니다
        strokeWeight: 1, // 선의 두께입니다
        strokeColor: '#75B8FA', // 선의 색깔입니다
        strokeOpacity: 1, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
        strokeStyle: 'solid', // 선의 스타일 입니다
        fillColor: '#CFE7FF', // 채우기 색깔입니다
        fillOpacity: 0.5  // 채우기 불투명도 입니다
    });

    circle.setMap(map);
}

function httpGetAsync(theUrl, callback, isSearch) {
    $("#loading").modal('show');

    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200) {
                callback(JSON.parse(xmlHttp.responseText), isSearch);
            } else {
                $("#errorModal").modal('show');
            }
            $("#loading").modal('hide');
        }
    };
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send();
}

document.addEventListener("DOMContentLoaded", function(event) {
    $('#alertModal').modal('show');
    setCurrentPosition();

    $("#searchText").keypress(function(e) {
        if(e.keyCode == 13) {
            let search = $("#searchText").val();

            if(search.length === 0) return;

            httpGetAsync(apiUrl + '?search=' + search, displayMarker, true);
            if(circle != null) circle.setMap(null);
            $("#searchText").blur();
        }
    });

    $("#btn-search").click(function () {
        let search = $("#searchText").val();

        if(search.length === 0) return;

        httpGetAsync(apiUrl + '?search=' + search, displayMarker, true);
        if(circle != null) circle.setMap(null);
    });

    //0 기본\n1 음식점\n2 편의점\n3 카페\n4 베이커리, 떡, 샌드위치\n5 피자\n6 치킨\n\n101 헤어샵\n102 마트 103병원 104약국
    $("#dinner").click(function () {
        let query = '?lat=' + centerLat + '&lng=' + centerLng + '&type=1';
        httpGetAsync(apiUrl + query, displayMarker);
        displayCircle();
    });
    $("#mart").click(function () {
        let query = '?lat=' + centerLat + '&lng=' + centerLng + '&type=2';
        httpGetAsync(apiUrl + query, displayMarker);
        displayCircle();
    });
    $("#cafe").click(function () {
        let query = '?lat=' + centerLat + '&lng=' + centerLng + '&type=3';
        httpGetAsync(apiUrl + query, displayMarker);
        displayCircle();
    });
    $("#bakery").click(function () {
        let query = '?lat=' + centerLat + '&lng=' + centerLng + '&type=4';
        httpGetAsync(apiUrl + query, displayMarker);
        displayCircle();
    });
    $("#hair").click(function () {
        let query = '?lat=' + centerLat + '&lng=' + centerLng + '&type=101';
        httpGetAsync(apiUrl + query, displayMarker);
        displayCircle();
    });
    $("#fuel").click(function () {
        let query = '?lat=' + centerLat + '&lng=' + centerLng + '&type=8';
        httpGetAsync(apiUrl + query, displayMarker, true);
        displayCircle();
    });
    $("#hospital").click(function () {
        let query = '?lat=' + centerLat + '&lng=' + centerLng + '&type=103';
        httpGetAsync(apiUrl + query, displayMarker);
        displayCircle();
    });
    $("#etc").click(function () {
        let query = '?lat=' + centerLat + '&lng=' + centerLng + '&type=0';
        httpGetAsync(apiUrl + query, displayMarker);
        displayCircle();
    });
});
