// GLOBAL DECLARATIONS

var map;
var layerControl;
var countryMarker;
var proximityRadius = 2;

//create map layers
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
//on ready function
$(document).ready(function () {
    map = L.map("map", {
        layers: [streets]
    }).setView([51.505, -0.09], 6);

    layerControl = L.control.layers(basemaps).addTo(map);


    //buttons - each declare whether there is additional markers shown the selected country. if not, onclick puts them on the map
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
        getLocation();


    }).addTo(map);


    populateDropdown();
    getLocation();
    getCurrencies();
    function populateDropdown() {
        var selectedCountry = $("#countrySelect").val(); // Retrieve selected country
        $.ajax({
            url: "/clone/libs/php/countryform.php",
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

    //geolocation - on load
    function getLocation() {
        map.locate({
            setView: true,
            maxZoom: 16,
            enableHighAccuracy: true, // Request high accuracy
            timeout: 10000, // Set timeout to 10 seconds
            maximumAge: 60000 // Accept cached location data up to 1 minute old
        });

        function onLocationFound(e) {
            var radius = e.accuracy.toFixed(0);

            L.marker(e.latlng).addTo(map)
                .bindPopup("You are within " + radius + " meters from this point").openPopup();

            L.circle(e.latlng, radius).addTo(map);
        }

        map.on('locationfound', onLocationFound);

        function onLocationError(e) {
            alert("Error getting location: " + e.message);
        }

        map.on('locationerror', onLocationError);
    }

    getCurrencies();


    function getCurrencies() {
        $.ajax({
            url: '/clone/libs/php/currencies.php',
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
                        var selectedCurrency = $(this).val(); // Get the selected currency code
                        currencyExchange(selectedCurrency); // Call currencyConvert with the selected currency code
                    });
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR, textStatus, errorThrown);
            }
        });
    }


    // Function to convert currency
    // Function to fetch exchange rates and perform currency conversion
    function currencyExchange() {
        var amount = $('#number').val(); // Get the amount to convert
        var baseCurrency = $('[name="currency1"]').attr('name'); // Get the base currency
        var targetCurrency = $('[name="currency2"]').val(); // Get the target currency

        // Make AJAX request to fetch latest exchange rates
        $.ajax({
            url: '/clone/libs/php/exchangeRate.php',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                // Calculate the converted amount
                var exchangeRate = response.rates[targetCurrency];
                var convertedAmount = (amount * exchangeRate);

                // Display the converted amount in the output field
                $('#output').val(convertedAmount);
            },
            error: function (xhr, status, error) {
                console.error('Error fetching exchange rates:', error);
            }
        });
    }

    // Call currencyExchange function when the input value changes
    $('#number').on('input', currencyExchange);
});



//when selecting country.
$('#countrySelect').change(function () {
    var selectedCountry = $(this).val();
    console.log(selectedCountry);
    getCountryInfo(selectedCountry);
    moreCountryInfo(selectedCountry);
    showBorder(selectedCountry);
    getWiki(selectedCountry);
    getNews(selectedCountry);

}
);

function getCountryInfo(countryName) {
    var cleanedCountryName = encodeURIComponent(countryName);
    $.ajax({
        url: '/clone/libs/php/countryInfo.php',
        type: 'GET',
        dataType: 'json',
        data: {
            countryName: cleanedCountryName
        },
        success: function (result) {

            // console.log(JSON.stringify(result));

            if (result.status.name == "ok") {


                $('#placeName').html(result["data"]["results"][0]["components"]["country"]);
                if (countryName === 'Western Sahara') {
                    $('#placeName').html(result["data"]["results"][0]["components"]["place"]);
                };
                $('#isoCode').html(result["data"]["results"][0]["components"]["ISO_3166-1_alpha-3"]);
                $('#flagImg').html(result["data"]["results"][0]["annotations"]["flag"]);
                $('#continentInfo').html(result["data"]["results"][0]["components"]["continent"]);
                $('#callingCode').html(result["data"]["results"][0]["annotations"]["callingcode"]);
                var currencyName = result["data"]["results"][0]["annotations"]["currency"]["name"];
                var currencyCode = result["data"]["results"][0]["annotations"]["currency"]["iso_code"];
                var currencySymbol = result["data"]["results"][0]["annotations"]["currency"]["symbol"];
                var combinedCurrency = currencyName + ' | ' + currencyCode + ' | ' + currencySymbol;
                $('#currencyInfo').html(combinedCurrency);
                var sideOfRoad = result["data"]["results"][0]["annotations"]["roadinfo"]["drive_on"];
                var speedMeasure = result["data"]["results"][0]["annotations"]["roadinfo"]["speed_in"];
                var roadInfo = 'Drive on ' + sideOfRoad + ' hand side' + ' | ' + 'Speed = ' + speedMeasure;
                $('#roadInfo').html(roadInfo);
                var timezone_name = result["data"]["results"][0]["annotations"]["timezone"]["name"];
                var timezone_short = result["data"]["results"][0]["annotations"]["timezone"]["short_name"];
                var timezoneInfo = timezone_name + ' | ' + timezone_short;
                $('#timezoneInfo').html(timezoneInfo);
                $('#locationInfo').html(result["data"]["results"][0]["annotations"]["what3words"]["words"]);
                var latitudeNo = result["data"]["results"][0]["geometry"]["lat"];
                var longitudeNo = result["data"]["results"][0]["geometry"]["lng"];
                var geometry = latitudeNo + ', ' + longitudeNo;
                $('#geometryInfo').html(geometry);


                weatherInfo(latitudeNo, longitudeNo);


            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    })

};

function moreCountryInfo(countryName) {
    var cleanedCountryName = encodeURI(countryName);
    $.ajax({
        url: '/clone/libs/php/moreCountryInfo.php',
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
            //console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                var languages = Object.values(result['data'][0]['languages']).join(", ");
                $('#languageInfo').html(languages);
                $('#populationInfo').html(result['data'][0]['population'].toLocaleString());
                $('#areaInfo').html(result['data'][0]['area']);
                $('#weekStart').html(capitalizeFirstLetter(result['data'][0]['startOfWeek']));
                var coatOfArmsUrl = result['data'][0]['coatOfArms']['png'];
                $('#coatOfArms').html('<img src="' + coatOfArmsUrl + '">');



            }
            function capitalizeFirstLetter(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    })
};

function weatherInfo(lat, lon) {

    $.ajax({
        url: '/clone/libs/php/weather.php',
        type: 'GET',
        dataType: 'json',
        data: {
            lat: lat,
            lon: lon
        },
        success: function (result) {

            //  console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                var tomorrowTimestamp = result['data']["daily"][1]["dt"];
                var furtherTimestamp = result['data']["daily"][2]["dt"];

                function formatTimestamp(timestamp) {
                    var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    var date = new Date(timestamp * 1000);
                    var dayOfWeek = daysOfWeek[date.getDay()];
                    var day = date.getDate();
                    var month = date.getMonth() + 1;
                    return dayOfWeek + ' ' + (day < 10 ? '0' : '') + day + '/' + (month < 10 ? '0' : '') + month;
                }

                var tomorrowDate = formatTimestamp(tomorrowTimestamp);
                var furtherDate = formatTimestamp(furtherTimestamp);

                $("#tomorrowDate").html(tomorrowDate);
                $("#furtherDate").html(furtherDate);


                $('#weatherSummary1').html(result['data']["daily"][0]["weather"][0]['description']);
                $('#weatherSummary2').html(result['data']["daily"][1]["weather"][0]['description']);
                $('#weatherSummary3').html(result['data']["daily"][2]["weather"][0]['description']);

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
        $.ajax({
            url: '/clone/libs/php/wiki.php',
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
        url: '/clone/libs/php/news.php',
        type: 'GET',
        dataType: 'json',
        data: {
            countryName: cleanedCountryName
        },
        success: function (result) {
            if (result.status.name == "ok") {
                $('#headline1').html(result['data']['response']['results'][0]['fields']['headline']);
                $('#headline2').html(result['data']['response']['results'][1]['fields']['headline']);
                $('#headline3').html(result['data']['response']['results'][2]['fields']['headline']);
                $('#headline4').html(result['data']['response']['results'][3]['fields']['headline']);
                $('#headline5').html(result['data']['response']['results'][4]['fields']['headline']);
                $('#trailText1').html(result['data']['response']['results'][0]['fields']['trailText']);
                $('#trailText2').html(result['data']['response']['results'][1]['fields']['trailText']);
                $('#trailText3').html(result['data']['response']['results'][2]['fields']['trailText']);
                $('#trailText4').html(result['data']['response']['results'][3]['fields']['trailText']);
                $('#trailText5').html(result['data']['response']['results'][4]['fields']['trailText']);
                $('#thumbnail1').attr('src', result['data']['response']['results'][0]['fields']['thumbnail']);
                $('#thumbnail2').attr('src', result['data']['response']['results'][1]['fields']['thumbnail']);
                $('#thumbnail3').attr('src', result['data']['response']['results'][2]['fields']['thumbnail']);
                $('#thumbnail4').attr('src', result['data']['response']['results'][3]['fields']['thumbnail']);
                $('#thumbnail5').attr('src', result['data']['response']['results'][4]['fields']['thumbnail']);
                $('#newsLink1').attr('href', result['data']['response']['results'][0]['fields']['shortUrl']);
                $('#newsLink2').attr('href', result['data']['response']['results'][1]['fields']['shortUrl']);
                $('#newsLink3').attr('href', result['data']['response']['results'][2]['fields']['shortUrl']);
                $('#newsLink4').attr('href', result['data']['response']['results'][3]['fields']['shortUrl']);
                $('#newsLink5').attr('href', result['data']['response']['results'][4]['fields']['shortUrl']);




                // console.log(result);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR, textStatus, errorThrown);
        }
    });
}



function showBorder(selectedCountry) {
    // Clear existing polygons from the map
    map.eachLayer(function (layer) {
        if (layer instanceof L.Polygon) {
            map.removeLayer(layer);
        }
    });


    // Fetch border data for the selected country from PHP
    $.ajax({
        dataType: "json",
        url: "/clone/libs/php/getCoordinates.php",
        data: { selectedCountry: selectedCountry }, // Pass selected country name to PHP
        success: function (data) {
            // Find the selected country data
            var selectedCountryData = data.find(function(countryData) {
                return countryData.name === selectedCountry;
            });

            if (selectedCountryData) {
                var coordinates = selectedCountryData.coordinates;

                // Flip the coordinates
                coordinates = flipCoordinates(coordinates);

                // Draw the polygon for the selected country
                var polygon = L.polygon(coordinates, { color: 'blue' }).addTo(map);

                // You can customize further actions here, such as adding popups or tooltips
                polygon.bindPopup("Country: " + selectedCountry);
                
                // Fit the map view to the bounds of the selected polygon
                var bounds = polygon.getBounds();
                map.fitBounds(bounds);
            } else {
                console.error("Coordinates not found for the selected country:", selectedCountry);
            }
        },
        error: function (xhr, status, error) {
            console.error("Error fetching border data:", error);
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
