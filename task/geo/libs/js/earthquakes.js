$('#submitbutton1').click(function() {

    $.ajax({
        url: "/geo/libs/php/getEarthquakeData.php",
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
