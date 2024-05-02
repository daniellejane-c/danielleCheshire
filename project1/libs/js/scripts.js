var map;
var layerControl;
var proximityRadius = 2;
var airportsMarkers;
var citiesMarkers;
var castlesMarkers;
var userCountry = "";
var userCountryCode = "";
var currencySymbol = '';


// Create map layers
var streets = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
});
var satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
});

var basemaps = {
    "Streets": streets,
    "Satellite": satellite,
};

setTimeout(function(){
    var preloader = document.getElementById('preloader');
 // Remove loading class to remove blue background

    // Show the #content element after the delay
    var content = document.getElementById('content');
    content.style.visibility = 'visible'; // Assuming the initial display property is set to 'none'
    preloader.style.display = 'none';
    document.body.classList.remove('loading');
}, 3000);
      
$(document).ready(function () {


    map = L.map("map", {
        layers: [streets]
    }).setView([51.505, -0.09], 6);

    layerControl = L.control.layers(basemaps).addTo(map);


    // Initialize marker cluster group
    airportsMarkers = L.markerClusterGroup();
    citiesMarkers = L.markerClusterGroup();
    castlesMarkers = L.markerClusterGroup();

    // Add the marker cluster group to the map
    map.addLayer(airportsMarkers);
    map.addLayer(citiesMarkers);
    map.addLayer(castlesMarkers);

    layerControl.addOverlay(airportsMarkers, "Airports");
    layerControl.addOverlay(citiesMarkers, "Cities");
    layerControl.addOverlay(castlesMarkers, "Castles");

    map.on('overlayremove', function (layer) {
        if (layer === airportsMarkers) {
            airportsMarkers.clearLayers();
        } else if (layer === citiesMarkers) {
            citiesMarkers.clearLayers();
        } else if (layer === castlesMarkers) {
            castlesMarkers.clearLayers();
        }
    });



    var isLocationFound = false;

    //buttons 
    L.easyButton("fa fa-info", function () {
        $("#countryModal").modal("show");
    }).addTo(map);

    L.easyButton("fa fa-cloud-sun", function () {
        $("#weatherModal").modal("show");
    }).addTo(map);

    L.easyButton("fa-brands fa-wikipedia-w", function () {
        $("#wikiModal").modal("show");
    }).addTo(map);

    L.easyButton("fa-regular fa-newspaper", function () {
        $("#newsModal").modal("show");
    }).addTo(map);

    L.easyButton("fa-solid fa-coins", function () {
        $("#currencyModal").modal("show");
    }).addTo(map);

    L.easyButton("fa-solid fa-location-crosshairs", function () {
        // clearMarkers();
        getData(userCountry, userCountryCode);
        $('#countrySelect').val(userCountryCode.toUpperCase());
    }).addTo(map);

    populateDropdown();
    getLocation();
    getCurrencies();

    function populateDropdown() {
        var selectedCountry = $("#countrySelect").val(); // Retrieve selected country
        $.ajax({
            url: "/project1/libs/php/countryform.php",
            type: 'post',
            data: { countrySelect: selectedCountry }, // Send selected country to server
            success: function (result) {
                $(".form-select").append(result);

            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus, errorThrown);
            }
        });
    }


    //geolocation

    function getLocation() {
        if ("geolocation" in navigator) {
            clearMarkers();
            navigator.geolocation.getCurrentPosition(function (position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;

                // Reverse geocoding - pass coordinates to the server
                $.ajax({
                    url: '/project1/libs/php/reverseGeocode.php',
                    method: 'GET',
                    data: {
                        lat: latitude,
                        lng: longitude
                    },
                    success: function (result) {
                        var country = result['data']['country'];
                        var iso2Code = result['data']['iso2Code'];
                        userCountry = country;
                        userCountryCode = iso2Code;
                        getData(userCountry, userCountryCode);

                        $('#countrySelect').val(userCountryCode.toUpperCase());
                    },
                    error: function (jqXHR, status, error) {
                        console.error(jqXHR, status + ': ' + error);
                    }
                });
            }, function (error) {
                // Handle errors
                alert("Error getting location: " + error.message);
            }, {
                enableHighAccuracy: true, // Request high accuracy
                timeout: 10000, // Set timeout to 10 seconds
                maximumAge: 60000 // Accept cached location data up to 1 minute old
            });
        } else {
            // Geolocation not supported
            alert("Geolocation is not supported by this browser.");
        }
    }





    function getCurrencies() {
        $.ajax({
            url: '/project1/libs/php/currencies.php',
            type: 'get',
            dataType: 'json',
            success: function (result) {
                // Populate currency select
                if (result.status.name == "ok") {
                    // Get select element
                    var select = $('#currencyModal .currency-select');

                    // Clear existing options
                    select.empty();

                    // Iterate over result and append options with keys
                    $.each(result.data, function (code, name) {
                        // Append option with both code and name
                        var option = $('<option>').val(code).text(code + " - " + name);
                        select.append(option);
                    });

                    // Trigger change event to update exchange rate when a currency is selected
                    select.change(function () {
                        var selectedCurrency = $(this).val();
                        currencyExchange(selectedCurrency);
                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
            }
        });
    }

    // Function to fetch exchange rates and perform currency conversion
    function currencyExchange() {
        var amount = $('#fromAmount').val(); // Get the amount to convert
        var baseCurrency = 'USD'; // Base currency assumed to be USD
        var targetCurrency = $('.currency-select').val(); // Get the target currency

        // Make AJAX request to fetch latest exchange rates
        $.ajax({
            url: '/project1/libs/php/exchangeRate.php',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                // Calculate the converted amount
                var exchangeRate = response.rates[targetCurrency];
                var convertedAmount = amount * exchangeRate;

                // Format the converted amount using Numeral.js
                var formattedAmount = numeral(convertedAmount).format('0,0.00');

                // Display the formatted converted amount in the output field
                $('#toAmount').val(formattedAmount);
            },
            error: function (xhr, status, error) {
                console.error('Error fetching exchange rates:', error);
            }
        });
    }


    $('#fromAmount').on('input', currencyExchange); // Trigger currency exchange on input change
    $('.currency-select').change(currencyExchange); // Trigger currency exchange on currency selection change

});



$('#countrySelect').change(function () {
    var selectedOption = $(this).find('option:selected');
    var iso_a2 = selectedOption.val();
    var selectedCountry = selectedOption.text();
    getData(selectedCountry, iso_a2);


});
function getData(selectedCountry, iso_a2) {

    getCountryInfo(selectedCountry, iso_a2); // Update this function to accept iso_a2
    moreCountryInfo(selectedCountry);
    showBorder(iso_a2); // Call showBorder with selectedCountry and iso_a2
    getWiki(selectedCountry);
    getNews(selectedCountry);
    showCastles(selectedCountry, iso_a2);
    showAirports(selectedCountry, iso_a2);
    showCities(selectedCountry, iso_a2);


}

function getCountryInfo(countryName, iso_a2) {
    var cleanedCountryName = encodeURIComponent(countryName);
    $.ajax({
        url: '/project1/libs/php/countryInfo.php',
        type: 'GET',
        dataType: 'json',
        data: {
            countryName: cleanedCountryName,
            iso_a2: iso_a2

        },
        success: function (result) {

            if (result.status.name == "ok") {


                $('#placeName').html(result["data"][0]["components"]["country"]);
                if (countryName === 'Western Sahara') {
                    $('#placeName').html(result["data"][0]["components"]["place"]);
                };
                $('#isoCode').html(result["data"][0]["components"]["ISO_3166-1_alpha-3"]);

                $('#continentInfo').html(result["data"][0]["components"]["continent"]);
                $('#callingCode').html(result["data"][0]["annotations"]["callingcode"]);
                var currencyName = result["data"][0]["annotations"]["currency"]["name"];
                var currencyCode = result["data"][0]["annotations"]["currency"]["iso_code"];
                currencySymbol = result["data"][0]["annotations"]["currency"]["symbol"];
                var combinedCurrency = currencyName + ' | ' + currencyCode + ' | ' + currencySymbol;
                $('#currencyInfo').html(combinedCurrency);
                var sideOfRoad = result["data"][0]["annotations"]["roadinfo"]["drive_on"];
                var speedMeasure = result["data"][0]["annotations"]["roadinfo"]["speed_in"];
                var roadInfo = 'Drive on ' + sideOfRoad + ' hand side' + ' | ' + 'Speed = ' + speedMeasure;
                $('#roadInfo').html(roadInfo);
                $('#locationInfo').html(result["data"][0]["annotations"]["what3words"]["words"]);
                var latitudeNo = result["data"][0]["geometry"]["lat"];
                var longitudeNo = result["data"][0]["geometry"]["lng"];
                var geometry = latitudeNo + ', ' + longitudeNo;
                $('#geometryInfo').html(geometry);
                var isoCode2 = result["data"][0]["components"]["ISO_3166-1_alpha-2"];


                var currencySelect = $('#currencyModal .currency-select');
                currencySelect.val(currencyCode);
                currencySelect.trigger('change');
                weatherInfo(latitudeNo, longitudeNo);



            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    })

};


function moreCountryInfo(countryName) {
    var cleanedCountryName = encodeURIComponent(countryName);
    $.ajax({
        url: '/project1/libs/php/moreCountryInfo.php',
        type: 'GET',
        dataType: 'json',
        data: {
            countryName: cleanedCountryName
        },
        success: function (result) {
            $('#languageInfo').empty();
            $('#populationInfo').empty();
            $('#areaInfo').empty();
            $('#weekStart').empty();
            $('#coatOfArms').empty();
            $('#capitalInfo').empty();
            if (result.status && result.status.name == "ok") {
                var languages = Object.values(result['data'][0]['languages']).join(", ");
                $('#languageInfo').html(languages);
                var capitalName = result['data'][0]['capital'];
                $('#capitalInfo').html(capitalName);
                $('#populationInfo').html(result['data'][0]['population'].toLocaleString());
                var area = result['data'][0]['area'];
                var formattedArea = numeral(area).format('0,0') + ' km²';
                $('#areaInfo').html(formattedArea);
                $('#weekStart').html(capitalizeFirstLetter(result['data'][0]['startOfWeek']));
                var coatOfArmsUrl = result['data'][0]['coatOfArms']['png'];
                $('#coatOfArms').html('<img src="' + coatOfArmsUrl + '">');
                var lat = result['data'][0]['capitalInfo']['latlng'][0];
                var lng = result['data'][0]['capitalInfo']['latlng'][1];
                // Pass capitalName and ISO code to getCapitalCoordinates function
                getCapitalCoordinates(lat, lng, countryName);
            } else {
                console.log("Error: ", result.status.description);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("AJAX Error: ", textStatus, errorThrown);
        }
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getCapitalCoordinates(lat, lng, countryName) {
    // Make AJAX request to fetch coordinates
    $.ajax({
        url: '/project1/libs/php/capitalCoordinates.php',
        type: 'GET',
        dataType: 'json',
        data: {
            lat: lat,
            lng: lng
        },
        success: function (result) {
            // Handle the response to get the coordinates
            var city = result['data'][0]['components']['city'];
            var state = result['data'][0]['components']['state'];
            var weatherTitle = $('.weatherTitle');

            if (city) {
                weatherTitle.html(city + ", " + countryName);
            } else {
                weatherTitle.html(state + ", " + countryName);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("AJAX Error: ", textStatus, errorThrown);
        }
    });
}




function weatherInfo(lat, lon) {

    $.ajax({
        url: '/project1/libs/php/weather.php',
        type: 'GET',
        dataType: 'json',
        data: {
            lat: lat,
            lon: lon
        },
        success: function (result) {


            if (result.status.name == "ok") {

                var tomorrowTimestamp = result['data']["daily"][1]["dt"];
                var furtherTimestamp = result['data']["daily"][2]["dt"];
                function formatTimestamp(timestamp) {
                    var date = new Date(timestamp * 1000);
                    // Using date.js to format the date
                    return date.toString('dddd dS');
                }

                var tomorrowDate = formatTimestamp(tomorrowTimestamp);
                var furtherDate = formatTimestamp(furtherTimestamp);

                $("#tomorrowDate").html(tomorrowDate);
                $("#furtherDate").html(furtherDate);

                function capitalizeFirstLetter(string) {
                    return string.charAt(0).toUpperCase() + string.slice(1);
                }

                $('#weatherSummary1').html(capitalizeFirstLetter(result['data']["daily"][0]["weather"][0]['description']));
                $('#weatherSummary2').html(capitalizeFirstLetter(result['data']["daily"][1]["weather"][0]['description']));
                $('#weatherSummary3').html(capitalizeFirstLetter(result['data']["daily"][2]["weather"][0]['description']));


                $('#maxTemp1').html(Math.round(result['data']["daily"][0]['temp']['max']) + '°C');
                $('#minTemp1').html(Math.round(result['data']["daily"][0]['temp']['min']) + '°C');
                $('#maxTemp2').html(Math.round(result['data']["daily"][1]['temp']['max']) + '°C');
                $('#minTemp2').html(Math.round(result['data']["daily"][1]['temp']['min']) + '°C');
                $('#maxTemp3').html(Math.round(result['data']["daily"][2]['temp']['max']) + '°C');
                $('#minTemp3').html(Math.round(result['data']["daily"][2]['temp']['min']) + '°C');
                $('#weatherImage1').html('<img src="https://openweathermap.org/img/wn/' + result['data']["daily"][0]["weather"][0]['icon'] + '@2x.png" alt="Weather Icon">');
                $('#weatherImage2').html('<img src="https://openweathermap.org/img/wn/' + result['data']["daily"][1]["weather"][0]['icon'] + '@2x.png" alt="Weather Icon">');
                $('#weatherImage3').html('<img src="https://openweathermap.org/img/wn/' + result['data']["daily"][2]["weather"][0]['icon'] + '@2x.png" alt="Weather Icon">');

            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }


    })
}

function getWiki(countryName) {
    var cleanedCountryName = countryName.replace(/\s+/g, '_');
    if (countryName === "Bahamas") {
        cleanedCountryName = "The_Bahamas";
    }

    $.ajax({
        url: '/project1/libs/php/wiki.php',
        type: 'GET',
        dataType: 'json',
        data: {
            countryName: cleanedCountryName
        },
        success: function (result) {
            if (result.status.name == "ok") {
                $('#nameOfCountry').empty();
                $('#summaryWiki').empty();

                var mobileLinkHTML = $('#mobileLink').html();
                var desktopLinkHTML = $('#desktopLink').html();

                $('#desktopLink').removeAttr('href').empty();
                $('#mobileLink').removeAttr('href').empty();

                $('#nameOfCountry').html(result['data']['title']);
                $('#summaryWiki').html(result['data']['extract']);

                $('#desktopLink').html(desktopLinkHTML);
                $('#mobileLink').html(mobileLinkHTML);

                $('#desktopLink').attr('href', result['data']['content_urls']['desktop']['page']);
                $('#mobileLink').attr('href', result['data']['content_urls']['mobile']['page']);

                $('#thumbnailImg').attr('src', result['data']['thumbnail']['source']);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    });
}

function getNews(countryName) {
    var cleanedCountryName = encodeURIComponent(countryName);
    $.ajax({
        url: '/project1/libs/php/news.php',
        type: 'GET',
        dataType: 'json',
        data: {
            countryName: cleanedCountryName
        },
        success: function (result) {

            if (result.response.status == "ok") {

                $('#headline1').html(result['response']['results'][0]['fields']['headline']);
                $('#newsLink1').attr('href', result['response']['results'][0]['fields']['shortUrl']);

                $('#headline2').html(result['response']['results'][1]['fields']['headline']);
                $('#headline3').html(result['response']['results'][2]['fields']['headline']);
                $('#headline4').html(result['response']['results'][3]['fields']['headline']);
                $('#headline5').html(result['response']['results'][4]['fields']['headline']);
                $('#trailText1').html(result['response']['results'][0]['fields']['trailText']);
                $('#trailText2').html(result['response']['results'][1]['fields']['trailText']);
                $('#trailText3').html(result['response']['results'][2]['fields']['trailText']);
                $('#trailText4').html(result['response']['results'][3]['fields']['trailText']);
                $('#trailText5').html(result['response']['results'][4]['fields']['trailText']);
                $('#thumbnail1').attr('src', result['response']['results'][0]['fields']['thumbnail']);
                $('#thumbnail2').attr('src', result['response']['results'][1]['fields']['thumbnail']);
                $('#thumbnail3').attr('src', result['response']['results'][2]['fields']['thumbnail']);
                $('#thumbnail4').attr('src', result['response']['results'][3]['fields']['thumbnail']);
                $('#thumbnail5').attr('src', result['response']['results'][4]['fields']['thumbnail']);
                $('#newsLink2').attr('href', result['response']['results'][1]['fields']['shortUrl']);
                $('#newsLink3').attr('href', result['response']['results'][2]['fields']['shortUrl']);
                $('#newsLink4').attr('href', result['response']['results'][3]['fields']['shortUrl']);
                $('#newsLink5').attr('href', result['response']['results'][4]['fields']['shortUrl']);




            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('Error:', jqXHR, textStatus, errorThrown);
        }
    });
}



var airportsMarkers = L.markerClusterGroup();
var citiesMarkers = L.markerClusterGroup();
var castlesMarkers = L.markerClusterGroup();

function clearMarkers() {
    airportsMarkers.clearLayers();
    citiesMarkers.clearLayers();
    castlesMarkers.clearLayers();
}

function showAirports(countryName, countryCode) {
    airportsMarkers.clearLayers();
    $.ajax({
        url: '/project1/libs/php/airports.php',
        type: 'GET',
        dataType: 'json',
        data: {
            countryCode: countryCode
        },
        success: function (result) {
            result.data = result.data.filter(function (airport) {
                return airport.countryCode === countryCode;
            });

            var addedAirports = {};

            result.data.forEach(function (airport) {
                if (!addedAirports[airport.name]) {
                    var marker = L.ExtraMarkers.icon({
                        icon: 'fas fa-plane',
                        iconColor: '#fad0f0',
                        markerColor: 'blue',
                        shape: 'square',
                        prefix: 'fa'
                    });

                    marker = L.marker([parseFloat(airport.lat), parseFloat(airport.lng)], { icon: marker });
                    marker.bindTooltip(airport.name, { direction: "top", sticky: true });
                    airportsMarkers.addLayer(marker);
                    addedAirports[airport.name] = true;
                }
            });

            map.addLayer(airportsMarkers);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    });
}

function showCities(countryName, countryCode) {
    citiesMarkers.clearLayers();
    $.ajax({
        url: '/project1/libs/php/cities.php',
        type: 'GET',
        dataType: 'json',
        data: {
            countryCode: countryCode
        },
        success: function (result) {
            result.data = result.data.filter(function (city) {
                return city.countryCode === countryCode;
            });

            var addedCities = {};

            result.data.forEach(function (city) {
                if (!addedCities[city.name]) {
                    var marker = L.ExtraMarkers.icon({
                        icon: 'fas fa-city',
                        iconColor: '#ffffff',
                        markerColor: 'green',
                        shape: 'penta',
                        prefix: 'fa'
                    });

                    marker = L.marker([parseFloat(city.lat), parseFloat(city.lng)], { icon: marker });
                    marker.bindTooltip(city.name, { direction: "top", sticky: true });
                    citiesMarkers.addLayer(marker);
                    addedCities[city.name] = true;
                }
            });

            map.addLayer(citiesMarkers);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    });
}

function showCastles(countryName, countryCode) {
    castlesMarkers.clearLayers();
    $.ajax({
        url: '/project1/libs/php/castles.php',
        type: 'GET',
        dataType: 'json',
        data: {
            countryCode: countryCode
        },
        success: function (result) {
            result.data = result.data.filter(function (castle) {
                return castle.countryCode === countryCode;
            });

            var addedCastles = {};

            result.data.forEach(function (castle) {
                if (!addedCastles[castle.name]) {
                    var marker = L.ExtraMarkers.icon({
                        icon: 'fas fa-chess-rook',
                        iconColor: '#f3f4da',
                        markerColor: 'orange',
                        shape: 'star',
                        prefix: 'fa'
                    });

                    marker = L.marker([parseFloat(castle.lat), parseFloat(castle.lng)], { icon: marker });
                    marker.bindTooltip(castle.name, { direction: "top", sticky: true });
                    castlesMarkers.addLayer(marker);
                    addedCastles[castle.name] = true;
                }
            });

            map.addLayer(castlesMarkers);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    });
}





function showBorder(iso_a2) {
    // Remove existing polygon layers from the map
    map.eachLayer(function (layer) {
        if (layer instanceof L.Polygon) {
            map.removeLayer(layer);
        }
    });

    // console.log("Sending request with iso_a2:", iso_a2); // Debugging line


    // Fetch border data for the selected country from PHP
    $.ajax({
        dataType: "json",
        url: "/project1/libs/php/getCoordinates.php",
        data: {
            iso_a2: iso_a2
        },
        success: function (response) {

            // Access the coordinates directly
            var coordinates = response.data.coordinates;

            flippedCoordinates = flipCoordinates(coordinates);
            // console.log("Flipped coordinates:", flippedCoordinates);

            var polygon = L.polygon(coordinates, { color: 'blue' }).addTo(map);
            polygon.bindPopup("Country: " + iso_a2); // Use iso_a2 for simplicity

            // Fit the map view to the bounds of the selected polygon
            map.fitBounds(polygon.getBounds());
        },
        error: function (error) {
            console.error("Error fetching data:", error.responseText);  // Log the full error response
        }
    });
}
// Function to flip coordinates for correct alignment
function flipCoordinates(coordinates) {
    for (var i = 0; i < coordinates.length; i++) {
        // Single coordinate pair
        if (Array.isArray(coordinates[i]) && typeof coordinates[i][0] === 'number' && typeof coordinates[i][1] === 'number') {
            // Swap latitude and longitude
            var temp = coordinates[i][0];
            coordinates[i][0] = coordinates[i][1];
            coordinates[i][1] = temp;
        } else {
            // Array of coordinates, recursively call flipCoordinates
            coordinates[i] = flipCoordinates(coordinates[i]);
        }
    }
    return coordinates;
}
