$('#submitbutton3').click(function() {

    $.ajax({
        url: "/geo/libs/php/getElevationData.php",
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