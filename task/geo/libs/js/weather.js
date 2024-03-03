$('#submitbutton2').click(function() {

    $.ajax({
        url: "/geo/libs/php/getWeatherInfo.php",
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
