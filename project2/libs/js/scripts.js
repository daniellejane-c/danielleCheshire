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

          // Loop through personnel data and populate table rows
          $.each(personnelData, function (index, personnel) {
            var row = '<tr>' +
              '<td class="align-middle text-nowrap" id="personnelName">' + personnel.lastName + ', ' + personnel.firstName + '</td>' +
              '<td class="align-middle text-nowrap d-none d-md-table-cell" id="personnelDepartment">' + personnel.department + '</td>' +
              '<td class="align-middle text-nowrap d-none d-md-table-cell" id="personneljobTitle">' + personnel.jobTitle + '</td>' +
              '<td class="align-middle text-nowrap d-none d-md-table-cell" id="personnelLocation">' + personnel.location + '</td>' +
              '<td class="align-middle text-nowrap d-none d-md-table-cell" id="personnelEmail">' + personnel.email + '</td>' +
              '<td class="text-end text-nowrap">' +
              '<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editPersonnelModal" data-id="' + personnel.id + '">' +
              '<i class="fa-solid fa-pencil fa-fw"></i>' +
              '</button>' +
              '<button type="button" class="btn btn-primary btn-sm deletePersonnelBtn" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal" data-id="' + personnel.id + '">' +
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
                  '<button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" data-id="' + department.id + '">' +
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
              '<button type="button" class="btn btn-primary btn-sm deleteLocationBtn" data-bs-toggle="modal" data-bs-target="#deleteLocationModal" data-id="' + location.id + '">' +
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


  $('button[data-bs-toggle="tab"]').on('shown.bs.tab', function (event) {
    var target = $(event.target).data('bs-target');
    refreshTable(getTableName(target));
  });

  // Handle refresh button click
  $("#refreshBtn").click(function () {
    if ($("#personnelBtn").hasClass("active")) {
      refreshTable("personnel");
    } else if ($("#departmentsBtn").hasClass("active")) {
      refreshTable("department");
    } else if ($("#locationsBtn").hasClass("active")) {
      refreshTable("location");
    } else {
      console.log("No active button found.");
    }
  });

  // Map tab pane IDs to table names
  function getTableName(tabId) {
    switch (tabId) {
      case '#personnel-tab-pane':
        return 'personnel';
      case '#departments-tab-pane':
        return 'department';
      case '#locations-tab-pane':
        return 'location';
      default:
        return '';
    }
  }

  // Refresh table function
  function refreshTable(table) {
    if (table === '') {
        showMessage("Invalid table specified");
        return;
    }

    $.ajax({
        url: "/project2/libs/php/refresh.php",
        type: "GET",
        data: { table: table }, // Specify the table parameter
        success: function (response) {
            // Parse the JSON response
            let data = JSON.parse(response);

            if (data.status === "success") {
                showTick(); // Show tick symbol
                // Hide tick symbol after 1 second
                setTimeout(hideTick, 1000);
                // You can update the UI here if needed
            } else {
                showMessage("Error refreshing " + table + " table: " + data.message);
            }
        },
        error: function (jqXHR, textStatus, errorThrown) {
            showMessage("Error refreshing " + table + " table: " + textStatus + " - " + errorThrown);
        }
    });
}

function showMessage(message) {
    // Display the message in the messageContainer div
    $('#messageContainer').text(message);
}

function showTick() {
    // Show the tick icon
    $('#tickIcon').show();
}

function hideTick() {
    // Hide the tick icon
    $('#tickIcon').hide();
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



  $("#editDepartmentModal").on("show.bs.modal", function (e) {
    fetchDropdownData('#addLocationName');
  });
  // Fetch locations and populate dropdown on page load

  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    fetchDropdownData('#addPersonnelDepartment');
    clearForm();
  });

  $('#editLocationModal').on("show.bs.modal", function (e) {
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
        console.log(response);
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
        console.log("Error:", jqXHR, textStatus, errorThrown);
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
  $("#addPersonnelModal").on("show.bs.modal", function (e) {
    fetchDropdownData('#addPersonnelDepartment');
    clearForm();
  });

  $('#addPersonnelForm').on("submit", function (event) {
    event.preventDefault();

    var firstName = $('#addPersonnelFirstName').val();
    var lastName = $('#addPersonnelLastName').val();
    var jobTitle = $('#addPersonnelJobTitle').val();
    var email = $('#addPersonnelEmailAddress').val();
    var departmentID = $('#addPersonnelDepartment').val();
    console.log(firstName, lastName, jobTitle, email, departmentID);
    console.log(departmentID);
    // Fetch the department name first
    $.ajax({
      url: '/project2/libs/php/getDepartmentByID.php',
      method: 'GET',
      data: { id: departmentID },
      dataType: 'json',
      success: function (response) {
        console.log(response);
        var departmentName = response.data[0].name;
        console.log(departmentName);


        // Now that you have the department name, make the second AJAX call
        $.ajax({
          url: '/project2/libs/php/addPersonnel.php',
          type: 'POST',
          data: {
            firstName: firstName,
            lastName: lastName,
            jobTitle: jobTitle,
            email: email,
            departmentID: departmentID,

          },
          dataType: 'json',

          success: function (response) {

            console.log(response);
            // Check if the operation was successful
            if (response.status.code == '200') {
              // Show success message within the modal
              $('#successAddPersonnel').html('Employee added successfully: "' + firstName + ', ' + lastName + ', ' + jobTitle + ', ' + email + ', ' + departmentName + '"');
              $('#successAddPersonnel').show();
              // Clear the form fields
              $('#addPersonnelForm')[0].reset();
              refreshTabs();
            } else if (response.status.code == '409') {
              $('#duplicatePersonnel').html('Employee with email "' + email + '" already exists.');
              $('#duplicatePersonnel').show();
            } else {
              // Handle error (optional)
              console.error('Error: ' + response.status.description);
            }
          },
          error: function (jqXHR, status, error) {
            // Handle AJAX errors (optional)
            console.error('AJAX Error: ' + jqXHR, status, error);
          }
        });
      },
      error: function (xhr, status, error) {
        console.error('Error fetching department name:', xhr, status, error);
        // Handle error if needed
      }
    });
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
          $("#originalPersonnelEmployeeEmail").val(result.data.personnel[0].email);

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
  $("#editPersonnelForm").on("submit", function (event) {
    event.preventDefault();

    var employeeID = $("#editPersonnelEmployeeID").val(); // Retrieve the employee ID
    var firstName = $("#editPersonnelFirstName").val(); // Retrieve the first name
    var lastName = $("#editPersonnelLastName").val(); // Retrieve the last name
    var jobTitle = $("#editPersonnelJobTitle").val(); // Retrieve the job title
    var emailAddress = $("#editPersonnelEmailAddress").val(); // Retrieve the email address
    var department = $("#editPersonnelDepartment").val(); // Retrieve the department
    var originalEmailAddress = $("#originalPersonnelEmployeeEmail").val();
    var emailToUpdate = (emailAddress !== originalEmailAddress) ? emailAddress : originalEmailAddress;

    // AJAX request to edit the personnel
    $.ajax({
      url: '/project2/libs/php/editPersonnel.php',
      type: 'POST',
      dataType: 'json',
      data: {
        employeeID: employeeID,
        firstName: firstName,
        lastName: lastName,
        jobTitle: jobTitle,
        email: emailToUpdate,
        departmentID: department
      },
      success: function (response) {
        if (response.status.code == '200') {
          // Retrieve department name using AJAX
          $.ajax({
            url: '/project2/libs/php/getDepartmentByID.php',
            type: 'GET',
            dataType: 'json',
            data: {
              id: department
            },
            success: function (departmentResponse) {
              var departmentName = departmentResponse.data[0].name;
              var successMessage = 'Personnel updated to: ';
              successMessage += firstName + ', ';
              successMessage += lastName + ', ';
              successMessage += jobTitle + ', ';
              successMessage += emailAddress + ', ';
              successMessage += departmentName;

              $('#personnelSuccessMessage').html(successMessage);
              $('#personnelSuccessMessage').show();
              $('#editPersonnelForm')[0].reset();
              refreshTabs();
            },
            error: function (xhr, status, error) {
              console.error('Error retrieving department name: ' + error);
            }
          });
        } else if (response.status.code == '409') {
          $('#personnelDuplicateMessage').html('Employee with email "' + emailAddress + '" already exists');
          $('#personnelDuplicateMessage').show();
        } else {
          console.error('Error: ' + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        $('#personnelErrorMessage').html('AJAX Error: ' + error);
        $('#personnelErrorMessage').show();
        console.error('AJAX Error: ' + error);
      }
    });
  });



  $("#addDepartmentModal").on("show.bs.modal", function (e) {
    fetchDropdownData('#addLocationName');
    clearForm();
  });

  $('#addDepartmentForm').submit(function (event) {
    event.preventDefault();

    var departmentName = $('#addDepartmentName').val();
    var selectedLocation = $('#addLocationName').val();

    // Fetch the location ID first
    $.ajax({
      url: '/project2/libs/php/getLocationID.php',
      method: 'GET',
      data: { location: selectedLocation },
      success: function (response) {
        var locationID = selectedLocation;

        $.ajax({
          url: '/project2/libs/php/getLocationByID.php',
          type: 'GET',
          dataType: 'json',
          data: {
            id: locationID
          },
          success: function (response) {
            var locationName = response.data[0].name;

            // Now that you have the location ID, make the second AJAX call
            $.ajax({
              url: '/project2/libs/php/addDepartment.php',
              type: 'POST',
              data: { name: departmentName, locationID: locationID }, // Include locationID here
              dataType: 'json',
              success: function (response) {
                // Check if the operation was successful
                if (response.status.code == '200') {
                  // Show success message within the modal
                  $('#successDepAdd').html('Department "' + departmentName + '" in "' + locationName + ' " has been successfully added.');
                  $('#successDepAdd').show();

                  // Clear the form fields
                  $('#addDepartmentForm')[0].reset();

                  // Refresh the content of the "Locations" tab
                  refreshTabs();
                } else if (response.status.code == '409') {
                  $('#duplicateDepartment').html('Department "' + departmentName + '" already exists.');
                  $('#duplicateDepartment').show();
                } else {
                  // Handle error (optional)
                  console.error('Error: ' + response.status.description);
                }
              },
              error: function (xhr, status, error) {
                // Handle AJAX errors (optional)
                console.error('AJAX Error: ' + error);
              }
            });
          },
          error: function (xhr, status, error) {
            console.error('Error fetching location ID:', error);
            // Handle error if needed
          }
        });
      },
      error: function (xhr, status, error) {
        console.error('Error fetching location ID:', error);
        // Handle error if needed
      }
    });
  });


  $("#editDepartmentModal").on("show.bs.modal", function (e) {
    clearForm();
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
          $("#originalDepartmentName").val(result.data[0].name);
          $('#originalDepartmentLocation').val(result.data[0].locationID);

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

  $("#editDepartmentForm").on("submit", function (event) {
    event.preventDefault();

    var newDepName = $("#editDepartmentName").val(); // Retrieve the new department name
    var newLocationID = $("#editDepartmentLocation").val(); // Retrieve the new location ID
    var originalDepName = $("#originalDepartmentName").val(); // Retrieve the original department name
    var originalDepLocationID = $("#originalDepartmentLocation").val(); // Retrieve the original department location ID

    // Variables to store original and new department location names
    var originalDepLocationName, newDepLocationName;

    // AJAX request to retrieve the original department location name
    $.ajax({
      url: '/project2/libs/php/getLocationByID.php',
      type: 'GET',
      dataType: 'json',
      data: {
        id: originalDepLocationID // Pass the original department location ID
      },
      success: function (response) {
        if (response.status.code == 200) {
          originalDepLocationName = response.data[0].name; // Assuming response structure has 'data' as an object


          // AJAX request to retrieve the new department location name
          $.ajax({
            url: '/project2/libs/php/getLocationByID.php',
            type: 'GET',
            dataType: 'json',
            data: {
              id: newLocationID // Pass the new department location ID
            },
            success: function (response) {
              if (response.status.code == 200) {
                newDepLocationName = response.data[0].name;

                // AJAX request to edit the department
                $.ajax({
                  url: '/project2/libs/php/editDepartment.php',
                  type: 'POST',
                  data: {
                    departmentName: newDepName,
                    locationID: newLocationID, // Pass the new location ID
                    originalDepartmentName: originalDepName
                  },
                  dataType: 'json',
                  success: function (response) {

                    if (response.status.code == '200') {
                      $('#depSuccessMessage').html('Department "' + originalDepName + ' in ' + originalDepLocationName + '" has been successfully changed to "' + newDepName + ' in ' + newDepLocationName + '"');
                      $('#depSuccessMessage').show();
                      $('#editDepartmentForm')[0].reset();
                      refreshTabs();
                    } else if (response.status.code == '409') {
                      $('#depDuplicateMessage').html('Department "' + newDepName + '" already exists.');
                      $('#depDuplicateMessage').show();
                    } else {
                      console.error('Error: ' + response.status.description);
                    }
                  },
                  error: function (xhr, status, error) {
                    console.error('AJAX Error: ' + error);
                  }
                });
              } else {
                console.error('Error: Unable to retrieve new department location name');
              }
            },
            error: function (xhr, status, error) {
              console.error('AJAX Error: ' + error);
            }
          });
        } else {
          console.error('Error: Unable to retrieve original department location name');
        }
      },
      error: function (xhr, status, error) {
        console.error('AJAX Error: ' + error);
      }
    });
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
          $('#successMessage').html('Location "' + originalName + '" has been successfully changed to "' + newName + '"');
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
          $('#successMessage1').html('Location "' + locationName + '" has been successfully added.');
          $('#successMessage1').show();

          // Clear the form fields
          $('#addLocationForm')[0].reset();

          // Refresh the content of the "Locations" tab
          refreshTabs();
        } else if (response.status.code == '409') {
          $('#duplicateMessage1').html('Location "' + locationName + '" already exists.');
          $('#duplicateMessage1').show();
        } else {
          // Handle other status codes if needed
          console.error('Error: ' + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        // Handle AJAX errors
        console.error('AJAX Error: ' + error);
      }
    });
  });

  //deletePersonnel


  $('.deletePersonnelBtn').on('click', function () {

    var personnelId = $(this).data('id');
    var personnelFirstName = $(this).closest('tr').find('#personnelName').text().split(',')[1].trim();
    var personnelLastName = $(this).closest('tr').find('#personnelName').text().split(',')[0].trim();

    $('#deleteEmployeeName').text(personnelLastName + ', ' + personnelFirstName);


    $('#delete-form input[name="id"]').val(personnelId);
  });


  $('#deletePersonnelModal').on('show.bs.modal', function (e) {
    clearForm();
    var button = $(e.relatedTarget);

    var personnelId = button.data('id');
    var personnelFirstName = button.closest('tr').find('#personnelName').text().split(',')[1].trim();
    var personnelLastName = button.closest('tr').find('#personnelName').text().split(',')[0].trim();

    $('#deleteEmployeeName').text(personnelLastName + ', ' + personnelFirstName);


    $('#delete-form input[name="id"]').val(personnelId);
  });

  $('#delete-form').submit(function (event) {

    event.preventDefault();


    var personnelId = $('#delete-form input[name="id"]').val();
    $.ajax({
      url: '/project2/libs/php/getPersonnelByID.php',
      type: 'POST',
      dataType: 'json',
      data: { id: personnelId },
      success: function (personnelResponse) {
        if (personnelResponse.status.code === "200") {
          var personnelName = personnelResponse.data.personnel[0].firstName + ' ' + personnelResponse.data.personnel[0].lastName;

          // Make an AJAX call to the PHP script to delete the personnel
          $.ajax({
            url: '/project2/libs/php/deletePersonnel.php',
            type: 'POST',
            dataType: 'json',
            data: { id: personnelId },
            success: function (response) {
              if (response.status.code === "200") {
                $('#deletePersonnelSuccess').text('Employee ' + personnelName + ' has been successfully deleted.');
                $('#deletePersonnelSuccess').show();
                $('#yesBtn').hide();
                $('#noBtn').hide();
                refreshTabs();


              } else {
                // Handle other status codes if needed
                console.log("Error: " + response.status.description);
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.log("Error:", textStatus, errorThrown);
            }
          });
        } else {
          console.log("Error: " + personnelResponse.status.description);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error:", textStatus, errorThrown);
      }
    });
  });


  //deleteDepartment


  $('#deleteDepartmentModal').on('show.bs.modal', function (e) {
    clearForm();
    var button = $(e.relatedTarget);

    var departmentId = button.data('id');
    var departmentName = button.closest('tr').find('#departmentName').text();

    $.ajax({
      url: '/project2/libs/php/checkDepartmentEligibility.php',
      type: 'POST',
      dataType: 'json',
      data: { id: departmentId },
      success: function(response) {
          console.log(response);
          if (response.status.code === "200") {
              $('#deleteDepartmentTextEligible').show();
              $('#deleteDepartmentTextNotEligible').hide();
              $('#departmentNameEligible').text(departmentName);
              $('#deleteDepartmentForm input[name="id"]').val(departmentId);
              $('#deleteDepartmentModal').modal('show');
              $('#depYesBtn').show();
                $('#depNoBtn').show();
          } else {
              if (response.status.code === "409") {
                  $('#deleteDepartmentTextEligible').hide();
                  $('#deleteDepartmentTextNotEligible').show();
                  $('#departmentNameNotEligible').text(departmentName);
                  $('#numEmployees').text(response.data.count);
                  $('#deleteDepartmentModal').modal('show');
                  $('#depYesBtn').hide();
                $('#depNoBtn').hide();
              } else {
                  console.log("Error: " + response.status.description);
              }
          }
      },
      error: function(jqXHR, textStatus, errorThrown) {
          console.log("Error:", textStatus, errorThrown);
      }
  });
});

$('#deleteDepartmentForm').submit(function (event) {
  event.preventDefault();

  var departmentId = $('#deleteDepartmentForm input[name="id"]').val();
  $.ajax({
      url: '/project2/libs/php/getDepartmentByID.php',
      type: 'POST',
      dataType: 'json',
      data: { id: departmentId },
      success: function (response) {
        console.log(response);
          if (response.status.code === "200") {
              var departmentName = response.data[0].name
              console.log(departmentName);
              $.ajax({
                  url: '/project2/libs/php/deleteDepartment.php',
                  type: 'POST',
                  dataType: 'json',
                  data: { id: departmentId },
                  success: function(response) {
                      console.log(response);
                      if (response.status.code === "200") {
                          $('#deleteDepartmentSuccess').text('Department: ' + departmentName + ' has been successfully deleted.');
                          $('#deleteDepartmentSuccess').show();
                          $('#depYesBtn').hide();
                          $('#depNoBtn').hide();
                          refreshTabs();
                      } else {
                          // Handle other status codes if needed
                          if (response.status.code === "409") {
                              $('#deleteDepartmentTextEligible').hide();
                              $('#deleteDepartmentTextNotEligible').show();
                              $('#departmentNameNotEligible').text(response.data.departmentName);
                              $('#numEmployees').text(response.data.count);
                          } else {
                              console.log("Error: " + response.status.description);
                          }
                      }
                  },
                  error: function(jqXHR, textStatus, errorThrown) {
                      console.log("Error:", textStatus, errorThrown);
                  }
              });
          }
      }
  });
});
//delete location

$('.deleteLocationBtn').on('click', function () {
  var locationId = $(this).data('id');
  var locationName = $(this).closest('tr').find('#locationName').text().trim();
  var numDepartments = $(this).closest('tr').find('#numDepartments').text().trim();

  if (numDepartments == 0) {
    $('#deleteLocationTextEligible').show();
    $('#deleteLocationTextNotEligible').hide();
    $('#locationNameEligible').text(locationName);
  } else {
    $('#deleteLocationTextEligible').hide();
    $('#deleteLocationTextNotEligible').show();
    $('#locationNameNotEligible').text(locationName);
    $('#numDepartments').text(numDepartments);
  }

  $('#deleteLocationForm input[name="id"]').val(locationId);
});

$('#deleteLocationModal').on('show.bs.modal', function (e) {
  clearForm();
  var button = $(e.relatedTarget);

  var locationId = button.data('id');
  var locationName = button.closest('tr').find('#locationName').text();

  $.ajax({
    url: '/project2/libs/php/checkLocationEligibility.php',
    type: 'POST',
    dataType: 'json',
    data: { id: locationId },
    success: function(response) {
        console.log(response);
        if (response.status.code === "200") {
            $('#deleteLocationTextEligible').show();
            $('#deleteLocationTextNotEligible').hide();
            $('#locationNameEligible').text(locationName);
            $('#deleteLocationForm input[name="id"]').val(locationId);
            $('#deleteLocationModal').modal('show');
            $('#locYesBtn').show();
            $('#locNoBtn').show();
        } else {
            if (response.status.code === "409") {
                $('#deleteLocationTextEligible').hide();
                $('#deleteLocationTextNotEligible').show();
                $('#locationNameNotEligible').text(locationName);
                $('#numDepartments').text(response.data.count);
                $('#deleteLocationModal').modal('show');
                $('#locYesBtn').hide();
              $('#locNoBtn').hide();
            } else {
                console.log("Error: " + response.status.description);
            }
        }
    },
    error: function(jqXHR, textStatus, errorThrown) {
        console.log("Error:", textStatus, errorThrown);
    }
});
});

$('#deleteLocationForm').submit(function (event) {
event.preventDefault();

var locationId = $('#deleteLocationForm input[name="id"]').val();
$.ajax({
    url: '/project2/libs/php/getLocationByID.php',
    type: 'POST',
    dataType: 'json',
    data: { id: locationId },
    success: function (response) {
      console.log(response);
        if (response.status.code === "200") {
            var locationName = response.data[0].name
            console.log(locationName);
            $.ajax({
                url: '/project2/libs/php/deleteLocation.php',
                type: 'POST',
                dataType: 'json',
                data: { id: locationId },
                success: function(response) {
                    console.log(response);
                    if (response.status.code === "200") {
                        $('#deleteLocationSuccess').text('Location: ' + locationName + ' has been successfully deleted.');
                        $('#deleteLocationSuccess').show();
                        $('#locYesBtn').hide();
                        $('#locNoBtn').hide();
                        refreshTabs();
                    } else {
                        // Handle other status codes if needed
                        if (response.status.code === "409") {
                            $('#deleteLocationTextEligible').hide();
                            $('#deleteLocationTextNotEligible').show();
                            $('#locationNameNotEligible').text(response.data.LocationName);
                            $('#numDepartments').text(response.data.count);
                        } else {
                            console.log("Error: " + response.status.description);
                        }
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    console.log("Error:", textStatus, errorThrown);
                }
            });
        }
    }
});
});


  // Function to clear the form fields
  function clearForm() {
    $('#addLocationForm')[0].reset();
    $('#addDepartmentForm')[0].reset();
    $('#addPersonnelForm')[0].reset();
    $('#successMessage').hide();
    $('#duplicateMessage').hide();
    $('#duplicateMessage1').hide();
    $('#successMessage1').hide();
    $('#successDepAdd').hide();
    $('#duplicateDepartment').hide();
    $('#depSuccessMessage').hide();
    $('#depDuplicateMessage').hide();
    $('#personnelSuccessMessage').hide();
    $('#personnelDuplicateMessage').hide();
    $('#deletePersonnelSuccess').hide();
    $('#deleteDepartmentSuccess').hide();
    $('#yesBtn').show();
    $('#noBtn').show();
    $('#deleteLocationSuccess').hide();
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


