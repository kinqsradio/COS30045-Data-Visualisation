function text(){

  let dataset = [14, 5, 26, 23, 9];
    d3.select("body")
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

    console.log(d3.selectAll("p"));
}

function drawBarChart() {
  var w = 500;
    var h = 200; 
    //gap between bars
    var barPadding = 1;
    let dataset =[14, 5, 26, 23 , 9, 15, 21, 8, 7, 16, 30, 28, 26, 15, 12, 10, 16, 19];
    var svg = d3.select("body")
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

  var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 500 - margin.left - margin.right,
    height = 200 - margin.top - margin.bottom;

  var x = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) { return d[0]; })])
    .range([0, width]);

  var y = d3.scaleLinear()
    .domain([0, d3.max(dataset, function(d) { return d[1]; })])
    .range([height, 0]);

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", function(d, i) {
      return x(d[0]);
    })
    .attr("cy", function(d) {
      return y(d[1]);
    })
    .attr("r", 5)
    .attr("fill", "slategrey");

  svg.selectAll("text")
    .data(dataset)
    .enter()
    .append("text")
    .text(function(d) {
      return d[0] + "," + d[1];
    })
    .attr("x", function(d) {
      return x(d[0]);
    })
    .attr("y", function(d) {
      return y(d[1])+20;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "black")
    .attr("text-anchor", "middle");

  //X-Scale
  var xAxis = d3.axisBottom()
    .scale(x);
    
  //Y-Scale
  var yAxis = d3.axisLeft()
    .scale(y);

  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  svg.append("g")
    .call(yAxis);


  //Text X-Axis
  svg.append("text")
    .attr("transform",
      "translate(" + (width / 2) + " ," +
      (height + margin.top + 10) + ")")
    .style("text-anchor", "middle")
    .text("X Axis");

  //Text Y-Axs
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Y Axis");

}


function main() {
  text(); drawBarChart(); drawDataScatterPot();
}
  

// Call the getData function when the window is loaded
window.onload = function() {
  main();
};
