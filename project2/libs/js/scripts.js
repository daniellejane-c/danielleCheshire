$(document).ready(function () {
  populatePersonnelData();
  populateLocationData();
  populateDepartment();
  populateDepartmentFilter();
  populateLocationFilter();

  //search bar

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

  function clearSearchBar() {
    $("#searchInp").val('').trigger('keyup');
  }

  function capitalizeFirstLetter(string) {

      return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }
  
  
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
                    var nameA = a.name.toLowerCase();
                    var nameB = b.name.toLowerCase();
                    return nameA.localeCompare(nameB);
                });

                // Clear existing table content
                $('#departmentTableBody').empty();

                // Fetch all location names first
                var locationPromises = departmentData.map(function(department) {
                    return $.ajax({
                        url: '/project2/libs/php/getLocationByID.php',
                        type: 'GET',
                        dataType: 'json',
                        data: {
                            id: department.locationID
                        }
                    });
                });

                // Wait for all location AJAX requests to finish
                $.when.apply($, locationPromises).done(function() {
                    var locationResponses = arguments;
                    
                    // Loop through department data and populate table rows
                    $.each(departmentData, function(index, department) {
                        var locationName = locationResponses[index][0].data[0].name;
                        var row = '<tr class="personnel-row" >' +
                            '<td class="align-middle text-nowrap" id="departmentName">' + department.name + '</td>' +
                            '<td class="align-middle text-nowrap d-none d-md-table-cell" id="depLocation">' + locationName + '</td>' +
                            '<td class="align-middle text-end text-nowrap">' +
                            '<button type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#editDepartmentModal" data-id=' + department.id + '>' +
                            '<i class="fa-solid fa-pencil fa-fw"></i>' +
                            '</button>' +
                            '<button type="button" class="btn btn-primary btn-sm deleteDepartmentBtn" data-bs-toggle="modal" data-bs-target="#deleteDepartmentModal" data-id="' + department.id + '">' +
                            '<i class="fa-solid fa-trash fa-fw"></i>' +
                            '</button>' +
                            '</td>' +
                            '</tr>';
                        $('#departmentTableBody').append(row);
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

                locationData.sort(function (a, b) {
                  return a.name.localeCompare(b.name);
              });
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
      clearSearchBar();
      populatePersonnelData();
    } else if ($("#departmentsBtn").hasClass("active")) {
      populateDepartment();
      refreshTable("department");
      populateDepartment();
      clearSearchBar();
    } else if ($("#locationsBtn").hasClass("active")) {
      refreshTable("location");
      clearSearchBar();
      populateLocationData();
;    } else {
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
          clearSearchBar();
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


  function showClearFilterButton() {
    $('#clearFilterButton').show();
  }

  function hideClearFilterButton() {
    $('#clearFilterButton').hide();
  }


  function populateDepartmentFilter() {
    $.ajax({
      url: '/project2/libs/php/getAllDepartments.php',
      type: 'GET',
      dataType: 'json',
      success: function (response) {

        var departmentSelect = document.getElementById("departmentSelect");

        // Clear existing options
        departmentSelect.innerHTML = "";

        // Add default option
        var defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.text = "Select Department";
        departmentSelect.appendChild(defaultOption);

        response.data.sort(function(a, b) {
          return a.name.localeCompare(b.name);
        });
        // Add department options
        response.data.forEach(function (department) { // Accessing data array
          var option = document.createElement("option");
          option.value = department.id;
          option.text = department.name;
          departmentSelect.appendChild(option);
        });
      },
      error: function (xhr, status, error) {
        console.error('Error fetching departments:', error);
      }
    });
  }

  // Function to fetch locations data and populate the location dropdown
  // Function to fetch locations data and populate the location dropdown
  function populateLocationFilter() {
    $.ajax({
      url: '/project2/libs/php/getAllLocations.php',
      type: 'GET',
      dataType: 'json',
      success: function (response) {

        var locationSelect = document.getElementById("locationSelect");

        // Clear existing options
        locationSelect.innerHTML = "";
        response.data.sort(function(a, b) {
          return a.name.localeCompare(b.name);
        });
        // Add default option
        var defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.text = "Select Location";
        locationSelect.appendChild(defaultOption);

        // Add location options
        response.data.forEach(function (location) { // Accessing data array
          var option = document.createElement("option");
          option.value = location.id;
          option.text = location.name;
          locationSelect.appendChild(option);
        });
      },
      error: function (xhr, status, error) {
        console.error('Error fetching locations:', error);
      }
    });
  }



  // Event listener for tab clicks
  $('.nav-link').click(function () {
    var tabId = $(this).attr('id');
    if (tabId !== 'personnelBtn') {
      // Hide the filter button if a tab other than "personnel" is clicked
      $('#filterBtn').hide();
    } else {
      // Show the filter button if the "personnel" tab is clicked
      $('#filterBtn').show();
    }
  });
  // Populate dropdowns on modal show
  var activeFilter = null;

  $('#filterBoxModal').on('shown.bs.modal', function () {
    populateDepartmentFilter();
    populateLocationFilter();
  });

  // Function to apply filter based on the active select
  function applyFilter() {
    var filterValue = "";
    if (activeFilter === "department") {
      filterValue = $("#departmentSelect").val();
      // Hide rows that don't match the selected department
      $(".personnel-row").each(function () {
        if ($(this).data("department") !== filterValue && filterValue !== "") {
          $(this).hide();
        } else {
          $(this).show();
        }
      });
    } else if (activeFilter === "location") {
      filterValue = $("#locationSelect").val();
      // Hide rows that don't match the selected location
      $(".personnel-row").each(function () {
        if ($(this).data("location") !== filterValue && filterValue !== "") {
          $(this).hide();
        } else {
          $(this).show();
        }
      });
    }
  }
  

  $("#filterBtn").click(function () {
    $('#filterBoxModal').modal('show');
    // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
  });

  // Event handler for department filter
  $("#departmentSelect").change(function () {
    activeFilter = "department";
    if ($("#departmentSelect").val() === "") {
      // Repopulate location filter options when "Select Department" is clicked again
      populateLocationFilter();
    } else {
      // Clear location filter options when department is selected
      $("#locationSelect").empty().append($('<option>', {
        value: '',
        text: 'Select Location'
      }));
    }
    applyFilter();
    // Re-enable location select
    $("#locationSelect").prop("disabled", false);
  });

  // Event handler for location filter
  $("#locationSelect").change(function () {
    activeFilter = "location";
    if ($("#locationSelect").val() === "") {
      // Repopulate department filter options when "Select Location" is clicked again
      populateDepartmentFilter();
    } else {
      // Clear department filter options when location is selected
      $("#departmentSelect").empty().append($('<option>', {
        value: '',
        text: 'Select Department'
      }));
    }
    applyFilter();
    // Re-enable department select
    $("#departmentSelect").prop("disabled", false);
  });

  $('#filterForm').on("submit", function (event) {
    event.preventDefault(); // Prevent form submission

    var departmentSelected = $('#departmentSelect').val();
    var locationSelected = $('#locationSelect').val();

    if (departmentSelected !== "") {
      // Filter by department
      $.ajax({
        url: '/project2/libs/php/filterDepartment.php',
        type: 'GET',
        data: { departmentId: departmentSelected },
        dataType: 'json',
        success: function (response) {
          // Update table rows with filtered data
          updateTableRows(response.data);
          showClearFilterButton(); // Show clear filter button
          populateDepartment();
        },
        error: function (jqxhr, status, error) {
          // Handle errors here
          console.error(jqxhr);
        }
      });
    } else if (locationSelected !== "") {
      // Filter by location
      $.ajax({
        url: '/project2/libs/php/filterLocation.php',
        type: 'GET',
        data: { locationID: locationSelected },
        dataType: 'json',
        success: function (response) {
          // Update table rows with filtered data
          updateTableRows(response.data);
          showClearFilterButton(); // Show clear filter button
          populateDepartment();
        },
        error: function (jqxhr, status, error) {
          // Handle errors here
          console.error(jqxhr);
        }
      });
    } else {
      console.error("Please select a department or a location.");
    }

    $('#filterBoxModal').modal('hide');
  });

  function updateTableRows(data) {
    var tableBody = $('#personnelTableBody');
    tableBody.empty(); // Clear existing rows

    // Loop through the filtered data and create table rows
    data.forEach(function (item) {
      var row = '<tr>';
      row += '<td>' + item.lastName + '</td>';
      row += '<td>' + item.firstName + '</td>';
      row += '<td>' + item.jobTitle + '</td>';
      row += '<td>' + item.email + '</td>';
      row += '<td>' + item.department + '</td>';
      row += '<td>' + item.location + '</td>';
      row += '</tr>';
      tableBody.append(row); // Append row to table body
    });
  }

  $('#clearFilterButton').on('click', function () {
    // Clear the filter and show all data
    $('#filterForm')[0].reset(); // Reset form
    // Hide tick icon
    hideClearFilterButton(); // Hide clear filter button
    populatePersonnelData();
    populateDepartment();
    populateLocationData();
    $('#filterBtn').show();
    // Optionally, fetch and display all data here
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
    setTimeout(function() {
      $('.editDepartmentName').focus();
  }, 350);
  });
  // Fetch locations and populate dropdown on page load

  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    fetchDropdownData('#addPersonnelDepartment');
    clearForm();
    setTimeout(function() {
      $('.editPersonnelFirstName').focus();
  }, 300);
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

        if (response.status.code === "200") {
          var dropdownData = response.data;

          // Clear existing options
          $(dropdownId).empty();
          response.data.sort(function(a, b) {
            return a.name.localeCompare(b.name);
          });
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


    $('#addPersonnelModal').on('shown.bs.modal', function () {
      fetchDropdownData('#addPersonnelDepartment');

      
      clearForm();
      setTimeout(function() {
          $('#addPersonnelFirstName').focus();
      }, 300); // Adding a slight delay before setting the focus


  });

  $('#addPersonnelForm').on("submit", function (event) {
    event.preventDefault();

    var firstName = capitalizeFirstLetter($('#addPersonnelFirstName').val().trim());
    var lastName = capitalizeFirstLetter($('#addPersonnelLastName').val().trim());
    var jobTitle = capitalizeFirstLetter($('#addPersonnelJobTitle').val().trim());
    var email = $('#addPersonnelEmailAddress').val();
    var departmentID = $('#addPersonnelDepartment').val();

    // Fetch the department name first
    $.ajax({
      url: '/project2/libs/php/getDepartmentByID.php',
      method: 'GET',
      data: { id: departmentID },
      dataType: 'json',
      success: function (response) {

        var departmentName = response.data[0].name;



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


            // Check if the operation was successful
            if (response.status.code == '200') {
              // Show success message within the modal
              $('#successAddPersonnel').html('Employee added successfully: "' + firstName + ', ' + lastName + ', ' + jobTitle + ', ' + email + ', ' + departmentName + '"');
              $('#successAddPersonnel').show();
              // Clear the form fields
              $('#addPersonnelForm')[0].reset();
              refreshTabs();
              clearSearchBar();
              populatePersonnelData();
              $('.addEmployeeBtns').hide();
              $('.addP').hide();
              $('#duplicatePersonnel').hide();
              $('#pAddOkButton').show();
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
    var firstName = capitalizeFirstLetter($("#editPersonnelFirstName").val().trim()); // Retrieve the first name
    var lastName = capitalizeFirstLetter($("#editPersonnelLastName").val().trim()); // Retrieve the last name
    var jobTitle = capitalizeFirstLetter($("#editPersonnelJobTitle").val().trim()); // Retrieve the job title
    var emailAddress = $("#editPersonnelEmailAddress").val(); // Retrieve the email address
    var department = $("#editPersonnelDepartment").val(); // Retrieve the department
    var originalEmailAddress = capitalizeFirstLetter($("#originalPersonnelEmployeeEmail").val().trim());
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
              clearSearchBar();
              $('.editPersonnelBtns').hide();
              $('.editP').hide();
              $('#personnelDuplicateMessage').hide();
              $('#pEditOkButton').show();
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

    setTimeout(function() {
      $('.addDepartmentName').focus();
  }, 350);
  });

  $('#addDepartmentForm').submit(function (event) {
    event.preventDefault();

    var departmentName = capitalizeFirstLetter($('#addDepartmentName').val().trim());
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

                  clearSearchBar();
                  populateDepartment();
                  $('.addD').hide();
                  $('.addDepartmentBtns').hide();
                  $('#duplicateDepartment').hide();
                  $('#dAddOkButton').show();
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
    clearForm(); // Assuming clearForm() function is defined elsewhere
  
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
                var $editDepartmentLocation = $("#editDepartmentLocation");
                $editDepartmentLocation.empty(); // Clear previous options
  
                // Sort locations alphabetically by name
                locationResult.data.sort(function(a, b) {
                  return a.name.localeCompare(b.name);
                });
  
                $.each(locationResult.data, function (index, location) {
                  // Append option with location name
                  var $option = $("<option>", {
                    value: location.id,
                    text: location.name
                  });
  
                  if (location.id == currentLocationID) {
                    $option.prop("selected", true); // Select the current location
                  }
  
                  $editDepartmentLocation.append($option);
                });
              }
            },
            error: function (jqXHR, textStatus, errorThrown) {
              console.error("Error retrieving location data:", errorThrown);
            }
          });
        } else {
          $("#editPersonnelModal .modal-title").text("Error retrieving data");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        $("#editPersonnelModal .modal-title").text("Error retrieving data");
      }
    });
  });
  


  $("#editDepartmentForm").on("submit", function (event) {
    event.preventDefault();

    var newDepName = capitalizeFirstLetter($("#editDepartmentName").val().trim()); // Retrieve the new department name
    var newLocationID = $("#editDepartmentLocation").val(); // Retrieve the new location ID
    var originalDepName = capitalizeFirstLetter($("#originalDepartmentName").val().trim()); // Retrieve the original department name
    var originalDepLocationID = $("#originalDepartmentLocation").val(); // Retrieve the original department location ID

    // Variables to store original and new department location names
    var originalDepLocationName, newDepLocationName;

    // Check if the department name has changed
    if (newDepName !== originalDepName) {
      // AJAX request to check for duplicate department name
      $.ajax({
        url: '/project2/libs/php/checkDuplicateDepartmentName.php',
        type: 'GET',
        dataType: 'json',
        data: {
          departmentName: newDepName
        },
        success: function (response) {
          if (response.status.code == 200 && response.data.length > 0) {
            // Duplicate found
            $('#depDuplicateMessage').html('Department "' + newDepName + '" already exists.');
            $('#depDuplicateMessage').show();

          } else {
            // No duplicate found, proceed with update
            updateDepartment(newDepName, newLocationID, originalDepName, originalDepLocationID);
            $('.editDepartmentBtns').hide();
            $('.editD').hide();
            $('#depDuplicateMessage').hide();
            $('#dEditOkButton').show();
          }
        },
        error: function (xhr, status, error) {
          console.error('AJAX Error: ' + error);
        }
      });
    } else {
      // No name change, proceed with update
      updateDepartment(newDepName, newLocationID, originalDepName, originalDepLocationID);
      clearSearchBar();
      $('.editDepartmentBtns').hide();
    }
  });

  function updateDepartment(newDepName, newLocationID, originalDepName, originalDepLocationID) {
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
          var originalDepLocationName = response.data[0].name; // Assuming response structure has 'data' as an object

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
                var newDepLocationName = response.data[0].name;

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
                    console.log(response);
                    if (response.status.code == '200') {
                      $('#depSuccessMessage').html('Department "' + originalDepName + ' in ' + originalDepLocationName + '" has been successfully changed to "' + newDepName + ' in ' + newDepLocationName + '"');
                      $('#depSuccessMessage').show();
                      $('#editDepartmentForm')[0].reset();

                      populatePersonnelData();

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
  }




  //edit location
  $("#editLocationModal").on("show.bs.modal", function (e) {

    setTimeout(function() {
      $('.editLocation').focus();
  }, 350);
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

    var newName = capitalizeFirstLetter($("#editLocation").val().trim()); // Retrieve the new name
    var originalName = capitalizeFirstLetter($("#originalLocationName").val().trim()); // Retrieve the original name

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
          populatePersonnelData();
          populateDepartment();


          // Refresh the content of the "Locations" tab
          refreshTabs();
          clearSearchBar();
          $('.editL').hide();
          $('.editLocationButtons').hide();
          $('#duplicateMessage').hide();
          $('#lEditOkButton').show();
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
  $('#addLocationModal').on('shown.bs.modal', function () {
    console.log('modalopen');

    setTimeout(function() {
        $('.addLocation').focus();
    }, 300);
});
  $('#addLocationForm').on("submit", function (event) {
    // Prevent default form submission
    event.preventDefault();

    // Get the location name from the input field
    var locationName = capitalizeFirstLetter($('#addLocation').val().trim());

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
          clearSearchBar();
          populateLocationData();
          $('.addLocationBtns').hide();
          $('.addL').hide();
          $('#duplicateMessage1').hide();
          $('#lAddOkButton').show();
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

                $.ajax({
                    url: '/project2/libs/php/deletePersonnel.php',
                    type: 'POST',
                    dataType: 'json',
                    data: { id: personnelId },
                    success: function (response) {
                        if (response.status.code === "200") {
                            $('#deletePersonnelSuccess').text('Employee ' + personnelName + ' has been successfully deleted.').show();
                            $('#yesBtn, #noBtn').hide();
                            $('#pDeleteBtn').show();
                            $('.deleteP').hide();
                            refreshTabs();
                            clearSearchBar();
                        } else {
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
      success: function (response) {
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
      error: function (jqXHR, textStatus, errorThrown) {
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
            success: function (response) {
              console.log(response);
              if (response.status.code === "200") {
                $('#deleteDepartmentSuccess').text('Department: ' + departmentName + ' has been successfully deleted.');
                $('#deleteDepartmentSuccess').show();
                $('#depYesBtn').hide();
                $('#depNoBtn').hide();
                refreshTabs();
                clearSearchBar();
                $('#dDeleteBtn').show();
                $('.deleteD').hide();
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
            error: function (jqXHR, textStatus, errorThrown) {
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
      success: function (response) {
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
      error: function (jqXHR, textStatus, errorThrown) {
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
            success: function (response) {
              console.log(response);
              if (response.status.code === "200") {
                $('#deleteLocationSuccess').text('Location: ' + locationName + ' has been successfully deleted.');
                $('#deleteLocationSuccess').show();
                $('#locYesBtn').hide();
                $('#locNoBtn').hide();
                refreshTabs();
                clearSearchBar();
                $('#lDeleteBtn').show();
                $('.deleteL').hide();
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
            error: function (jqXHR, textStatus, errorThrown) {
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
    $('#successAddPersonnel').hide();
    $('#duplicatePersonnel').hide();
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
    $('.editPersonnelBtns').show();
    $('.editDepartmentBtns').show();
    $('.editLocationButtons').show();
    $('.addEmployeeBtns').show();
    $('.addDepartmentBtns').show();
    $('.addLocationBtns').show();
    $('#lAddOkButton').hide();
    $('#dAddOkButton').hide();
    $('#pAddOkButton').hide();
    $('#lEditOkButton').hide();
    $('#dEditOkButton').hide();
    $('#pEditOkButton').hide();
    $('.addP').show();
    $('.addD').show();
    $('.addL').show();
    $('.editP').show();
    $('.editD').show();
    $('.editL').show();
    $('#pDeleteBtn').hide();
    $('#dDeleteBtn').hide();
    $('#lDeleteBtn').hide();
    $('.deleteP').show();
    $('.deleteD').show();
    $('.deleteL').show();
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
          clearSearchBar();
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
          clearSearchBar();
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
          clearSearchBar();
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


