window.onload = function() {
}

var map;
var markers = [];
var infoWindow;

function initMap() {
    var indianapolis = {
        lat: 39.833332, 
        lng: -98.583336
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: indianapolis,
        zoom:11,
        mapTypeId: 'satellite',
    });

    infoWindow = new google.maps.InfoWindow();
    searchStores();
}

function searchStores(){
    var foundStores = [];
    var zipCode = document.getElementById('zip-code-input').value;
    if(zipCode){
        for(var market of markets){
            var postal = market['FMID__10'];
            if(postal == zipCode){
                foundStores.push(market);
            }
        }
    } else {
        foundStores = markets;
    }
    clearLocations();
    displayStores(foundStores);
    showStoresMarkers(foundStores);
    setOnClickListener();
}

function clearLocations(){
    infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
}

function setOnClickListener(){
    var storeElements = document.querySelectorAll('.store-container');
    storeElements.forEach(function(elem, index){
        elem.addEventListener('click', function(){
            new google.maps.event.trigger(markers[index], 'click');
        })
    })
}

function displayStores(markets){
    var storesHtml = '';
    for(var [index, market] of markets.entries()){
        var address = market['FMID__7'];
        var socialMedia = market['FMID__2'];
            var postal = market['FMID__10'];
        storesHtml += `
            <div class="store-container">
                <div class="store-container-background">
                    <div class="store-info-container">
                        <div class="store-address">
                            <span>${address}</span>
                            <span>${postal}</span>
                        </div>
                        <div class="store-phone-number">${socialMedia}</div>
                    </div>
                    <div class="store-number-container">
                        <div class="store-number">
                            ${index+1}
                        </div>
                    </div>
                </div>
            </div>
        `
        document.querySelector('.stores-list').innerHTML = storesHtml;
    }
}


function showStoresMarkers(markets){
    var bounds = new google.maps.LatLngBounds();
    for(var [index, market] of markets.entries()){
        var latlng = new google.maps.LatLng(
            market["FMID__21"],
            market["FMID__20"]);
        var name = market['FMID__1'];
        var address = market['FMID__7'];
        var socialMedia = market['FMID__2'];
        var postal = market['FMID__10'];
        var openStatusText = market["FMID__13"];

        bounds.extend(latlng);
        createMarker(latlng, name, address, openStatusText, socialMedia, postal, index+1);
    }
    map.fitBounds(bounds);
}

function createMarker(latlng, name, address, openStatusText, socialMedia,postal, index){
    var html = `
        <div class="store-info-window">
            <div class="store-info-name">
                ${name}
            </div>
            <div class="store-info-status">
                ${openStatusText}
            </div>
            <div class="store-info-address">
                <div class="circle">
                    <i class="fas fa-location-arrow"></i>
                </div>
                <a href = "https://www.google.com/maps/dir/?api=1&destination=39.833332,-98.583336" target = "blank">
                <span src = "https://www.google.com/maps/dir/?api=1&query=latlng">${address}</span><br>
                </a>
                <span>${postal}</span>
            </div>
            <div class="store-info-phone">
                <div class="circle">
                    <i class="fas fa-phone-alt"></i>
                </div>
                ${socialMedia}
            </div>
        </div>
    `;
    var icon = {
      url: 'style/tester-carrot.png'  //Created by Freepik on flaticon.com
    };
    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      icon:icon,
      label: index.toString()
    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
    });
    markers.push(marker);
    
}