function drawBar(svg, data, x, y, z, keys, tooltip) {
    svg
      .append("g")
      .selectAll("g")
      .data(d3.stack().keys(keys)(data))
      .enter()
      .append("g")
      .attr("fill", (d) => z(d.key))
      .selectAll("rect")
      .data((d) => d)
      .enter()
      .append("rect")
      .attr("x", (d) => x(d.data["Residency Type"]))
      .attr("y", (d) => y(d[1]))
      .attr("height", (d) => y(d[0]) - y(d[1]))
      .attr("width", x.bandwidth())
      .on("mouseover", (event, d) => {
        const barX = +d3.select(event.target).attr("x");
        const barY = +d3.select(event.target).attr("y");
        const barHeight = +d3.select(event.target).attr("height");
        const barWidth = +d3.select(event.target).attr("width");
  
        tooltip
          .html("Population: " + (d[1] - d[0]))
          .style("visibility", "visible")
          .style("left", barX + barWidth / 2 + "px")
          .style("top", barY + barHeight + "px");
      })
      .on("mousemove", (event, d) => {
        const barX = +d3.select(event.target).attr("x");
        const barY = +d3.select(event.target).attr("y");
        const barHeight = +d3.select(event.target).attr("height");
        const barWidth = +d3.select(event.target).attr("width");
  
        tooltip
          .style("left", barX + barWidth / 2 + "px")
          .style("top", barY + barHeight + "px");
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });
  }



window.onload = function() {
    main();
};






function drawAxes(svg, x, y, height) {
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", "14px") // Adjust the font size as per your preference

        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .selectAll("text")
        .style("font-size", "14px"); // Adjust the font size as per your preference

    svg.append("text")
        .attr("x", -300)
        .attr("y", y(y.ticks().pop()) - 65)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-size", "25px")
        .attr("text-anchor", "start")
        .attr("transform", "rotate(-90)")
        .text("Population(k)");
        
}

function drawLegend(svg, keys, z, width) {
    var legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
            .attr("transform", (d, i) => "translate(0," + i * 35 + ")");

    legend.append("rect")
        .attr("x", width +60)
        .attr("width", 30)
        .attr("height", 30)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width +60)
        .attr("y", 14)
        .attr("dy", "0.32em")
        .style("font-size","14px")
        .text(d => d);
}

function main() {
    var margin = {top: 50, right: 100, bottom: 30, left: 100},
    width = 1100 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

    // set x scale
    var x = d3.scaleBand()
              .rangeRound([0, width])
              .paddingInner(0.05)
              .align(0.1);

    // set y scale
    var y = d3.scaleLinear()
              .rangeRound([height, 0]);

    // set the colors
    var z = d3.scaleOrdinal()
              .range(["#98abc5", "#8a89a6", "#7b6888"]);

    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var tooltip = d3.select("body").append("div").attr("class", "toolTip");


    d3.csv("/data/impact-on-workforce/impact-migration-workforce.csv").then(function(data) {
        var keys = data.columns.slice(1);

        data.forEach(function(d) {
            d.total = d3.sum(keys, k => d[k] = +d[k]);
            return d;
        });

        x.domain(data.map(function(d) { return d["Residency Type"]; }));
        y.domain([0, d3.max(data, d => d.total)]).nice();
        z.domain(keys);

        // Now use the above functions to draw the elements of the chart
        drawBar(svg, data, x, y, z, keys, tooltip);
        drawAxes(svg, x, y, height);
        drawLegend(svg, keys, z, width);
    });
}

window.onload = function() {
    main();
};