$(document).on("load", function () {
  $('#preloader').show();
});

$(document).ready(function () {
  $('#preloader').hide();
  populatePersonnelData();
  populateDepartmentData();
  populateLocationData();


  function populatePersonnelData() {
    $.ajax({
      url: '/project2/libs/php/getAll.php',
      type: 'GET',
      dataType: 'json',
      success: function (response) {

        if (response.status.code === "200") {
          $('#personnelTableBody').empty();
          var frag = document.createDocumentFragment();

          response.data.forEach(function (item, index) {

            var row = document.createElement("tr");


            var personnelName = document.createElement("td");
            personnelName.classList = "align-middle text-nowrap d-none d-md-table-cell";
            personnelName.setAttribute("id", 'personnelName');
            personnelName.setAttribute("data-id", item.id);

            var personnelNameText = document.createTextNode(item.lastName + ", " + item.firstName);
            personnelName.append(personnelNameText);

            row.append(personnelName);

            var personnelDepartment = document.createElement("td");
            personnelDepartment.classList = "align-middle text-nowrap d-none d-md-table-cell";
            personnelDepartment.setAttribute("id", 'personnelDepartment');
            personnelDepartment.setAttribute("data-id", item.id);

            var personnelDepartmentText = document.createTextNode(item.department);
            personnelDepartment.append(personnelDepartmentText);

            row.append(personnelDepartment);

            var personnelLocation = document.createElement("td");
            personnelLocation.classList = "align-middle text-nowrap d-none d-md-table-cell";
            personnelLocation.setAttribute("id", 'personnelLocation');
            personnelLocation.setAttribute("data-id", item.id);

            var personnelLocationText = document.createTextNode(item.location);
            personnelLocation.append(personnelLocationText);

            row.append(personnelLocation);

            var personnelEmail = document.createElement("td");
            personnelEmail.classList = "align-middle text-nowrap d-none d-md-table-cell";
            personnelEmail.setAttribute("id", 'personnelEmail');
            personnelEmail.setAttribute("data-id", item.id);

            var personnelEmailText = document.createTextNode(item.email);
            personnelEmail.append(personnelEmailText);

            row.append(personnelEmail);

            var buttonCell = document.createElement("td");
            buttonCell.classList.add("align-middle", "text-end", "text-nowrap");

            // Create the edit button
            var editButton = document.createElement("button");
            editButton.type = "button";
            editButton.classList.add("btn", "btn-primary", "btn-sm");
            editButton.setAttribute("data-bs-toggle", "modal");
            editButton.setAttribute("data-bs-target", "#editPersonnelModal");
            editButton.setAttribute("data-id", item.id);

            // Create the edit icon
            var editIcon = document.createElement("i");
            editIcon.classList.add("fa-solid", "fa-pencil", "fa-fw");
            editButton.appendChild(editIcon);

            // Create the delete button
            var deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.classList.add("btn", "btn-primary", "btn-sm", "ms-2", "deletePersonnelBtn");
            deleteButton.setAttribute("data-bs-toggle", "modal");
            deleteButton.setAttribute("data-bs-target", "#deletePersonnelModal");
            deleteButton.setAttribute("data-id", item.id);

            // Create the delete icon
            var deleteIcon = document.createElement("i");
            deleteIcon.classList.add("fa-solid", "fa-trash", "fa-fw");
            deleteButton.appendChild(deleteIcon);

            // Append buttons to the button cell
            buttonCell.appendChild(editButton);
            buttonCell.appendChild(deleteButton);

            // Append the button cell to the row
            row.append(buttonCell);

            frag.append(row);
          });

          $('#personnelTableBody').append(frag);


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


  function populateDepartmentData() {
    $.ajax({
      url: '/project2/libs/php/getAllDepartments.php',
      type: 'GET',
      dataType: 'json',
      success: function (response) {

        if (response.status.code === "200") {
          $('#departmentTableBody').empty();
          var frag = document.createDocumentFragment();

          response.data.forEach(function (item, index) {

            var row = document.createElement("tr");
            row.classList = "personnel-row";

            var depName = document.createElement("td");
            depName.classList = "align-middle text-nowrap";
            depName.setAttribute("id", 'departmentName');
            depName.setAttribute("data-id", item.id);

            var depNameText = document.createTextNode(item.name);
            depName.append(depNameText);

            row.append(depName);

            var depLocation = document.createElement("td");
            depLocation.classList = "align-middle text-nowrap";
            depLocation.setAttribute("id", 'depLocation');
            depLocation.setAttribute("data-id", item.id);

            var depLocationText = document.createTextNode(item.locationName);
            depLocation.append(depLocationText);

            row.append(depLocation);

            var buttonCell = document.createElement("td");
            buttonCell.classList.add("align-middle", "text-end", "text-nowrap");

            // Create the edit button
            var editButton = document.createElement("button");
            editButton.type = "button";
            editButton.classList.add("btn", "btn-primary", "btn-sm");
            editButton.setAttribute("data-bs-toggle", "modal");
            editButton.setAttribute("data-bs-target", "#editDepartmentModal");
            editButton.setAttribute("data-id", item.id);

            // Create the edit icon
            var editIcon = document.createElement("i");
            editIcon.classList.add("fa-solid", "fa-pencil", "fa-fw");
            editButton.appendChild(editIcon);

            // Create the delete button
            var deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.classList.add("btn", "btn-primary", "btn-sm", "ms-2", "deleteDepartmentBtn");
            deleteButton.setAttribute("data-bs-toggle", "modal");
            deleteButton.setAttribute("data-bs-target", "#deleteDepartmentModal");
            deleteButton.setAttribute("data-id", item.id);

            // Create the delete icon
            var deleteIcon = document.createElement("i");
            deleteIcon.classList.add("fa-solid", "fa-trash", "fa-fw");
            deleteButton.appendChild(deleteIcon);

            // Append buttons to the button cell
            buttonCell.appendChild(editButton);
            buttonCell.appendChild(deleteButton);

            // Append the button cell to the row
            row.append(buttonCell);

            frag.append(row);
          });

          $('#departmentTableBody').append(frag);

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

          // Clear existing table content
          $('#locationTableBody').empty();
          var frag = document.createDocumentFragment();

          response.data.forEach(function (item, index) {

            var row = document.createElement("tr");

            var location = document.createElement("td");
            location.classList = "align-middle text-nowrap";
            location.setAttribute("id", 'locationName');
            location.setAttribute("data-id", item.id);

            var locationText = document.createTextNode(item.name);
            location.append(locationText);

            row.append(location);
            var buttonCell = document.createElement("td");
            buttonCell.classList.add("align-middle", "text-end", "text-nowrap");

            // Create the edit button
            var editButton = document.createElement("button");
            editButton.type = "button";
            editButton.classList.add("btn", "btn-primary", "btn-sm");
            editButton.setAttribute("data-bs-toggle", "modal");
            editButton.setAttribute("data-bs-target", "#editLocationModal");
            editButton.setAttribute("data-id", item.id);

            // Create the edit icon
            var editIcon = document.createElement("i");
            editIcon.classList.add("fa-solid", "fa-pencil", "fa-fw");
            editButton.appendChild(editIcon);

            // Create the delete button
            var deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.classList.add("btn", "btn-primary", "btn-sm", "ms-2", "deleteLocationBtn");
            deleteButton.setAttribute("data-bs-toggle", "modal");
            deleteButton.setAttribute("data-bs-target", "#deleteLocationModal");
            deleteButton.setAttribute("data-id", item.id);

            // Create the delete icon
            var deleteIcon = document.createElement("i");
            deleteIcon.classList.add("fa-solid", "fa-trash", "fa-fw");
            deleteButton.appendChild(deleteIcon);

            // Append buttons to the button cell
            buttonCell.appendChild(editButton);
            buttonCell.appendChild(deleteButton);

            // Append the button cell to the row
            row.append(buttonCell);

            frag.append(row);
          })
          $('#locationTableBody').append(frag);
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


  $('#filterBoxModal').on('shown.bs.modal', function () {
    $.ajax({
      url: '/project2/libs/php/getAllDepartments.php',
      type: 'GET',
      dataType: 'json',
      success: function (response) {
        if (response.status.code === "200") {
          $.each(response.data, function () {
            $("#departmentSelect").append(
              $("<option>", {
                value: this.id,
                text: this.name
              })
            );
          });

        }
      }
    });
    $.ajax({
      url: '/project2/libs/php/getAllLocations.php',
      type: 'GET',
      dataType: 'json',
      success: function (response) {


        if (response.status.code === "200") {

          $.each(response.data, function () {
            $("#locationSelect").append(
              $("<option>", {
                value: this.id,
                text: this.name
              })
            );
          });

        }
      }
    });
  });


  $("#departmentSelect, #locationSelect").change(function () {
    var selectedValue = $(this).val();
    var otherSelect = $(this).attr('id') === 'departmentSelect' ? '#locationSelect' : '#departmentSelect';

    // Clear the value of the other select element
    $(otherSelect).val("");
    var url = '';
    var data = {};

    if (selectedValue !== "") {
      if ($(this).attr('id') === 'departmentSelect') {
        url = '/project2/libs/php/filterDepartment.php';
        data = { departmentId: selectedValue };
      } else {
        url = '/project2/libs/php/filterLocation.php';
        data = { locationID: selectedValue };
      }

      $.ajax({
        url: url,
        type: 'GET',
        data: data,
        dataType: 'json',
        success: function (response) {
          $('#personnelTableBody').empty();
          var frag = document.createDocumentFragment();

          response.data.forEach(function (item) {
            var row = document.createElement("tr");
            var fields = ['lastName', 'firstName', 'department', 'location', 'email'];

            fields.forEach(function (field) {
              var cell = document.createElement("td");
              cell.classList = "align-middle text-nowrap d-none d-md-table-cell";
              cell.setAttribute("data-id", item.id);
              cell.textContent = item[field];
              row.appendChild(cell);
            });

            var buttonCell = document.createElement("td");
            buttonCell.classList.add("align-middle", "text-end", "text-nowrap");

            var buttons = ['edit', 'delete'];

            buttons.forEach(function (type) {
              var button = document.createElement("button");
              button.type = "button";
              button.classList.add("btn", "btn-primary", "btn-sm");
              button.setAttribute("data-bs-toggle", "modal");
              button.setAttribute("data-bs-target", "#" + type + "PersonnelModal");
              button.setAttribute("data-id", item.id);

              var icon = document.createElement("i");
              icon.classList.add("fa-solid", "fa-" + (type === 'edit' ? 'pencil' : 'trash'), "fa-fw");
              button.appendChild(icon);
              buttonCell.appendChild(button);
            });

            row.appendChild(buttonCell);
            frag.appendChild(row);
          });

          $('#personnelTableBody').append(frag);


        },
        error: function (jqxhr, status, error) {
          console.error(jqxhr);
        }
      });
    } else {
      console.error("Please select a department or a location.");
    }

  });

  $('#clearFilterButton').on('click', function () {
    $('#filterForm')[0].reset();
    $('#personnelTableBody').empty();
    populatePersonnelData();
    $('#filterBtn').show();
    $(this).hide(); // Hide the clearFilterButton
  });


  //search bar
  $("#searchInp").on("keyup", function () {
    var searchText = $(this).val().toLowerCase();
    var tableBodyIds = ["#personnelTableBody", "#departmentTableBody", "#locationTableBody"];

    tableBodyIds.forEach(function (tableBodyId) {
      var anyResults = false;
      $(tableBodyId + " .no-results").remove(); // Remove the no-results message if it exists

      if (searchText.trim() === '') {
        // If search text is empty, show all rows
        $(tableBodyId + " tr").show();
        return;
      }

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
      }
    });
  });

  function clearSearchBar() {
    $("#searchInp").val('').trigger('keyup'); // Trigger keyup to reset table visibility
  }


  function capitalizeFirstLetter(string) {
    return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }



  function handleTabClick() {
    var tabId = $(this).attr('id');
    if (tabId !== 'personnelBtn') {
      $('#filterBtn').prop('disabled', true).addClass('btn-disabled');
    } else {
      $('#filterBtn').prop('disabled', false).removeClass('btn-disabled');
    }

    if ($("#personnelBtn").hasClass("active")) {
      populatePersonnelData();
      clearSearchBar();
      $('#filterForm')[0].reset();
      $('#filterBtn').show();
      $('#filterBtn').prop('disabled', false).removeClass('btn-disabled');
    } else if ($("#departmentsBtn").hasClass("active")) {
      populateDepartmentData();
      clearSearchBar();
      $('#filterForm')[0].reset();
    } else if ($("#locationsBtn").hasClass("active")) {
      clearSearchBar();
      populateLocationData();
      $('#filterForm')[0].reset();
    } else {
      console.log("No active button found.");
    }
  }

  $("#refreshBtn").click(function () {
    handleTabClick();

  });

  $('.nav-link').click(handleTabClick);




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

  // personnel add, edit, delete


  $('#addPersonnelModal').on('shown.bs.modal', function () {
    clearForm();

    $.ajax({
      url: '/project2/libs/php/getAllDepartments.php',
      method: 'GET',
      dataType: 'json',
      success: function (response) {

        if (response.status.code === "200") {
          $.each(response.data, function () {
            $("#addPersonnelDepartment").append(
              $("<option>", {
                value: this.id,
                text: this.name
              })
            );
          })
        }
      }
    })

  });

  $('#addPersonnelForm').on("submit", function (event) {
    event.preventDefault();

    var firstName = capitalizeFirstLetter($('#addPersonnelFirstName').val().trim());
    var lastName = capitalizeFirstLetter($('#addPersonnelLastName').val().trim());
    var email = $('#addPersonnelEmailAddress').val();
    var departmentID = $('#addPersonnelDepartment').val();

    $.ajax({
      url: '/project2/libs/php/addPersonnel.php',
      type: 'POST',
      data: {
        firstName: firstName,
        lastName: lastName,
        email: email,
        departmentID: departmentID,
      },
      dataType: 'json',

      success: function (response) {

        if (response.status.code == '200') {

          populatePersonnelData();
          $('#addPersonnelForm')[0].reset();
          clearSearchBar();
          $('#addPersonnelModal').modal('hide');
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
        console.error('AJAX Error: ', jqXHR, status, error);
      }
    });
  });

  $("#editPersonnelModal").on("show.bs.modal", function (e) {
    clearForm();


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
    var emailAddress = $("#editPersonnelEmailAddress").val(); // Retrieve the email address
    var departmentID = $("#editPersonnelDepartment").val(); // Retrieve the department ID


    // AJAX request to edit the personnel
    $.ajax({
      url: '/project2/libs/php/editPersonnel.php',
      type: 'POST',
      dataType: 'json',
      data: {
        employeeID: employeeID,
        firstName: firstName,
        lastName: lastName,
        email: emailAddress,
        departmentID: departmentID
      },
      success: function (response) {

        if (response.status.code == '200') {
          populatePersonnelData();
          $("#editPersonnelModal").modal('hide');
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
  // department add, edit, delete


  $("#addDepartmentModal").on("show.bs.modal", function (e) {
    clearForm();

    $.ajax({
      url: '/project2/libs/php/getAllLocations.php',
      method: 'GET',
      dataType: 'json',
      success: function (response) {

        if (response.status.code === "200") {
          $.each(response.data, function () {
            $("#addLocationName").append(
              $("<option>", {
                value: this.id,
                text: this.name
              })
            );
          })
        }
      }
    })
  });

  $('#addDepartmentForm').submit(function (event) {
    event.preventDefault();

    var departmentName = capitalizeFirstLetter($('#addDepartmentName').val().trim());
    var selectedLocation = $('#addLocationName').val();

    $.ajax({
      url: '/project2/libs/php/addDepartment.php',
      type: 'POST',
      data: { name: departmentName, locationID: selectedLocation }, // Include locationID here
      dataType: 'json',
      success: function (response) {
        // Check if the operation was successful
        if (response.status.code == '200') {

          $('#addDepartmentForm')[0].reset();

          populateDepartmentData();
          clearSearchBar();
          $('#addDepartmentModal').modal('hide');
          $('#duplicateDepartment').hide();

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
  );

  $("#editDepartmentModal").on("show.bs.modal", function (e) {
    clearForm();

    // Retrieve the new department name
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
          // Set the department name
          $("#editDepartmentName").val(result.data.department[0].name);
          $("#editDepartmentID").val(result.data.department[0].id);
          // Clear existing options in the dropdown
          $("#editDepartmentLocation").empty();

          // Append new options to the dropdown
          $.each(result.data.locations, function () {
            $("#editDepartmentLocation").append(
              $("<option>", {
                value: this.id,
                text: this.name
              })
            );
          });

          // Set the dropdown to the current location
          $("#editDepartmentLocation").val(result.data.department[0].locationID);

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

    var departmentName = $("#editDepartmentName").val(); // Retrieve the new department name
    var location = $("#editDepartmentLocation").val(); // Retrieve the new location ID
    var departmentID = $("#editDepartmentID").val();

    // AJAX request to check for duplicate department name
    $.ajax({
      url: '/project2/libs/php/editDepartment.php',
      type: 'POST',
      data: {
        departmentName: departmentName,
        departmentID: departmentID, // Pass the new location ID
        locationID: location
      },
      dataType: 'json',
      success: function (response) {

        if (response.status.code == '200') {

          $('#editDepartmentForm')[0].reset();
          $('#editDepartmentModal').modal('hide');
          $('#depDuplicateMessage').hide();
          populateDepartmentData();
        } else if (response.status.code == '409') {
          $('#depDuplicateMessage').html('Department "' + departmentName + '" already exists.');
          $('#depDuplicateMessage').show();
        } else {
          console.error('Error: ' + response.status.description);
        }
      },
      error: function (xhr, status, error) {
        console.error('AJAX Error: ' + error);
      }
    });
  }
  )
  // location add, edit, delete

  $('#addLocationModal').on('shown.bs.modal', function () {

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

          $('#addLocationForm')[0].reset();
          populateLocationData();
          clearSearchBar();
          $('#addLocationModal').modal('hide');
          $('#duplicateMessage1').hide();

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


  //edit location
  $("#editLocationModal").on("show.bs.modal", function (e) {
    clearForm();

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

    var name = capitalizeFirstLetter($("#editLocation").val().trim()); // Retrieve the new name
    var id = $("#editLocationID").val();
    $.ajax({
      url: '/project2/libs/php/editLocation.php',
      type: 'POST',
      data: {
        name: name,
        id: id
      },
      dataType: 'json',
      success: function (response) {

        if (response.status.code == '200') {

          $('#editLocationForm')[0].reset();

          clearSearchBar();

          $('#editLocationModal').modal('hide');
          $('#duplicateMessage').hide();
          populateLocationData();
        } else if (response.status.code == '409') {
          $('#duplicateMessage').html('Location "' + name + '" already exists.');
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


  //deletePersonnel

  $('#deletePersonnelModal').on('show.bs.modal', function (e) {
    clearForm();    

    var personnelID = $(e.relatedTarget).data('id');
    $('input[name="id"]').val(personnelID);

    $.ajax({
      url: '/project2/libs/php/getPersonnelByID.php',
      type: 'POST',
      dataType: 'json',
      data: { id: personnelID },
      success: function (result) {

        if (result.status.code === "200") {
          var personnel = result.data.personnel[0];
          var personnelName = personnel.firstName + ' ' + personnel.lastName;

    $('#deleteEmployeeName').text(personnelName);
        }
      }
  });
  })

  $('#deletePersonnelForm').submit(function (event) {
    event.preventDefault();

    var personnelId = $('input[name="id"]').val();
  
    $.ajax({
      url: '/project2/libs/php/deletePersonnel.php',
      type: 'POST',
      dataType: 'json',
      data: { id: personnelId },
      success: function (response) {

        if (response.status.code === "200") {
          $('#deletePersonnelModal').modal('hide');
          populatePersonnelData();  
          clearSearchBar();
        } else {
          console.log("Error: " + response.status.description);
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
    var departmentID = $(e.relatedTarget).data('id'); // Gets the data-id attribute from the triggering element
    $('input[name="id"]').val(departmentID); // Set the hidden input field with the departmentID

    $.ajax({
      url: "/project2/libs/php/checkDepartmentUse.php",
      type: "POST",
      dataType: "json",
      data: { id: departmentID },
      success: function (result) {

        if (result.status.code === "200") {
          var department = result.data[0];

          if (department.personnelCount === 0) {

            $("#areYouSureDeptName").text(department.departmentName);
            $("#deleteDepartmentTextEligible").show();
            $("#deleteDepartmentTextNotEligible").hide();
            $("#deleteDepartmentForm").show();
            $('#depYesBtn').show();
            $('#depNoBtn').text('Cancel');

          } else {

            $("#deleteDepartmentTextNotEligible").show();
            $("#cantDeleteDeptName").text(department.departmentName);
            $("#personnelCount").text(department.personnelCount);
            $("#deleteDepartmentForm").show();
            $("#deleteDepartmentTextEligible").hide();
            $('#depYesBtn').hide();
            $('#depNoBtn').text('OK');

          }
        } else {
          console.log("Error: " + result.status.description);
          $("#exampleModal .modal-title").text("Error retrieving data");
          $("#exampleModal").modal("show");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
      }
    });
  });

  $('#deleteDepartmentForm').submit(function (event) {
    event.preventDefault();

    var departmentId = $('input[name="id"]').val();
    $.ajax({
      url: '/project2/libs/php/deleteDepartment.php',
      type: 'POST',
      dataType: 'json',
      data: { id: departmentId },
      success: function (response) {
        if (response.status.code === "200") {
          $('#deleteDepartmentModal').modal('hide');
          populateDepartmentData();
          clearSearchBar();
        } else {
          console.log("Error: " + response.status.description);
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error:", textStatus, errorThrown);
      }
    });
  });

  //delete location


  $('#deleteLocationModal').on('show.bs.modal', function (e) {
    clearForm();
    var locationID = $(e.relatedTarget).data('id'); // Gets the data-id attribute from the triggering element
    $('input[name="id"]').val(locationID); // Set the hidden input field with the departmentID

    $.ajax({
      url: "/project2/libs/php/checkLocationUse.php",
      type: "POST",
      dataType: "json",
      data: { id: locationID },
      success: function (result) {

        if (result.status.code === "200") {

          var location = result.data[0];
          if (location.departmentCount === 0) {

            $("#locationNameEligible").text(location.locationName);
            $("#deleteLocationTextEligible").show();
            $("#deleteLocationTextNotEligible").hide();
            $("#deleteLocationModal").modal('hide');
            $('#locYesBtn').show();
            $('#locNoBtn').text('Cancel');

          } else {

            $("#deleteLocationTextNotEligible").show();
            $("#locationNameNotEligible").text(location.locationName);
            $("#numDepartments").text(location.departmentCount);
            $("#deleteLocationForm").show();
            $("#deleteLocationTextEligible").hide();
            $('#locYesBtn').hide();
            $('#locNoBtn').text('OK');

          }
        } else {
          console.log("Error: " + result.status.description);
          $("#exampleModal .modal-title").text("Error retrieving data");
          $("#exampleModal").modal("show");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("AJAX error: " + textStatus + ' : ' + errorThrown);
      }
    });
  });


  $('#deleteLocationForm').submit(function (event) {
    event.preventDefault();

    var locationId = $('input[name="id"]').val();

    $.ajax({
      url: '/project2/libs/php/deleteLocation.php',
      type: 'POST',
      dataType: 'json',
      data: { id: locationId },
      success: function (response) {
        if (response.status.code === "200") {
          $('#deleteLocationModal').modal('hide');
          populateLocationData();
          clearSearchBar();
        } else {
          console.log("Error: " + response.status.description);

        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log("Error:", textStatus, errorThrown);
      }
    });
  });


  // Function to clear the form fields
  function clearForm() {
    $('#addLocationForm')[0].reset();
    $('#addDepartmentForm')[0].reset();
    $('#addPersonnelForm')[0].reset();
    $('#duplicateMessage').hide();
    $('#duplicateMessage1').hide();
    $('#duplicatePersonnel').hide();
    $('#duplicateDepartment').hide();
    $('#depDuplicateMessage').hide();
    $('#personnelDuplicateMessage').hide();
    $('#yesBtn').show();
    $('#noBtn').show();
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

});


