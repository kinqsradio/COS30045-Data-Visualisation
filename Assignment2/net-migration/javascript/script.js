// Line chart dimensions
var w = 1000;
var h = 720;
var padding = 50;
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
    .attr("fill", "red")
    .attr("class", "annotation-line");
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
      .call(xAxis);

    svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(" + padding + ", 0)")
      .call(yAxis);

    addAnnotations(svg, yScale, 0, "ZeroLine");

    // Create lines for each property
    createLine(svg, data, xScale, yScale, "NSW", "blue");
    createLine(svg, data, xScale, yScale, "Vic", "red");
    createLine(svg, data, xScale, yScale, "Qld", "green");
    createLine(svg, data, xScale, yScale, "WA", "purple");
  });
}

window.onload = function() {
  main();
};
