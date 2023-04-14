var width = 500;
var height = 500;

function getColorRange() {
  return d3.scaleQuantize()
    .range(['rgb(220, 237, 200)', 
            'rgb(176, 212, 141)', 
            'rgb(126, 188, 97)', 
            'rgb(90, 174, 80)', 
            'rgb(64, 157, 66)', 
            'rgb(35, 139, 69)', 
            'rgb(35, 132, 67)', 
            'rgb(29, 115, 56)', 
            'rgb(26, 102, 45)', 
            'rgb(22, 85, 35)']);
}

function createSVG(width, height) {
  return d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
}

function getProjection(width, height) {
  return d3.geoMercator()
    .center([145, -36.5])
    .translate([width / 2, height / 2])
    .scale(3000);
}

function getPath(projection) {
  return d3.geoPath()
    .projection(projection);
}

function createHeatMap(svg, path, color, json) {
  svg.selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    // Add color enconding for unemployment data
    .style("fill", function(d) {
      var value = d.properties.unemployed;
      return value ? color(value) : "#FF0000";
    })
    .on("mouseover", function(event, d) {
      // Set up tooltip
      var tooltip = d3.select("#tooltip");
      tooltip.style("visibility", "visible")
        .html("<b>" + d.properties.LGA_name + "</b><br>" +
          "Unemployment rate: " + d.properties.unemployed)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", function() {
      // Hide tooltip
      var tooltip = d3.select("#tooltip");
      tooltip.style("visibility", "hidden");
    });
}


function loadDataAndCreateMap(svg, path, color) {
  d3.csv("sources/VIC_LGA_unemployment.csv").then(function(data) {
    color.domain([
      d3.min(data, function(d) { return d.unemployed; }),
      d3.max(data, function(d) { return d.unemployed; })
    ]);

    d3.json("sources/LGA_VIC.json").then(function(json) {
      for (var i = 0; i < data.length; i++) {
        var dataCity = data[i].lga;
        var dataUnemployed = parseFloat(data[i].unemployed);

        for (var j = 0; j < json.features.length; j++) {
          var jsonCity = json.features[j].properties.LGA_name || "";
          if (dataCity == jsonCity) {
            json.features[j].properties.unemployed = dataUnemployed;
            break;
          }
        }
      }

      createHeatMap(svg, path, color, json);
    });
  });
}

function createMap() {

  var svg = createSVG(width, height);
  var projection = getProjection(width, height);
  var path = getPath(projection);
  var color = getColorRange();

  loadDataAndCreateMap(svg, path, color);
}

function main() {
  createMap();
}

window.onload = function() {
  main();
};
