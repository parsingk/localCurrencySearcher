const greenMarker = "/img/greenMarker.png";
const green = 'lawngreen';
const apiUrl = '/data';
const range = '1000';

let centerLat = 37.394914;
let centerLng = 127.1100797;
let container = document.getElementById('map');
let options = { //지도를 생성할 때 필요한 기본 옵션
    center: new kakao.maps.LatLng(centerLat, centerLng), //지도의 중심좌표.
    level: 5 //지도의 레벨(확대, 축소 정도)
};

let map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
let markers = [];

function setCurrentPosition() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            centerLat = position.coords.latitude; // 위도
            centerLng = position.coords.longitude; // 경도

            let locPosition = new kakao.maps.LatLng(centerLat, centerLng);

            let query = '?lat=' + centerLat + '&lng=' + centerLng + '&m=' + range;
            httpGetAsync(apiUrl + query, displayMarker);
            map.setCenter(locPosition);
        });
    }
}

kakao.maps.event.addListener(map, 'dragend', function() {
    let latlng = map.getCenter();
    centerLat = latlng.getLat();
    centerLng = latlng.getLng();

    let query = '?lat=' + centerLat + '&lng=' + centerLng + '&m=' + range;
    httpGetAsync(apiUrl + query, displayMarker);
});

function isMarkerOnMap(lat, lng, arr = []) {
    let find = arr.find(o => o.lat == lat && o.lng == lng);
    if(find !== undefined) {
        lng = lng + 0.000065;
        return isMarkerOnMap(lat, lng, arr);
    }

    return parseFloat(lng.toFixed(7));
}

function displayMarker(arr) {
    let latLngArray = [];
    let lat = null;
    let lng = null;

    markers.forEach(function (m) {
        m.setMap(null);
    });

    markers = [];

    arr.forEach(function (store) {
        lat = store.geo_location.y;
        lng = store.geo_location.x;
        lng = isMarkerOnMap(lat, lng, latLngArray);

        let markerPath = greenMarker;
        let imageSize = new kakao.maps.Size(24, 35);
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
            overlay.setMap(map);
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
    title.style.backgroundColor = color;
    title.style.color = 'black';
    title.appendChild(document.createTextNode(store.name));

    let closeBtn = document.createElement('div');
    closeBtn.classList.add('close');
    closeBtn.onclick = function() { overlay.setMap(null); };

    let body = document.createElement('div');
    body.classList.add('body');
    body.appendChild(document.createTextNode('tel : ' + store.tel));

    content.appendChild(info);
    info.appendChild(title);
    info.appendChild(body);

    title.appendChild(closeBtn);

    return content;
}

function httpGetAsync(theUrl, callback)
{
    let xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(JSON.parse(xmlHttp.responseText));
    };
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send();
}

document.addEventListener("DOMContentLoaded", function(event) {
    setCurrentPosition();
});