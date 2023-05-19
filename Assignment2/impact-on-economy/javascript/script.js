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
          .html("Population: " + d.value)
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
      .attr("y", 0)
      .attr("x", 9)
      .attr("dy", ".35em")
      .attr("transform", "rotate(90)")
      .style("text-anchor", "start");
  
    svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"))
      .selectAll("line")
      .attr("stroke-opacity", "0") // Set stroke-opacity to 0 to remove the colors
      .attr("y2", -height);
  }
  
  
  
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
      .attr("transform", (d, i) => "translate(" + i * 100 + ", 0)");
  
    legend
      .append("rect")
      .attr("x", 0)
      .attr("y", -9)
      .attr("width", 10)
      .attr("height", 10)
      .attr("fill", color);
  
    legend
      .append("text")
      .attr("x", 15)
      .attr("y", 0)
      .attr("dy", "0.32em")
      .text(function (d) {
        var label = d;
        if (label.length > 12) {
          label = label.slice(0, 12) + "..."; // Truncate label if it exceeds a certain length
        }
        return label;
      });
  }
  
  function main() {
    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = 1000 - margin.left - margin.right,
      height = 720 - margin.top - margin.bottom;
  
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
  