
$(document).ready(function(){
  populatePersonnelData();
  populateLocationData();
  populateDepartment();
  //search bar

  // Function to filter table rows
  function filterTable(tableBodyId, searchText) {
      $(tableBodyId + " tr").each(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(searchText) > -1);
      });
  }
  
  // Event handler for keyup event on search input
  $("#searchInp").on("keyup", function () {
      var searchText = $(this).val().toLowerCase(); 
      filterTable("#personnelTableBody", searchText);
      filterTable("#departmentTableBody", searchText);
      filterTable("#locationTableBody", searchText);
  }).on('focus', function() { // Change background color when search input is focused
      $(this).css('background-color', '#ccebff');
  }).on('blur', function() { // Revert background color when search input loses focus and it's empty
      if ($(this).val().trim() === '') {
          $(this).css('background-color', originalBgColor);
      }
  });
  
  // Save the original background color
  var originalBgColor = $('#searchInp').css('background-color');
  //populate personnel data
  function populatePersonnelData() {
    $.ajax({
        url: '/project2/libs/php/getAll.php',
        type: 'GET',
        dataType: 'json',
        success: function (response) {
            if (response.status.code === "200") {
                var personnelData = response.data;

                // Clear existing table content
                $('#personnelTableBody').empty();

                // Loop through personnel data and populate table rows
                $.each(personnelData, function (index, personnel) {
                    var row = '<tr>' +
                        '<td class="align-middle text-nowrap" id="personnelName">' + personnel.lastName + ', ' + personnel.firstName + '</td>' +
                        '<td class="align-middle text-nowrap d-none d-md-table-cell" id="personnelDepartment">' + personnel.department + '</td>' +
                        '<td class="align-middle text-nowrap d-none d-md-table-cell" id="personnelLocation">' + personnel.location + '</td>' +
                        '<td class="align-middle text-nowrap d-none d-md-table-cell" id="personnelEmail">' + personnel.email + '</td>' +
                        '<td class="text-end text-nowrap">' +
                        '<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="' + personnel.id + '">' +
                        '<i class="fa-solid fa-pencil fa-fw"></i>' +
                        '</button>' +
                        '<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="' + personnel.id + '">' +
                        '<i class="fa-solid fa-trash fa-fw"></i>' +
                        '</button>' +
                        '</td>' +
                        '</tr>';
                    $('#personnelTableBody').append(row);
                });
            } else {
                // Handle other status codes if needed
                console.log("Error: " + response.status.description);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("Error:", textStatus, errorThrown);
        }
    });
}



function populateDepartment() {
  $.ajax({
    url: '/project2/libs/php/getAllDepartments.php',
    type: 'GET',
    dataType: 'json',
    success: function(response) {
      if (response.status.code === "200") {
        var departmentData = response.data;

        // Sort departmentData array alphabetically by name
        departmentData.sort(function(a, b) {
          return a.name.localeCompare(b.name);
        });

        // Clear existing table content
        $('#departmentTableBody').empty();

        // Loop through sorted department data and populate table rows
        $.each(departmentData, function(index, department) {
          // Fetch location name for the corresponding locationID
          $.ajax({
            url: '/project2/libs/php/getLocationByID.php',
            type: 'GET',
            dataType: 'json',
            data: {
              id: department.locationID
            },
            success: function(response) {
              var locationName = response.data[0].name;
              var row = '<tr>' +
                '<td class="align-middle text-nowrap" id="departmentName">' + department.name + '</td>' +
                '<td class="align-middle text-nowrap d-none d-md-table-cell" id="depLocation">' + locationName + '</td>' +
                '<td class="align-middle text-end text-nowrap">' +
                '<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id=' + department.id + '">' +
                '<i class="fa-solid fa-pencil fa-fw"></i>' +
                '</button>' +
                '<button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-id=' + department.id + '">' +
                '<i class="fa-solid fa-trash fa-fw"></i>' +
                '</button>' +
                '</td>' +
                '</tr>';
              $('#departmentTableBody').append(row);
            },
            error: function(jqXHR, textStatus, errorThrown) {
              console.log("Error:", textStatus, errorThrown);
            }
          });
        });
      } else {
        // Handle other status codes if needed
        console.log("Error: " + response.status.description);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log("Error:", textStatus, errorThrown);
    }
  });
}



function populateLocationData() {
  $.ajax({
      url: '/project2/libs/php/getAllLocations.php',
      type: 'GET',
      dataType: 'json',
      success: function (response) {
          if (response.status.code === "200") {
              var locationData = response.data;

              // Clear existing table content
              $('#locationTableBody').empty();

              // Loop through personnel data and populate table rows
              $.each(locationData, function (index, location) {
                  var row = '<tr>' +
                      '<td class="align-middle text-nowrap" id="locationName">' + location.name + '</td>' +
                      '<td class="align-middle text-end text-nowrap">' +
                      '<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editLocationModal" data-id="' + location.id + '">' +
                      '<i class="fa-solid fa-pencil fa-fw"></i>' +
                      '</button>' +
                      '<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#deleteLocationModal" data-id="' + location.id + '">' +
                      '<i class="fa-solid fa-trash fa-fw"></i>' +
                      '</button>' +
                      '</td>' +
                      '</tr>';
                  $('#locationTableBody').append(row);
              });
          } else {
              // Handle other status codes if needed
              console.log("Error: " + response.status.description);
          }
      },
      error: function (jqXHR, textStatus, errorThrown) {
          console.log("Error:", textStatus, errorThrown);
      }
  });
}

$("#refreshBtn").click(function () {
  if ($("#personnelBtn").hasClass("active")) {
      refreshTable("personnel");
  } else if ($("#departmentsBtn").hasClass("active")) {
      refreshTable("departments");
  } else if ($("#locationsBtn").hasClass("active")) {
      refreshTable("locations");
  } else {
      console.log("No active button found.");
  }
});

function refreshTable(table) {
  $.ajax({
      url: "/project2/libs/php/refresh.php",
      type: "GET",
      data: { table: table }, // Specify the table parameter
      success: function(data, textStatus, jqXHR) {
          console.log("Data received:", data);
          console.log("Status:", textStatus);
          if (data === "success") {
              console.log(table + " table refreshed successfully!");
              // You can update the UI here if needed
          } else {
              console.log("Error refreshing " + table + " table: " + data);
          }
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.log("Error refreshing " + table + " table: " + textStatus + " - " + errorThrown);
      }
  });
}


  
  $("#filterBtn").click(function () {
    
    // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
    
  });
  
  $("#addBtn").click(function () {
    
    // Replicate the logic of the refresh button click to open the add modal for the table that is currently on display
    
  });
  
  $("#personnelBtn").click(function () {
    
    // Call function to refresh personnel table
    
  });
  
  $("#departmentsBtn").click(function () {
    
    // Call function to refresh department table
    
  });
  
  $("#locationsBtn").click(function () {
    
    // Call function to refresh location table
    
  });
  
  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    
    $.ajax({
      url:
        "https://coding.itcareerswitch.co.uk/companydirectory/libs/php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        // Retrieve the data-id attribute from the calling button
        // see https://getbootstrap.com/docs/5.0/components/modal/#varying-modal-content
        // for the non-jQuery JavaScript alternative
        id: $(e.relatedTarget).attr("data-id") 
      },
      success: function (result) {
        var resultCode = result.status.code;
  
        if (resultCode == 200) {
          
          // Update the hidden input with the employee id so that
          // it can be referenced when the form is submitted
  
          $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);
  
          $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
          $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
          $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
          $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);
  
          $("#editPersonnelDepartment").html("");
  
          $.each(result.data.department, function () {
            $("#editPersonnelDepartment").append(
              $("<option>", {
                value: this.id,
                text: this.name
              })
            );
          });
  
          $("#editPersonnelDepartment").val(result.data.personnel[0].departmentID);
          
        } else {
          $("#editPersonnelModal .modal-title").replaceWith(
            "Error retrieving data"
          );
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    });
  });
  
  // Executes when the form button with type="submit" is clicked
  
  $("#editPersonnelForm").on("submit", function (e) {
    
    // Executes when the form button with type="submit" is clicked
    // stop the default browser behviour
  
    e.preventDefault();
  
    // AJAX call to save form data
    
  });
});