$('.submitbutton1').onclick(function () {

    $.ajax({
        url: "libs/php/getWeatherInfo.php",
        type: 'GET',
        dataType: 'json',
        data: {
            ICAO: $('#selICAOcode').val(),
        },
        success: function (result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#elevationInfo').html(result['data'][0]['elevation']);
                $('#lngInfo').html(result['data'][0]['lng']);
                $('#weatherconditioncodeInfo').html(result['data'][0]['weatherConditionCode']);
                $('#observationInfo').html(result['data'][0]['observation']);
                $('#ICAOInfo').html(result['data'][0]['icao']);
                $('#cloudsInfo').html(result['data'][0]['clouds']);
                $('#latInfo').html(result['data'][0]['lat']);

            }
        },
            error: function(jqXHR, textStatus, errorThrown) {
                // your error code
            }

        
})

});