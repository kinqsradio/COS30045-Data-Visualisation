// Reusable function to draw the line chart
function drawLineChart(data) {
    // Set the dimensions and margins of the chart
    var margin = { top: 20, right: 30, bottom: 30, left: 100 },
      width = 1100 - margin.left - margin.right,
      height = 650 - margin.top - margin.bottom;
  
    // Parse the age values as integers
    data.forEach(function (d) {
      d.Age = +d.Age;
    });
  
    // Set the ranges
    var x = d3.scaleLinear().range([0, width]);
    var y = d3.scaleLinear().range([height, 0]);
  
    // Create the SVG area
    var svg = d3.select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    // Define the line generator
    var lineGenerator = d3.line()
      .x(function (d) { return x(d.Age); })
      .y(function (d) { return y(d.value); });
  
    // Extract the categories from the data
    var categories = data.columns.slice(1);
  
    // Set the domain for the axes
    x.domain(d3.extent(data, function (d) { return d.Age; }));
    y.domain([
      0,
      d3.max(data, function (d) {
        return d3.max(categories, function (category) {
          return +d[category];
        });
      })
    ]);
  
    // Define color scale
    var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  
    // Iterate over the categories and draw the line chart for each
    categories.forEach(function (category, index) {
      var lineData = data.map(function (d) {
        return { Age: d.Age, value: +d[category] };
      });
  
      // Add the line
      svg.append("path")
        .datum(lineData)
        .attr("class", "line")
        .attr("d", lineGenerator)
        .style("stroke", colorScale(index))
        .style("stroke-width", 2);
  
      // Add data points
      // /*svg.selectAll(".dot")
      //   .data(lineData)
      //   .enter()
      //   .append("circle")
      //   .attr("class", "dot")
      //   .attr("cx", function (d) { return x(d.Age); })
      //   .attr("cy", function (d) { return y(d.value); })
      //   .attr("r", 4)
      //   .style("fill", colorScale(index))
      //   .on("mouseover", function (d) {
      //     // Show tooltip with the age and value
      //     var tooltip = d3.select("#tooltip");
      //     tooltip.html("Age: " + d.Age + "<br/>Value: " + d.value)
      //       .style("visibility", "visible")
      //       .style("top", (d3.event.pageY - 10) + "px")
      //       .style("left", (d3.event.pageX + 10) + "px");
      //   })
      //   .on("mouseout", function () {
      //     // Hide tooltip
      //     d3.select("#tooltip").style("visibility", "hidden");
      //   });*/
    });
  
    // Add the X Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .style("font-size","20px")
      .call(d3.axisBottom(x));
  
    // Add the Y Axis
    svg.append("g")
    .style("font-size", "20px")
    .call(d3.axisLeft(y)
      .tickFormat(function (d) {
        return d  + "k";
      })
    );
  
  
    // Add labels
    svg.append("text")
      .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Age");
  
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left +20 )
      .attr("x", 0 - (height / 2) -20)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size","25px  ")
      .text("Population");


    // Add a legend
    var legend = svg.append("g")
      .attr("class", "legend")
      .attr("transform", "translate(" + (width - 300) + "," + (margin.top + 20) + ")");
  
    legend.selectAll("rect")
      .data(categories)
      .enter()
      .append("rect")
      .attr("width", 20)
      .attr("height", 20)
      .attr("y", function (d, i) { return i * 25; })
      .style("fill", function (d, i) { return colorScale(i); });
  
    legend.selectAll("text")
      .data(categories)
      .enter()
      .append("text")
      .attr("x", 25)
      .attr("y", function (d, i) { return i * 25 + 10; })
      .attr("dy", ".35em")
      .style("font-size","20px")
      .text(function (d) { return d; });
  }
  
  // Reusable function to load the data and draw the chart
  function main() {
    d3.csv("/data/demographic-characteristics/demographic-characteristics.csv").then(function (data) {
      drawLineChart(data);
    });
  }
  
  // Event listener for window.onload
  window.onload = function () {
    main();
  };
  