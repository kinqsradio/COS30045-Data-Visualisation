// Line chart dimensions
var w = 1000;
var h = 720;
var padding = 50;
var parseTime = d3.timeParse("%m-%y");

function createScales(data) {
  const junes = data
    .filter(d => d.Date.split('-')[0] === "Jun")
    .map(d => d.Date);

  const xScale = d3.scaleBand()
    .domain(junes)
    .range([padding, w - padding])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.NSW)])
    .range([h - padding, padding]);

  return { xScale, yScale };
}

function createLineChart(data, scales) {
  const { xScale, yScale } = scales;

  const line = d3.line()
    .x(d => xScale(d.Date) + xScale.bandwidth() / 2)
    .y(d => yScale(d.NSW));

  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);

  addAxes(svg, xScale, yScale);
  addAnnotations(svg, xScale, yScale, data);
  createAreaChart(svg, data, xScale, yScale);
}

function addAxes(svg, xScale, yScale) {
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
}

function addAnnotations(svg, xScale, yScale, data) {
  const annotationValue = d3.max(data, d => d.NSW);

  svg.append("line")
    .attr("x1", padding)
    .attr("y1", yScale(annotationValue))
    .attr("x2", w - padding)
    .attr("y2", yScale(annotationValue))
    .attr("class", "annotation-line")
    .attr("stroke", "red")
    .attr("stroke-dasharray", "2");

  svg.append("text")
    .attr("x", padding + 10)
    .attr("y", yScale(annotationValue) - 7)
    .text(`Max value: ${annotationValue}`)
    .attr("fill", "red")
    .attr("class", "annotation-line");
}

function createAreaChart(svg, data, xScale, yScale) {
  const area = d3.area()
    .x(d => xScale(d.Date))
    .y0(h - padding)
    .y1(d => yScale(d.NSW));

  svg.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area);
}

function main() {
  d3.csv("/data/net-migration/net-migrant.csv").then(function(data) {
    data.forEach(function(d) {
    //   d.Date = +d.Date;
      d.NSW = +d.NSW;
      d.Vic = +d.Vic;
      d.Qld = +d.Qld;
      d.WA = +d.WA;
      d.zeroline = +d.zeroline;
    });

    console.log(data);

    var scales = createScales(data);
    console.log(scales);
    createLineChart(data, scales);
  });
}

window.onload = function() {
    main();
  };
  