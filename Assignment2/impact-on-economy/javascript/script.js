// Function to draw the bars
function drawBar(svg, data, x, y, height, color, tooltip) {
  svg.selectAll("rect")
    .data(data)
    .enter()
    .append("rect")
    .attr("x", (d) => x(d["Goods And Services"])) // Positioning each bar on the x-axis
    .attr("y", (d) => y(d.value)) // Positioning each bar on the y-axis
    .attr("width", x.bandwidth()) // Width of each bar is determined by the band scale
    .attr("height", (d) => height - y(d.value)) // Height of each bar is determined by the scale and data
    .attr("fill", (d) => color(d["Goods And Services"])) // Color of each bar
    .on("mouseover", (event, d) => { // Tooltip on hover over
      tooltip.style("display", "block")
        .html("$ " + d.value +"k")
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mousemove", (event, d) => { // Tooltip movement with mouse
      tooltip
        .style("left", event.pageX + "px")
        .style("top", event.pageY - 28 + "px");
    })
    .on("mouseout", (event, d) => { // Hide tooltip when mouse out
      tooltip.style("display", "none");
    });
}

// Function to draw the axes
function drawAxes(svg, x, y, height) {
  // x-axis
  svg.append("g")
  .attr("class", "axis")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x)) // Using D3's axisBottom function
  .selectAll("text")
  .attr("y", 25)
  .attr("x", -37)
  .attr("dy", ".35em")
  .attr("transform", "rotate(-45)") // Rotate the labels for readability
  .style("font-size","14px")
  .style("text-anchor", "start")
  .text(function(d) {
    // Shorten text to prevent overlap
    if (d.length > 7) {
      return d.substring(0, 7) + "...";
    } else {
      return d;
    }
  });

  // y-axis
  svg.append("g")
    .attr("class", "axis")
    .call(d3.axisLeft(y).ticks(null,"s")) // Using D3's axisLeft function
    .selectAll("line")
    .attr("stroke-opacity", "0") // Remove the default line color
    .style("font-size","30px")
    .attr("y2", -height);

  // y-axis label
  svg.append("text")
      .attr("x", -350)
      .attr("y", y(y.ticks().pop()) - 50)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .attr("font-size", "25px")
      .attr("text-anchor", "start")
      .attr("transform", "rotate(-90)")
      .text("Cost Expenditure");
}

// Function to draw the legend
function drawLegend(svg, color, width, keys) {
  var legend = svg
    .append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "start")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter()
    .append("g")
    .attr("transform", (d, i) => "translate(50," + i * 30 + ")"); // Position each legend item

  // Add colored squares to the legend
  legend
    .append("rect")
    .attr("x", 700)
    .attr("y", -9)
    .attr("width", 25)
    .attr("height", 25)
    .attr("fill", color);

  // Add the text labels to the legend
  legend
    .append("text")
    .attr("x", 730)
    .attr("y", 0)
    .attr("dy", "0.32em")
    .style("font-size","12px")
    .text(function (d) {
      return d
    });
}

// Main function to set up the SVG and call the other functions
function main() {
  // Define the dimensions and margins
  var margin = { top: 70, right: 300, bottom: 50, left: 100 },
    width = 1100 - margin.left - margin.right,
    height = 700 - margin.top - margin.bottom;

  // Define the scales
  var x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
  var y = d3.scaleLinear().rangeRound([height, 0]);
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  // Set up the SVG
  var svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Set up the tooltip
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "toolTip")
    .style("position", "absolute")
    .style("z-index", "10");

  // Load and process the data
  d3.csv("/data/impact-on-economy/impact-on-economy.csv").then(function (data) {
    data.forEach((d) => {
      d.value = +d["All Households"];
      if (isNaN(d.value)) {
        console.error("NaN found in data: ", d);
      }
    });

    // Set the domains for the scales
    x.domain(data.map((d) => d["Goods And Services"]));
    y.domain([0, d3.max(data, (d) => d.value)]).nice();

    // Draw the chart
    drawBar(svg, data, x, y, height, color, tooltip);
    drawAxes(svg, x, y, height);
    drawLegend(svg, color, width, data.map((d) => d["Goods And Services"]));
  });
}

// Call the main function when the window loads
window.onload = function () {
  main();
};
