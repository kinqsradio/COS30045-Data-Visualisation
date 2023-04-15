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

function createHeatMap(svg, path, color, json, cityData, projection) {
  svg.selectAll("path")
    .data(json.features)
    .enter()
    .append("path")
    .attr("d", path)
    // Add color enconding for unemployment data
    .style("fill", function(d) {
      var value = d.properties.unemployed;
      return value ? color(value) : "grey";
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

  // Add city points
  svg.selectAll(".city-point")
    .data(cityData)
    .enter()
    .append("circle")
    .attr("class", "city-point")
    .attr("cx", function(d) {
      return projection([d.lon, d.lat])[0];
    })
    .attr("cy", function(d) {
      return projection([d.lon, d.lat])[1];
    })
    .attr("r", 4)
    .style("fill", "red");

  svg.selectAll(".city-label")
    .data(cityData)
    .enter()
    .append("text")
    .attr("class", "city-label")
    .attr("x", function(d) {
      return projection([d.lon, d.lat])[0] + 6;
    })
    .attr("y", function(d) {
      return projection([d.lon, d.lat])[1];
    })
    .text(function(d) {
      return d.city_name;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "10px");
}

function loadDataAndCreateMap(svg, path, color, projection) {
  // Load city coordinates
  d3.csv("sources/VIC_city.csv").then(function(cityData) {

    // Convert latitude and longitude to numbers
    cityData.forEach(function(d) {
      d.city_name = d.place;
      d.latitude = +d.latitude;
      d.longitude = +d.longitude;
    });

    // Load unemployment data
    d3.csv("sources/VIC_LGA_unemployment.csv").then(function(data) {
      color.domain([
        d3.min(data, function(d) { return d.unemployed; }),
        d3.max(data, function(d) { return d.unemployed; })
      ]);

      // Load GeoJSON data
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
        createHeatMap(svg, path, color, json, cityData, projection);
      });
    });
  });
}


function createMap() {

  var svg = createSVG(width, height);
  var projection = getProjection(width, height);
  var path = getPath(projection);
  var color = getColorRange();

  loadDataAndCreateMap(svg, path, color, projection);
}

function main() {
  createMap();
}

window.onload = function() {
  main();
};
