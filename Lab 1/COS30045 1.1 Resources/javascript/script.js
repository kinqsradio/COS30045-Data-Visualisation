let myChart;
let animals = [];
let pets2019 = [];
let pets2021 = [];

// Function to get data from CSV file
function getData() {
  // Create a new XMLHttpRequest object
  let xhr = new XMLHttpRequest();
  // Set the path to the CSV file
  let url = "pet_ownership.csv";
  // Open the file
  xhr.open("GET", url, true);
  // When the file is loaded, execute the following function
  xhr.onload = function() {
    // Check if the file was loaded successfully
    if (xhr.status === 200) {
      // Get the CSV data
      let csv = xhr.responseText;
      let data = csv.split("\n").map(function(row) {
        return row.split(",");
      });
      // Get the labels
      let labels = data[0]; // Use labels from first row
      
      // Get data for animals and pets2019&2021
      for (let i = 1; i < data.length; i++) {
        animals.push(data[i][0]);
        pets2019.push(parseFloat(data[i][1]));
        pets2021.push(parseFloat(data[i][2]));
      }
      
      let yearButtons = document.querySelectorAll(".year-button");
      let selectedYear;
      
      // Attach click event listener to year buttons
      yearButtons.forEach(function(button) {
        button.addEventListener("click", function() {
          selectedYear = button.value;
          updateChart(selectedYear, animals, pets2019, pets2021); // Call your function with the selected year
        });
      });
      
      // Show the chart with both years selected
      Show();
    }
  };
  // Send the request
  xhr.send();
}

function Show() {
  var T = document.getElementById("Chart");
  if (T.style.display === "none") {
    T.style.display = "block"; // Show the chart
    updateChart("both", animals, pets2019, pets2021); // Update the chart with both years selected
  }
}

function updateChart(selectedYear, animals, pets2019, pets2021) {
  let chartData = {
    labels: animals,
    datasets: []
  };
  
  if (selectedYear === "2019") {
    chartData.datasets.push({
      label: "Pets in 2019",
      data: pets2019,
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      borderWidth: 1
    });
  }
  
  if (selectedYear === "2021") {
    chartData.datasets.push({
      label: "Pets in 2021",
      data: pets2021,
      backgroundColor: "rgba(54, 162, 235, 0.2)",
      borderColor: "rgba(54, 162, 235, 1)",
      borderWidth: 1
    });
  }

  if (selectedYear === "both") {
    chartData.datasets.push({
        label: "Pets in 2019",
        data: pets2019,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,});
    chartData.datasets.push({
        label: "Pets in 2021",
        data: pets2021,
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
    })  
  }
  
  // Destroy the existing chart (This must be done!)
  if (myChart) {
    myChart.destroy();
  }
  
  // Create the new chart
  let canvas = document.getElementById("myChart");
  myChart = new Chart(canvas, {
    type: "bar",
    data: chartData,
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true

            }
          }]
        }
      }
    });
  }
  

// Call the getData function when the window is loaded
window.onload = function() {
    getData();
};