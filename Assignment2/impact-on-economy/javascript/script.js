function drawBar(svg, data, x, y, height, color, tooltip) {
    svg.selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d["Goods And Services"]))
      .attr("y", (d) => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.value))
      .attr("fill", (d) => color(d["Goods And Services"]))
      .on("mouseover", (event, d) => {
        tooltip.style("display", "block") // Set display property to block
          .html("$ " + d.value +"k")
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mousemove", (event, d) => {
        tooltip
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", (event, d) => {
        tooltip.style("display", "none");
      });
  }
  
  function drawAxes(svg, x, y, height) {
  
    svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("y", 25)
    .attr("x", -37)
    .attr("dy", ".35em")
    .attr("transform", "rotate(-45)") // Rotate the x-axis labels by -45 degrees
    .style("font-size","14px")
    .style("text-anchor", "start")
    .text(function(d) {
      if (d.length > 7) {
        return d.substring(0, 7) + "..."; // Truncate text if it's longer than 10 characters
      } else {
        return d;
      }
    });
    
  
  
    svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null,"s"))
      .selectAll("line")
      .attr("stroke-opacity", "0") // Set stroke-opacity to 0 to remove the colors
      .style("font-size","30px")
      .attr("y2", -height);
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
  
  // function drawAxes(svg, x, y, height) {
  //   svg.append("g")
  //     .attr("class", "axis")
  //     .attr("transform", "translate(0," + height + ")")
  //     .call(d3.axisBottom(x))
  //     .selectAll("text")
  //     .remove(); // Remove the text elements on the x-axis
    
  //   svg.append("g")
  //     .attr("class", "axis")
  //     .call(d3.axisLeft(y).ticks(null, "s"))
  //     .selectAll("line")
  //     .attr("stroke-opacity", "0") // Set stroke-opacity to 0 to remove the colors
  //     .attr("y2", -height);
  // }
  
  
  
  
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
      .attr("transform", (d, i) => "translate(50," + i * 30 + ")"); // Adjust the y-translation value here
  
    legend
      .append("rect")
      .attr("x", 700)
      .attr("y", -9)
      .attr("width", 25)
      .attr("height", 25)
      .attr("fill", color);
  
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
  
  
  function main() {
    var margin = { top: 70, right: 300, bottom: 50, left: 100 },
      width = 1100 - margin.left - margin.right,
      height = 700 - margin.top - margin.bottom;
  
    var x = d3
      .scaleBand()
      .rangeRound([0, width])
      .padding(0.1);
  
    var y = d3.scaleLinear().rangeRound([height, 0]);
  
    var color = d3.scaleOrdinal(d3.schemeCategory10);
  
    var svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    var tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "toolTip")
      .style("position", "absolute")
      .style("z-index", "10"); // Set a higher z-index for the tooltip
  
  
    d3.csv("/data/impact-on-economy/impact-on-economy.csv").then(function (data) {
      data.forEach((d) => {
        d.value = +d["All Households"];
        if (isNaN(d.value)) {
          console.error("NaN found in data: ", d);
        }
      });
  
      x.domain(data.map((d) => d["Goods And Services"]));
      y.domain([0, d3.max(data, (d) => d.value)]).nice();
  
      drawBar(svg, data, x, y, height, color, tooltip);
      drawAxes(svg, x, y, height);
      drawLegend(svg, color, width, data.map((d) => d["Goods And Services"]));
    });
  }
  
  window.onload = function () {
    main();
  };
  