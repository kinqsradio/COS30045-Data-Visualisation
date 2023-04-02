function text(){

  let dataset = [14, 5, 26, 23, 9];
    d3.select("#paragraphtext")
    .selectAll("p")
    .data(dataset)
    .enter()
    .append("p")
    .text(function(d) {
      if (d > 10) {
        return "Warning Joe watched " + d + " cats videos today";
      }
      else {
        return "Joe watched " + d + " cats videos today";
      }
    })
    .style("color", function(d) {
      if (d > 10) {
        return "red";
      }
    });
}

function drawBarChart() {
    var w = 500;
    var h = 200; 
    //gap between bars
    var barPadding = 1;
    let dataset =[14, 5, 26, 23 , 9, 15, 21, 8, 7, 16, 30, 28, 26, 15, 12, 10, 16, 19];
    console.log(dataset);
    var svg = d3.select("#chart1")
                .append("svg")
                .attr("width", w)
                .attr("height", h);
    // Draw a rectangle
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d,i){
            return i* (w / dataset.length);
        })
        .attr("y", function(d) {
            return h - d * 4;
        })
        .attr("width", w/dataset.length - barPadding)
        .attr("height", function(d){
            return d * 4;
        })
        .style("fill",function(d){
            return "rgb(1,10, " + d*10 + ")";
        })
    // Label
        svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function(d) {
            return d;
        })
        .attr("x", function(d, i) {
            // get the text to centre of the bar 
            return i * (w / dataset.length) + 15;
        })
        .attr("y", function(d) {
            //get the text to the top of the bar
            return h - d * 4 + 15;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white")
        .attr("text-anchor", "middle");
}

function drawDataScatterPot() {
  // define the data points
  let dataset = [    [5, 20],
    [480, 90],
    [250, 50],
    [100, 33],
    [330, 95],
    [410, 12],
    [475, 44],
    [25, 67],
    [85, 21],
    [220, 88]
  ];

  // define the size of the chart and the margins
  var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 500 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  // create an SVG element and set its size and position
  var svg = d3.select("#chart2").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  // add circles to represent the data points
  svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function(d) { return d[0]; }) // x-coordinate
    .attr("cy", function(d) { return d[1]; }) // y-coordinate
    .attr("r", 5) // radius
    .attr("fill", "slategrey"); // color

  // add labels to show the coordinates of each data point
  svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) { 
      return d[0] + "," + d[1]; 
    }) 
    // label text
    .attr("x", function(d) { 
      return d[0]; 
    }) 
    .attr("y", function(d) { 
      return d[1] - 10; 
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "black")
    .attr("text-anchor", "middle"); // center the text horizontally
}


//Need to be fixed !!! 
// var wombatSighting = [];

// function getData(){
//   let url = "test.csv";
//   d3.csv(url, function(data){
//      wombatSighting.push(parseFloat(data.wombats));
//   });


// }

//Fixed
var wombatSighting = [];
let animals = [];
var pets2019 = [];
var pets2021 = [];

function getData(url) {
  return new Promise(function(resolve) {
    d3.csv(url, function(data) {
      
      if (url === "test.csv") {
        wombatSighting.push(parseFloat(data.wombats));
        resolve(wombatSighting);
      } else if (url === "pet_ownership.csv") {
        animals.push(data.animal);
        pets2019.push(parseFloat(data.pets2019));
        pets2021.push(parseFloat(data.pets2021));
        resolve([animals, pets2019, pets2021]);
      }
    });
  });
}



function drawWombatsBarChart() {
  getData("test.csv").then(function(wombatSighting) {
    var w = 500;
    var h = 200; 
    //gap between bars
    console.log(wombatSighting);

    var dataset = [];
    dataset = wombatSighting;

    var barPadding = 1;
    var svg = d3.select("#wombat")
                .append("svg")
                .attr("width", w)
                .attr("height", h);
    // Draw a rectangle
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d,i){
            return i* (w / dataset.length);
        })
        .attr("y", function(d) {
            return h - d * 50;
        })
        .attr("width", w/dataset.length - barPadding)
        .attr("height", function(d){
            return d * 50;
        })
        .style("fill",function(d){
            return "rgb(1,50, " + d*50 + ")";
        })
    // Label
    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function(d) {
            return d;
        })
        .attr("x", function(d, i) {
            // get the text to centre of the bar 
            return i * (w / dataset.length) + 15;
        })
        .attr("y", function(d) {
            //get the text to the top of the bar
            return h - d * 50 + 15;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white")
        .attr("text-anchor", "middle");
  });
  
}


function drawPets2019() {
  // Assume the `getData` function returns a Promise that resolves to an array of `animals`
  getData("pet_ownership.csv").then(function(animals) {

    var margin = {top: 20, right: 20, bottom: 40, left: 40};
    var w = 1000 - margin.left - margin.right;
    var h = 450 - margin.top - margin.bottom; 
    //gap between bars
    console.log(animals);

    var dataset = [];
    dataset = animals[1];

    var barPadding = 1;
    var svg = d3.select("#pets19")
                .append("div")
                .append("svg")
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Draw a rectangle
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d,i){
            return i* (w / dataset.length);
        })
        .attr("y", function(d) {
            return h - d * 8;
        })
        .attr("width", w/dataset.length - barPadding)
        .attr("height", function(d){
            return d * 8;
        })
        .style("fill",function(d){
            return "rgb(1,50, " + d*8 + ")";
        });

    // Label
    // Add labels from animals[0] under each bar
    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "label")
        .text(function(d, i) {
            return animals[0][i];
        })
        .attr("x", function(d, i) {
            // get the text to centre of the bar
            return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
        })
        .attr("y", h + margin.bottom - 5)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .attr("text-anchor", "middle");
    // Empty the arrays after the process is complete (Dupplicate has occured before)
    animals = [];
    pets2019 = [];
    pets2021 = [];

  });
}

function drawPets2021() {
  // Assume the `getData` function returns a Promise that resolves to an array of `animals`
  getData("pet_ownership.csv").then(function(animals) {

    var margin = {top: 20, right: 20, bottom: 40, left: 40};
    var w = 1000 - margin.left - margin.right;
    var h = 450 - margin.top - margin.bottom; 
    //gap between bars
    console.log(animals[0]); //name

    var dataset = [];
    dataset = animals[2];

    var barPadding = 1;
    var svg = d3.select("#pets21")
                .append("div")
                .append("svg")
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Draw a rectangle
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d,i){
            return i* (w / dataset.length);
        })
        .attr("y", function(d) {
            return h - d * 8;
        })
        .attr("width", w/dataset.length - barPadding)
        .attr("height", function(d){
            return d * 8;
        })
        .style("fill",function(d){
            return "rgb(1,50, " + d*8 + ")";
        });

    // Label
    // Add labels from animals[0] under each bar
    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .attr("class", "label")
        .text(function(d, i) {
            return animals[0][i];
        })
        .attr("x", function(d, i) {
            // get the text to centre of the bar
            return i * (w / dataset.length) + (w / dataset.length - barPadding) / 2;
        })
        .attr("y", h + margin.bottom - 5)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .attr("text-anchor", "middle");

    // Empty the arrays after the process is complete (Dupplicated has occured before)
    animals = [];
    pets2019 = [];
    pets2021 = [];

  });
}

function main() {
  text(); 
  drawBarChart(); 
  drawDataScatterPot();
  drawWombatsBarChart();
  //getData("pet_ownership.csv");
  //console.log(animals); console.log(pets2019);
  drawPets2019();
  drawPets2021();
}
  

// Call the getData function when the window is loaded
window.onload = function() {
  main();
};
