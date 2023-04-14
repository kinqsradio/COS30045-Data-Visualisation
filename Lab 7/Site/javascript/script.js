// Line chart dimensions
var w = 600;
var h = 300;
var padding = 30;

// Pie chart dimensions
var pieWidth = 300;
var pieHeight = 300;
var pieRadius = Math.min(pieWidth, pieHeight) / 2;

// Stacked chart dimensions
var stackedWidth = 600;
var stackedHeight = 300;
var stackedPadding = 30;

function createScales(data) {
  const xScale = d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([padding, w - padding]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.number)])
    .range([h - padding, padding]);

  return { xScale, yScale };
}

function createLineChart(data, scales) {
  const { xScale, yScale } = scales;

  const line = d3.line()
    .x(d => xScale(d.date))
    .y(d => yScale(d.number));

  const svg = d3.select("#chart")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line);

  addAxes(svg, xScale, yScale);
  createAreaChart(svg, data, xScale, yScale);
  addAnnotations(svg, xScale, yScale);

}

function createPieChart() {
  var data = [5, 6, 10, 20, 25, 45];
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var arc = d3.arc()
    .outerRadius(pieRadius - 10)
    .innerRadius(0);

  var pie = d3.pie()
    .value(d => d);

  var svg = d3.select("#pie-chart")
    .append("svg")
    .attr("width", pieWidth)
    .attr("height", pieHeight)
    .append("g")
    .attr("transform", "translate(" + pieWidth / 2 + "," + pieHeight / 2 + ")");

  var g = svg.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc");

  g.append("path")
    .attr("d", arc)
    .style("fill", (d, i) => color(i));

  g.append("text")
    .attr("transform", d => "translate(" + arc.centroid(d) + ")")
    .attr("dy", ".35em")
    .style("text-anchor", "middle")
    .text(d => d.value);
}

function createStackedBarChart() {
  var dataset = [    
    { apples: 5, oranges: 10, grapes: 22 },    
    { apples: 4, oranges: 12, grapes: 28 },    
    { apples: 2, oranges: 19, grapes: 32 },    
    { apples: 7, oranges: 23, grapes: 35 },    
    { apples: 23, oranges: 17, grapes: 43 }];

  var stack = d3.stack()
    .keys(["apples", "oranges", "grapes"])

  var series = stack(dataset);

  var svg = d3.select("#stacked-chart")
    .append("svg")
    .attr("width", stackedWidth)
    .attr("height", stackedHeight);

  var xScale = d3.scaleBand()
    .domain(d3.range(dataset.length))
    .range([stackedPadding, stackedWidth - stackedPadding])
    .paddingInner(0.05);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    .range([stackedHeight - stackedPadding, stackedPadding]);

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var groups = svg.selectAll("g")
    .data(series)
    .enter()
    .append("g")
    .style("fill", (d, i) => color(i));

  groups.selectAll("rect")
    .data(d => d)
    .enter()
    .append("rect")
    .attr("x", (d, i) => xScale(i))
    .attr("y", d => yScale(d[1]))
    .attr("height", d => yScale(d[0]) - yScale(d[1]))
    .attr("width", xScale.bandwidth());

  var xAxis = d3.axisBottom(xScale);
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (stackedHeight - stackedPadding) + ")")
    .call(xAxis);

  var yAxis = d3.axisLeft(yScale);
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + stackedPadding + ",0)")
    .call(yAxis);

}


function addAxes(svg, xScale, yScale) {
  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (h - 30) + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(30, 0)")
    .call(yAxis);
    
}

function addAnnotations(svg, xScale, yScale) {
  svg.append("line")
    .attr("x1", padding)
    .attr("y1", yScale(500000))
    .attr("x2", w - padding)
    .attr("y2", yScale(500000))
    .attr("class", "annotation-line")
    .attr("stroke", "red")
    .attr("stroke-dasharray", "2");

  svg.append("text")
    .attr("x", padding + 10)
    .attr("y", yScale(500000) - 7)
    .text("Half a million unemployed")
    .attr("fill", "red")
    .attr("class", "annotation-line");
}

function createAreaChart(svg, data, xScale, yScale) {
  const area = d3.area()
    .x(d => xScale(d.date))
    .y0(h - padding)
    .y1(d => yScale(d.number));

  svg.append("path")
    .datum(data)
    .attr("class", "area")
    .attr("d", area);
}

function main() {
  d3.csv("Unemployment_78-95.csv").then(function(data) {
    data.forEach(function(d) {
      d.date = new Date(d.year, d.month - 1);
      d.number = +d.number;
    });

    var scales = createScales(data);
    createLineChart(data, scales);
    createPieChart();
    createStackedBarChart();
  });
}
  
window.onload = function() {
  main();
};
