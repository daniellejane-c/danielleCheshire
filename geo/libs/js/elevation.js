$('.submitbutton3').onclick(function () {

    $.ajax({
        url: "libs/php/getElevationData.php",
        type: 'GET',
        dataType: 'json',
        data: {
            latitude: $('#lat').val(),
            longitude: $('#long').val()
        },
        success: function (result) {

            console.log(JSON.stringify(result));

            if (result.status.name == "ok") {

                $('#strmInfo').html(result['data'][0]['strm1']);
                $('#longitudeInfo').html(result['data'][0]['long']);
                $('#latitudeInfo').html(result['data'][0]['lat']);
            }

        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(textStatus, errorThrown);
        }
    })

});