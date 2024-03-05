$('#submitbutton1').click(function() {

    $.ajax({
        url: "/task/libs/php/getEarthquakeData.php",
        type: 'GET',
        dataType: 'json',
        data: {
            north: $('#north').val(),
            south: $('#south').val(),
            east: $('#east').val(),
            west: $('#west').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#datetimeInfo').html(result['data'][0]['datetime']);
                $('#depthInfo').html(result['data'][0]['depth']);
                $('#lngInfo').html(result['data'][0]['lng']);
                $('#magnitudeInfo').html(result['data'][0]['magnitude']);
                $('#latInfo').html(result['data'][0]['lat']);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
	   console.log(textStatus, errorThrown);
        }
    })

});

$('#submitbutton2').click(function() {

    $.ajax({
        url: "/task/libs/php/getWeatherInfo.php",
        type: 'GET',
        dataType: 'json',
        data: {
            airport: $('#airport').val()
        },
        success: function(result) {

            console.log(JSON.stringify(result));

		if (result.status.name == "ok") {

                $('#elevationInfo').html(result.data.elevation);
                $('#longInfo').html(result.data.lng);
                $('#weatherconditioncodeInfo').html(result.data.weatherConditionCode);
                $('#observationInfo').html(result.data.observation);
                $('#ICAOInfo').html(result.data.ICAO);
                $('#cloudsInfo').html(result.data.clouds);
                $('#latiInfo').html(result.data.lat);

            }
        },
            error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
            }

        
})

});

$('#submitbutton3').click(function() {

    $.ajax({
        url: "/task/libs/php/getElevationData.php",
        type: 'GET',
        dataType: 'json',
        data: {
            lat: $('#lat').val(),
            lng: $('#lng').val()
        },
        success: function(result) {


            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#srtmInfo').empty().append(result['data']);
	
	     }

        },
        error: function (jqXHR, textStatus, errorThrown) {
	    console.log(textStatus, errorThrown);
        }
    })
});