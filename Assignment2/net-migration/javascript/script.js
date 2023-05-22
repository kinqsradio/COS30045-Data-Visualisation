// Line chart dimensions
var w = 1050;
var h = 700;
var padding = 100;
var parseTime = d3.timeParse("%b-%y");

function createLine(svg, data, xScale, yScale, property,color) {
  const line = d3.line()
    .x(d => xScale(d.Date))
    .y(d => yScale(d[property]));

  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", color)
    .attr("stroke-width", 1.5)
    .attr("d", line);
}

function addAnnotations(svg, yScale, data, text) {
  svg.append("line")
    .attr("x1", padding)
    .attr("y1", yScale(data))
    .attr("x2", w - padding)
    .attr("y2", yScale(data))
    .attr("class", "annotation-line")
    .attr("stroke", "red")
    .attr("stroke-dasharray", "2");

  svg.append("text")
    .attr("x", padding + 10)
    .attr("y", yScale(data) - 7)
    .text(text)
    .attr("font-size","18px")
    .attr("fill", "red")
    .attr("class", "annotation-line");
}

// Create Data Points on chart

function createDataPoints(svg, data, xScale, yScale, property, color) {
  svg.selectAll()
    .data(data)
    .enter()
    .append("circle")
    .attr("fill", color)
    .attr("stroke", "none")
    .attr("cx", function(d) { return xScale(d.Date); })
    .attr("cy", function(d) { return yScale(d[property]); })
    .attr("r", 5)
    .on("mouseover", function(event, d) {
      // Draw border when hover
      d3.select(this)
        .attr('r', 8);
      // Create tooltip

      svg.append("text")
        .attr("id", "tooltip")
        .attr("x", xScale(d.Date))
        .attr("y", yScale(d[property]) - 10)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", "black")
        .text(d[property]);
    })
    .on("mouseout", function() {
      d3.select(this)
        .attr('r', 5);
      svg.select("#tooltip").remove();
    });
}

// Create Legend
function createLegend(svg, labels, colors) {
  var legend = svg.selectAll(".legend")
    .data(colors)
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) {
      return "translate(0," + (i * 20 + 15) + ")";
    });

  legend.append("rect")
    .attr("x", w - 18)
    .attr("width", 18)
    .attr("height", 18)
    .style("fill", function(d, i) { return colors.slice().reverse()[i];});

  legend.append("text")
    .attr("x", w - 24)
    .attr("y", 9)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text(function(d, i) { return labels.slice().reverse()[i].toUpperCase();});
}

function main() {
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

    console.log("Filtered data:", data);

    // Scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.Date))
      .range([padding, w - padding]);

    const yScale = d3.scaleLinear()
      .domain([-80, 120])
      .range([h - padding, padding]);

    const svg = d3.select("#chart")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - padding) + ")")
    .call(xAxis)
    .selectAll("text")
    .style("font-size", "18px");

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ", 0)")
      .call(yAxis)
      .selectAll("text")
      .style("font-size", "18px");;

    addAnnotations(svg, yScale, 0, "Zero Line");

    // Create lines and points for each property
    createLine(svg, data, xScale, yScale, "NSW", "blue");
    createDataPoints(svg, data, xScale, yScale, "NSW", "blue");

    createLine(svg, data, xScale, yScale, "Vic", "red");
    createDataPoints(svg, data, xScale, yScale, "Vic", "red");

    createLine(svg, data, xScale, yScale, "Qld", "green");
    createDataPoints(svg, data, xScale, yScale, "Qld", "green");

    createLine(svg, data, xScale, yScale, "WA", "purple");
    createDataPoints(svg, data, xScale, yScale, "WA", "purple");

    createLegend(svg, ["NSW", "Vic", "Qld", "WA"], ["blue", "red", "green", "purple"]);

    // Add vertical lines for the Covid period
    const startDate = parseTime("Mar-20");
    const endDate = parseTime("Dec-21");

    svg.append("line")
      .attr("x1", xScale(startDate))
      .attr("y1", padding)
      .attr("x2", xScale(startDate))
      .attr("y2", h - padding)
      .attr("class", "covid-line")
      .attr("stroke", "red")
      .attr("stroke-dasharray", "4");

    svg.append("line")
      .attr("x1", xScale(endDate))
      .attr("y1", padding)
      .attr("x2", xScale(endDate))
      .attr("y2", h - padding)
      .attr("class", "covid-line")
      .attr("stroke", "red")
      .attr("stroke-dasharray", "4");

    svg.append("text")
      .attr("x", xScale(startDate) + 5)
      .attr("y", padding + 20)
      .text("Covid Period")
      .attr("fill", "red")
      .attr("class", "covid-line");
  });
}

window.onload = function() {
  main();
};
