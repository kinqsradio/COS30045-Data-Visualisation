// Line chart dimensions
var w = 1000;
var h = 720;
var padding = 50;
var parseTime = d3.timeParse("%m-%y");

function createLine(svg, data, xScale, yScale, property) {
  const line = d3.line()
    .x(d => xScale(parseTime(d.Date)))
    .y(d => yScale(d[property]));

  svg.append("path")
    .datum(data)
    .attr("class", property)
    .attr("d", line)
    .style("stroke", "blue");
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
    const junes = data
      .filter(d => d.Date.split('-')[0] === "Jun")
      .map(d => d.Date);

    // Scales
    const xScale = d3.scaleBand()
      .domain(junes)
      .range([padding, w - padding])
      .padding(0.1);

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

    data.forEach(function(d) {
      d.Date = parseTime(d.Date);
      d.NSW = +d.NSW;
      d.Vic = +d.Vic;
      d.Qld = +d.Qld;
      d.WA = +d.WA;
      d.zeroline = +d.zeroline;
      console.log(d.NSW);

      createLine(svg, data, xScale, yScale, "NSW");
      createLine(svg, data, xScale, yScale, "Vic");
      createLine(svg, data, xScale, yScale, "Qld");
      createLine(svg, data, xScale, yScale, "WA");
    });
  });
}

window.onload = function() {
  main();
};
