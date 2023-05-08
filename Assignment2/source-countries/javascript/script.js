var width = 1000;
var height = 720;

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
              'rgb(26, 102, 45)']);
  }
  

function createSVG(width, height) {
  return d3.select("#chart")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
}

function getProjection(width, height) {
    return d3.geoMercator()
      .translate([width / 2, height / 2])
      .scale(width / (2 * Math.PI));  // scale for world map
  }

function getPath(projection) {
  return d3.geoPath()
    .projection(projection);
}

function createHeatMap(svg, path, color, json, projection, year) {
    var countries = svg.selectAll("path")
      .data(json.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", function(d) {
        var value = d.properties["value" + year];
        if (d.properties.name === 'Australia') {  // Check if the country is Australia
            return 'rgb(255, 255, 0	)';  // Use the specific color for Australia
        }
        return value ? color(value) : "#CCC";
    })
    
      .style("stroke", "black")  // This line adds a black border
      .style("stroke-width", "0.5") // This line controls the width of the border
      .on("mouseover", function(event, d) {
        var tooltip = d3.select("#tooltip");
        tooltip.style("visibility", "visible")
          .html("<b>" + d.properties.name + "</b><br>" +
            year + ": " + d.properties["value" + year])
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
      })
      .on("mouseout", function() {
        var tooltip = d3.select("#tooltip");
        tooltip.style("visibility", "hidden");
      });

    // Append country names
    // svg.selectAll("text")
    //   .data(json.features)
    //   .enter()
    //   .append("text")
    //   .attr("transform", function(d) { 
    //     return "translate(" + path.centroid(d) + ")"; 
    //   })
    //   .attr("dy", ".35em")
    //   .text(function(d) {
    //     return d.properties.name;
    //   });
}

  
  function loadDataAndCreateMap(svg, path, color, projection, year) {
    d3.csv("/data/source-countries/source-countries.csv").then(function(countryData) {
      countryData.forEach(function(d) {
        d[year] = +d[year];
      });
  
      color.domain([
        d3.min(countryData, function(d) { return d[year]; }),
        d3.max(countryData, function(d) { return d[year]; })
      ]);
  
      d3.json("/data/source-countries/custom-geo.json").then(function(json) {
        for (var i = 0; i < countryData.length; i++) {
          var dataCountry = countryData[i]["Country of birth"];
          var dataValue = countryData[i][year];
  
          for (var j = 0; j < json.features.length; j++) {
            var jsonCountry = json.features[j].properties.name;
            if (dataCountry == jsonCountry) {
              json.features[j].properties["value" + year] = dataValue;
              break;
            }
          }
        }
        createHeatMap(svg, path, color, json, projection, year);
      });
    });
  }
  
  

  function createLegend(svg) {
    var color = getColorRange();

    var legendData = [
        { text: "Australia", color: 'yellow' },
        { text: "Low Migration", color: color.range()[0] },
        { text: "Medium Migration", color: color.range()[color.range().length / 2 | 0] },
        { text: "High Migration", color: color.range()[color.range().length - 1] },
    ];
    
    var legend = svg.append("g")
        .attr("transform", "translate(" + (width - 200) + "," + (height - 150) + ")");

    legend.selectAll("rect")
        .data(legendData)
        .enter()
        .append("rect")
        .attr("x", 0)
        .attr("y", function(d, i) { return i * 30; })
        .attr("width", 20)
        .attr("height", 20)
        .style("fill", function(d) { return d.color; });

    legend.selectAll("text")
        .data(legendData)
        .enter()
        .append("text")
        .attr("x", 30)
        .attr("y", function(d, i) { return i * 30 + 15; })
        .text(function(d) { return d.text; });
}


function main() {
    var svg = createSVG(width, height);
    var projection = getProjection(width, height);
    var path = getPath(projection);
    var color = getColorRange();

    // loadDataAndCreateMap(svg, path, color, projection, "2011");
    loadDataAndCreateMap(svg, path, color, projection, "2021");
    createLegend(svg);  // Call the createLegend function here
}

window.onload = function() {
  main();
};


//   function createMap(year) {
//     var svg = createSVG(width, height);
//     var projection = getProjection(width, height);
//     var path = getPath(projection);
//     var color = getColorRange();
  
//     loadDataAndCreateMap(svg, path, color, projection, year);
//   }
  
//   function main() {
//     createMap("2011");
//     createMap("2021");
//   }
  
// window.onload = function() {
//   main();
// };

