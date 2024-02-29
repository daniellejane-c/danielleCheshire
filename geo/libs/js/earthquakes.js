$('.submitbutton1').onclick(function () {

    $.ajax({
        url: "libs/php/getEarthquakeData.php",
        type: 'get',
        dataType: 'json',
        data: {
            north: $('#north').val(),
            south: $('#south').val(),
            east: $('#east').val(),
            west: $('#west').val()
        },
        success: function (result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#datetimeInfo').html(result['data'][0]['datetime']);
                $('#depthInfo').html(result['data'][0]['depth']);
                $('#lngInfo').html(result['data'][0]['lng']);
                $('#srcInfo').html(result['data'][0]['src']);
                $('#equidInfo').html(result['data'][0]['equid']);
                $('#magnitudeInfo').html(result['data'][0]['magnitude']);
                $('#latInfo').html(result['data'][0]['lat']);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    })

});