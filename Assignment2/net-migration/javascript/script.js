// Define the dimensions of the chart
var w = 1050;
var h = 700;
var padding = 100;

// Define the date format
var parseTime = d3.timeParse("%b-%y");

// Function to create a line on the svg using provided data
function createLine(svg, data, xScale, yScale, property, color) {
  // Define the line
  const line = d3.line()
    .x(d => xScale(d.Date)) // x-coordinate based on the Date property
    .y(d => yScale(d[property])); // y-coordinate based on the provided property

  // Append the line to the svg
  svg.append("path")
    .datum(data) // bind data to the line
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", 1.5)
    .attr("d", line); // draw the line
}

// Function to add annotations to the svg
function addAnnotations(svg, yScale, data, text) {
  // Add annotation line
  svg.append("line")
    .attr("x1", padding)
    .attr("y1", yScale(data))
    .attr("x2", w - padding)
    .attr("y2", yScale(data))
    .attr("class", "annotation-line")
    .attr("stroke", "red")
    .attr("stroke-dasharray", "2");

  // Add annotation text
  svg.append("text")
    .attr("x", padding + 10)
    .attr("y", yScale(data) - 7)
    .text(text)
    .attr("font-size","18px")
    .attr("fill", "red")
    .attr("class", "annotation-line");
}

// Function to create data points on the chart
function createDataPoints(svg, data, xScale, yScale, property, color) {
  svg.selectAll()
    .data(data)
    .enter()
    .append("circle") // create a circle for each data point
    .attr("fill", color)
    .attr("stroke", "none")
    .attr("cx", function(d) { return xScale(d.Date); }) // x-coordinate based on the Date property
    .attr("cy", function(d) { return yScale(d[property]); }) // y-coordinate based on the provided property
    .attr("r", 5)
    .on("mouseover", function(event, d) { // handle mouseover event
      // Increase radius of circle on mouseover
      d3.select(this)
        .attr('r', 8);

      // Add tooltip on mouseover
      svg.append("text")
        .attr("id", "tooltip")
        .attr("x", xScale(d.Date))
        .attr("y", yScale(d[property]) - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .text(d[property]);
    })
    .on("mouseout", function() { // handle mouseout event
      // Return circle radius to original size on mouseout
      d3.select(this)
        .attr('r', 5);

      // Remove tooltip on mouseout
      svg.select("#tooltip").remove();
    });
}

// Function to create a legend for the chart
function createLegend(svg, labels, colors) {
  var legend = svg.selectAll(".legend")
    .data(colors)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { // position each legend item
      return "translate(0," + (i * 20 + 15) + ")";
    });

  // Add color square to legend
  legend.append("rect")
    .attr("x", w - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i) { return colors.slice().reverse()[i];});

  // Add text label to legend
  legend.append("text")
    .attr("x", w - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d, i) { return labels.slice().reverse()[i].toUpperCase();});
}

// Main function to draw the chart
function main() {
  // Load and process data
  d3.csv("/data/net-migration/net-migrant.csv").then(function(data) {
    // Filter to only include data from June and parse dates
    data = data.filter(d => d.Date.split('-')[0] === "Jun");
    data.forEach(d => {
      d.Date = parseTime(d.Date);
      d.NSW = +d.NSW;
      d.Vic = +d.Vic;
      d.Qld = +d.Qld;
      d.WA = +d.WA;
      d.zeroline = +d.zeroline;
    });

    // Log the filtered data
    console.log("Filtered data:", data);

    // Define the scales for the chart
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.Date))
      .range([padding, w - padding]);

    const yScale = d3.scaleLinear()
      .domain([-80, 120])
      .range([h - padding, padding]);

    // Append an svg element to the chart div
    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    // Define the x and y axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Append the x-axis to the svg
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + (h - padding) + ")")
      .call(xAxis)
      .selectAll("text")
      .style("font-size", "18px");

    // Append the y-axis to the svg
    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ", 0)")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "18px");

    // Add a zero line annotation to the chart
    addAnnotations(svg, yScale, 0, "Zero Line");

    // Draw lines and points for each state
    ["NSW", "Vic", "Qld", "WA"].forEach((state, i) => {
      const colors = ["blue", "red", "green", "purple"];
      createLine(svg, data, xScale, yScale, state, colors[i]);
      createDataPoints(svg, data, xScale, yScale, state, colors[i]);
    });

    // Add a legend to the chart
    createLegend(svg, ["NSW", "Vic", "Qld", "WA"], ["blue", "red", "green", "purple"]);

    // Mark the Covid period on the chart with vertical lines
    const startDate = parseTime("Mar-20");
    const endDate = parseTime("Dec-21");

    // Start line
    svg.append("line")
      .attr("x1", xScale(startDate))
      .attr("y1", padding)
      .attr("x2", xScale(startDate))
      .attr("y2", h - padding)
      .attr("class", "covid-line")
      .attr("stroke", "red")
      .attr("stroke-dasharray", "4");

    // End line
    svg.append("line")
      .attr("x1", xScale(endDate))
      .attr("y1", padding)
      .attr("x2", xScale(endDate))
      .attr("y2", h - padding)
      .attr("class", "covid-line")
      .attr("stroke", "red")
      .attr("stroke-dasharray", "4");

    // Label for the Covid period
    svg.append("text")
      .attr("x", xScale(startDate) + 5)
      .attr("y", padding + 20)
      .text("Covid Period")
      .attr("fill", "red")
      .attr("class", "covid-line");

    // Y-axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(h / 2))
      .attr("y", padding - 70)
      .attr("dy", "1em")
      .style("font-size","25px")
      .style("text-anchor", "middle")
      .text("Thousand");

    // X-axis label
    svg.append("text")
      .attr("x", w/2)
      .attr("y", h - 40)
      .style("font-size","25px")  
      .text("Year");
        
  });
}

// Call the main function when the window loads
window.onload = function() {
  main();
};
