$(document).ready(function () {
  let representatives = [];
  let customerCount = {};
  let currentlyWorking = [];
  let tempRepresentatives = [];

  // Fetch data from the backend
  function fetchData() {
    console.log("Fetching data from backend..."); // Debugging
    $.get("backend/get_representatives.php", function (data) {
      console.log("Data received:", data); // Debugging
      representatives = data.representatives;
      customerCount = data.customerCount;
      currentlyWorking = data.currentlyWorking;
      tempRepresentatives = [...representatives]; // Create a copy for temporary changes
      renderList();
      renderCustomerCount();
      renderCurrentlyWorking();
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.error("GET request failed:", textStatus, errorThrown); // Debugging
    });
  }

  // Function to render the representatives list
  function renderList() {
    $("#representatives-list").empty();
    tempRepresentatives.forEach((rep, index) => {
      let listItem = $(`
        <li>
          <span>${rep}</span>
          <button class="start-customer" data-index="${index}">Start Customer</button>
        </li>
      `);
      $("#representatives-list").append(listItem);
    });
  }

  // Function to render the customer count
  function renderCustomerCount() {
    $("#customer-count").empty();
    for (let rep in customerCount) {
      $("#customer-count").append(`<li>${rep}: ${customerCount[rep]} customers</li>`);
    }
  }

  // Function to render the currently working list
  function renderCurrentlyWorking() {
    $("#working-list").empty();
    currentlyWorking.forEach((rep) => {
      let workingItem = $(`
        <li>
          <span>${rep}</span>
          <button class="finish-customer" data-rep="${rep}">Finish Customer</button>
        </li>
      `);
      $("#working-list").append(workingItem);
    });
  }

  // Open the pop-up menu
  $("#add-rep-button").click(function () {
    console.log("Add button clicked"); // Debugging
    $("#popup-overlay").css("display", "flex").hide().fadeIn();
  });

  // Add a new representative
  $("#confirm-add").click(function () {
    let repName = $("#rep-name").val().trim();
    console.log("Adding representative:", repName); // Debugging
    if (repName && !representatives.includes(repName)) {
      console.log("Sending POST request with data:", { name: repName }); // Debugging
      $.ajax({
        url: "backend/add_representative.php",
        type: "POST",
        contentType: "application/json", // Set the Content-Type header
        data: JSON.stringify({ name: repName }), // Send data as JSON
        success: function (data) {
          console.log("Response from backend:", data); // Debugging
          if (data.success) {
            fetchData(); // Refresh the data
            $("#rep-name").val("");
            $("#popup-overlay").fadeOut();
          } else {
            alert(data.message || "Failed to add representative.");
          }
        },
        dataType: "json",
      }).fail(function (jqXHR, textStatus, errorThrown) {
        console.error("POST request failed:", textStatus, errorThrown); // Debugging
      });
    } else {
      console.log("Invalid name or representative already exists:", repName); // Debugging
    }
  });

  // Cancel adding a representative
  $("#cancel-add").click(function () {
    console.log("Cancel button clicked"); // Debugging
    $("#rep-name").val("");
    $("#popup-overlay").fadeOut();
  });

  // Start Customer (move to "Currently Working")
  $(document).on("click", ".start-customer", function () {
    let index = $(this).data("index");
    console.log("Index:", index);
    console.log("Representatives before splice:", representatives);
    let rep = representatives.splice(index, 1)[0]; // Remove from turn order
    currentlyWorking.push(rep); // Add to currently working
    console.log("Removed representative:", rep);
    console.log("Representatives after splice:", representatives);
    console.log("Representative moved to Currently Working:", rep); // Debugging

    $(this).closest("li").remove();

    // Add the representative to the "Currently Working" section
    let workingItem = $(`
      <li>
        <span>${rep}</span>
        <button class="finish-customer" data-rep="${rep}">Finish Customer</button>
      </li>
    `);
    $("#working-list").append(workingItem);

    renderList(); // Re-render the turn order

    // Update the backend
    $.ajax({
      url: "backend/update_representative.php", // Ensure this path is correct
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ updatedRepresentatives: representatives, updatedCustomerCount: customerCount, currentlyWorking: currentlyWorking }),
      success: function (data) {
        console.log("Update response:", data); // Debugging
        if (data.success) {
          renderList(); // Re-render the turn order
        } else {
          console.error("Failed to update representatives:", data.message);
          alert("Failed to update representatives: " + data.message);
        }
      },
      dataType: "json",
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.error("POST request failed:", textStatus, errorThrown); // Debugging
      alert("Failed to update representatives: " + textStatus + " - " + errorThrown);
    });
  });

  // Finish Customer (move back to turn order)
  $(document).on("click", ".finish-customer", function () {
    let rep = $(this).data("rep");
    representatives.push(rep); // Add the representative back to the bottom
    customerCount[rep] = (customerCount[rep] || 0) + 1; // Increment their customer count
    currentlyWorking = currentlyWorking.filter(r => r !== rep); // Remove from currently working
    $(this).closest("li").remove(); // Remove from "Currently Working"

    renderList(); // Re-render the turn order

    // Update the backend
    $.ajax({
      url: "backend/update_representative.php", // Ensure this path is correct
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ updatedRepresentatives: representatives, updatedCustomerCount: customerCount, currentlyWorking: currentlyWorking }),
      success: function (data) {
        console.log("Update response:", data); // Debugging
        if (data.success) {
          renderList(); // Re-render the turn order
          renderCustomerCount(); // Re-render the customer count
          renderCurrentlyWorking(); // Re-render the currently working list
        } else {
    //      alert("Failed to update representatives.");
        }
      },
      dataType: "json",
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.error("PUT request failed:", textStatus, errorThrown); // Debugging
    });
  });

  // Open the settings pop-up menu
  $(".settings-button").click(function () {
    $("#settings-popup-overlay").css("display", "flex").hide().fadeIn();
    $("#edit-turn-order-menu").hide(); // Ensure the edit turn order menu is closed
    $("#edit-turn-order").text("Edit Turn Order"); // Reset the button text
  });

  // Confirm settings (update the turn order)
  $("#confirm-settings").click(function () {
    representatives = [...tempRepresentatives]; // Apply the temporary changes
    updateBackend();
    $("#settings-popup-overlay").fadeOut();
    location.reload(); // Force a page refresh
  });

  // Cancel settings
  $("#cancel-settings").click(function () {
    tempRepresentatives = [...representatives]; // Revert temporary changes
    renderList();
    $("#settings-popup-overlay").fadeOut();
  });

  // End Day (clear representatives)
  $("#end-day").click(function () {
    $.ajax({
      url: "backend/clear_representatives.php", // Ensure this path is correct
      type: "POST",
      contentType: "application/json",
      success: function (data) {
        console.log("Clear response:", data); // Debugging
        if (data.success) {
          representatives = [];
          customerCount = {};
          currentlyWorking = [];
          renderList(); // Re-render the turn order
          renderCustomerCount(); // Re-render the customer count
          renderCurrentlyWorking(); // Re-render the currently working list
          $("#settings-popup-overlay").fadeOut();
        } else {
          alert("Failed to clear representatives.");
        }
      },
      dataType: "json",
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.error("POST request failed:", textStatus, errorThrown); // Debugging
    });
  });

  // Open the edit turn order menu
  $("#edit-turn-order").click(function () {
    $("#edit-turn-order-menu").slideToggle();
    renderEditList();
  });

  // Function to render the edit representatives list
  function renderEditList() {
    $("#edit-representatives-list").empty();
    tempRepresentatives.forEach((rep) => {
      let listItem = $(`
        <li>
          <input type="checkbox" data-rep="${rep}">
          <span>${rep}</span>
        </li>
      `);
      $("#edit-representatives-list").append(listItem);
    });

    // Enable drag-and-drop
    $("#edit-representatives-list").sortable({
      update: function () {
        // Update the temporary representatives array based on the new order
        tempRepresentatives = [];
        $("#edit-representatives-list li").each(function () {
          let rep = $(this).find("span").text();
          tempRepresentatives.push(rep);
        });
      }
    });
  }

  // Remove selected representatives
  $("#remove-reps").click(function () {
    let repsToRemove = [];
    $("#edit-representatives-list input[type='checkbox']:checked").each(function () {
      let rep = $(this).data("rep");
      repsToRemove.push(rep);
    });

    tempRepresentatives = tempRepresentatives.filter(rep => !repsToRemove.includes(rep));
    renderEditList();
    renderList();
  });

  // Minimize the turn order list
  $("#minimize-turn-order").click(function () {
    $("#edit-turn-order-menu").slideToggle();
    $("#edit-turn-order").text("Edit Turn Order");
  });

  // Function to update the backend
  function updateBackend() {
    $.ajax({
      url: "backend/update_representative.php",
      type: "POST",
      contentType: "application/json",
      data: JSON.stringify({ updatedRepresentatives: representatives, updatedCustomerCount: customerCount, currentlyWorking: currentlyWorking }),
      success: function (data) {
        console.log("Update response:", data);
        if (!data.success) {
          alert("Failed to update representatives: " + data.message);
        }
      },
      dataType: "json",
    }).fail(function (jqXHR, textStatus, errorThrown) {
      console.error("POST request failed:", textStatus, errorThrown);
      alert("Failed to update representatives: " + textStatus + " - " + errorThrown);
    });
  }

  // Reload the page every 60 seconds
  setInterval(function () {
    window.location.reload();
  }, (60000*2)); // 2 minutes

  // Initial fetch
  fetchData();
});