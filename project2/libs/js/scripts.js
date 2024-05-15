$(document).ready(function () {
  populatePersonnelData();
  populateLocationData();
  populateDepartment();
  //search bar

  // Function to filter table rows
  function filterTable(tableBodyId, searchText) {
    var anyResults = false;
    $(tableBodyId + " tr").each(function () {
      var rowText = $(this).text().toLowerCase();
      var matched = rowText.indexOf(searchText) > -1;
      $(this).toggle(matched);
      if (matched) {
        anyResults = true;
      }
    });

    if (!anyResults) {
      // If no results found, display a message
      $(tableBodyId).append('<tr class="no-results"><td colspan="5"><span class="no-results-message">We could not find any data matching your search criteria.</span></td></tr>');
    } else {
      // Remove the no-results message if it exists
      $(tableBodyId + " .no-results").remove();
    }
  }

  // Event handler for keyup event on search input
  $("#searchInp").on("keyup", function () {
    var searchText = $(this).val().toLowerCase();
    filterTable("#personnelTableBody", searchText);
    filterTable("#departmentTableBody", searchText);
    filterTable("#locationTableBody", searchText);
  }).on('focus', function () { // Change background color when search input is focused
    $(this).css('background-color', '#ccebff');
  }).on('blur', function () { // Revert background color when search input loses focus and it's empty
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
          // console.log(response);
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
      success: function (response) {
        if (response.status.code === "200") {
          var departmentData = response.data;

          // Sort departmentData array alphabetically by name
          departmentData.sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });

          // Clear existing table content
          $('#departmentTableBody').empty();

          // Loop through sorted department data and populate table rows
          $.each(departmentData, function (index, department) {
            // Fetch location name for the corresponding locationID
            $.ajax({
              url: '/project2/libs/php/getLocationByID.php',
              type: 'GET',
              dataType: 'json',
              data: {
                id: department.locationID
              },
              success: function (response) {
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
              error: function (jqXHR, textStatus, errorThrown) {
                console.log("Error:", textStatus, errorThrown);
              }
            });
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
      success: function (data, textStatus, jqXHR) {
        console.log("Data received:", data);
        console.log("Status:", textStatus);
        if (data === "success") {
          console.log(table + " table refreshed successfully!");
          // You can update the UI here if needed
        } else {
          console.log("Error refreshing " + table + " table: " + data);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error refreshing " + table + " table: " + textStatus + " - " + errorThrown);
      }
    });
  }



  $("#filterBtn").click(function () {

    // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location

  });

  $("#addBtn").click(function () {
    // Determine which tab is active
    var activeTab = $('.nav-tabs .nav-link.active').attr('id');
    var modalTarget;

    // Set the appropriate modal target based on the active tab
    switch (activeTab) {
      case 'personnelBtn':
        modalTarget = '#addPersonnelModal';
        break;
      case 'departmentsBtn':
        modalTarget = '#addDepartmentModal';
        break;
      case 'locationsBtn':
        modalTarget = '#addLocationModal';
        break;
      // Add more cases as needed for additional tabs
    }

    // If a modal target is found, open the modal
    if (modalTarget) {
      $(modalTarget).modal('show');
    }

      clearForm();
  
  });

  $("#addDepartmentModal").on("show.bs.modal", function (e) {
    fetchDropdownData('#addLocationName');
  });

  $("#editDepartmentModal").on("show.bs.modal", function (e) {
    fetchDropdownData('#addLocationName');
  });
  // Fetch locations and populate dropdown on page load
  $("#addPersonnelModal").on("show.bs.modal", function (e) {
    fetchDropdownData('#addPersonnelDepartment');
  });
  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    fetchDropdownData('#addPersonnelDepartment');
  });

  $('#editLocationModal').on("show.bs.modal", function (e){
    clearForm();
  });
  // Event listener for dropdown change
  $('.dropdown').on('change', function () {
    // Get the selected option value
    var selectedValue = $(this).val();

    // Set the dropdown value to the selected option value
    $(this).val(selectedValue);
  });

  function fetchDropdownData(dropdownId) {
    var url;
    if (dropdownId === '#addLocationName') {
      url = '/project2/libs/php/getAllLocations.php';
    } else if (dropdownId === '#addPersonnelDepartment') {
      url = '/project2/libs/php/getAllDepartments.php';
    }

    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      success: function (response) {
        if (response.status.code === "200") {
          var dropdownData = response.data;

          // Clear existing options
          $(dropdownId).empty();

          // Populate dropdown with data
          $.each(dropdownData, function (index, item) {
            $(dropdownId).append($('<option>', {
              value: item.id, // Assuming each item has an ID
              text: item.name // Assuming each item has a name
            }));
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
        "/project2/libs/php/getPersonnelByID.php",
      type: "get",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id")
      },
      success: function (result) {
        var resultCode = result.status.code;

        if (resultCode == 200) {

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
  //edit department
  $("#editDepartmentModal").on("show.bs.modal", function (e) {
    $.ajax({
      url: "/project2/libs/php/getDepartmentByID.php",
      type: "get",
      dataType: "json",
      data: {
        id: $(e.relatedTarget).attr("data-id")
      },
      success: function (result) {
        var resultCode = result.status.code;
        if (resultCode == 200) {
          $("#editDepartmentID").val(result.data[0].id);
          $("#editDepartmentName").val(result.data[0].name);

          // Fetch all locations
          $.ajax({
            url: "/project2/libs/php/getAllLocations.php",
            type: "get",
            dataType: "json",
            success: function (locationResult) {
              if (locationResult.status.code == 200) {
                var currentLocationID = result.data[0].locationID;
                $("#editDepartmentLocation").empty(); // Clear previous options
                locationResult.data.forEach(function (location) {
                  // Append option with location name
                  $("#editDepartmentLocation").append(
                    $("<option>", {
                      value: location.id,
                      text: location.name,
                      selected: location.id == currentLocationID ? true : false
                    })
                  );
                });
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.error("Error retrieving location data:", errorThrown);
            }
          });
        } else {
          $("#editPersonnelModal .modal-title").replaceWith("Error retrieving data");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editPersonnelModal .modal-title").replaceWith("Error retrieving data");
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
  //edit location
  $("#editLocationModal").on("show.bs.modal", function (e) {
    // AJAX request to retrieve location details
    $.ajax({
        url: "/project2/libs/php/getLocationByID.php",
        type: "get",
        dataType: "json",
        data: {
            id: $(e.relatedTarget).data("id"), // Assuming data-id is used to store the location ID
        },
        
        success: function (result) {

            var resultCode = result.status.code;

            if (resultCode == 200) {
                // Populate form fields with location details
                $("#editLocationID").val(result.data[0].id);
                $("#editLocation").val(result.data[0].name);

                // Set the value of originalLocationName input field
                $("#originalLocationName").val(result.data[0].name);
            } else {
                // Display error message if data retrieval fails
                $("#editLocationModal .modal-title").text("Error retrieving data");
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            // Display error message if AJAX request fails
            $("#editLocationModal .modal-title").text("Error retrieving data");
        }
    });
});

$('#editLocationForm').on("submit", function (event) {
    // Prevent default form submission
    event.preventDefault();

    var newName = $("#editLocation").val(); // Retrieve the new name
    var originalName = $("#originalLocationName").val(); // Retrieve the original name

    $.ajax({
        url: '/project2/libs/php/editLocation.php',
        type: 'POST',
        data: {
            name: newName,
            originalName: originalName // Pass the original name as parameter
        },
        dataType: 'json',
        success: function (response) {

            // Check if the operation was successful
            if (response.status.code == '200') {
                // Show success message within the modal
                $('#successMessage').html('Location "' + originalName + '" has been successfully changed to ' + newName);
                $('#successMessage').show();

                // Clear the form fields
                $('#editLocationForm')[0].reset();

                // Refresh the content of the "Locations" tab
                refreshTabs();
            } else if (response.status.code == '409') {
                $('#duplicateMessage').html('Location "' + newName + '" already exists.');
                $('#duplicateMessage').show();
            } else {
                // Handle other errors here
                console.error('Error: ' + response.status.description);
            }
        },
        error: function (xhr, status, error) {
            // Handle AJAX errors here
            console.error('AJAX Error: ' + error);
        }
    });
});



  $('#addLocationForm').on("submit", function (event) {
    // Prevent default form submission
    event.preventDefault();

    // Get the location name from the input field
    var locationName = $('#addLocation').val();

    // Send an AJAX request to addLocation.php
    $.ajax({
      url: '/project2/libs/php/addLocation.php',
      type: 'POST',
      data: { name: locationName },
      dataType: 'json',
      success: function (response) {
        // Check if the operation was successful
        if (response.status.code == '200') {

          // Show success message within the modal
          $('#successMessage').html('Location "' + locationName + '" has been successfully added.');
          $('#successMessage').show();

          // Clear the form fields
          $('#addLocationForm')[0].reset();

          // Refresh the content of the "Locations" tab
          refreshTabs();
        } else if (response.status.code == '409') {
          $('#duplicateMessage').html('Location "' + locationName + '" already exists.');
          $('#duplicateMessage').show();
        }
        else {
          // Handle error (optional)
          console.error('Error: ' + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        // Handle AJAX errors (optional)
        console.error('AJAX Error: ' + error);
      }
    });
  });

  // Function to clear the form fields
  function clearForm() {
    $('#addLocationForm')[0].reset();
    $('#successMessage').hide();
    $('#duplicateMessage').hide();
  }

 

  // Function to refresh the content of the "Locations" tab
  function refreshTabs() {
    if ($("#personnelBtn").hasClass("active")) {
      $.ajax({
        url: '/project2/libs/php/getAllPersonnel.php', // Adjust the URL as needed
        type: 'GET',
        dataType: 'html', // Assuming the response is HTML
        success: function (html) {
          // Replace the content of the "Locations" tab with the updated content
          populatePersonnelData();
        },
        error: function (xhr, status, error) {
          // Handle AJAX errors (optional)
          console.error('AJAX Error: ' + error);
        }

      })
    } else if ($("#departmentsBtn").hasClass("active")) {
      $.ajax({
        url: '/project2/libs/php/getAllDepartments.php', // Adjust the URL as needed
        type: 'GET',
        dataType: 'html', // Assuming the response is HTML
        success: function (html) {
          // Replace the content of the "Locations" tab with the updated content
          populateDepartment();
        },
        error: function (xhr, status, error) {
          // Handle AJAX errors (optional)
          console.error('AJAX Error: ' + error);
        }
      })
    } else if ($("#locationsBtn").hasClass("active")) {
      $.ajax({
        url: '/project2/libs/php/getAllLocations.php', // Adjust the URL as needed
        type: 'GET',
        dataType: 'html', // Assuming the response is HTML
        success: function (html) {
          // Replace the content of the "Locations" tab with the updated content
          populateLocationData();
        },
        error: function (xhr, status, error) {
          // Handle AJAX errors (optional)
          console.error('AJAX Error: ' + error);
        }
      })

    } else {
      console.log("No active button found.");
  
    }
  }

  });


