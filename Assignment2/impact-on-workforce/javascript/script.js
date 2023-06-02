// Function to draw the bar chart
function drawBar(svg, data, x, y, z, keys, tooltip) {
    // Creates a group that will contain all the bars
    svg.append("g")
        .selectAll("g")
        // Generate a stack layout of the data, where keys are the stack layers
        .data(d3.stack().keys(keys)(data))
        .enter().append("g")
            // Fill each layer with a color from the color scale
            .attr("fill", d => z(d.key))
        .selectAll("rect")
        // For each layer, bind the data to rectangle elements
        .data(d => d)
        .enter().append("rect")
            // Position and size each rectangle based on the data
            .attr("x", d => x(d.data["Residency Type"]))
            .attr("y", d => y(d[1]))
            .attr("height", d => y(d[0]) - y(d[1]))
            .attr("width", x.bandwidth())
        // Add interactivity
        .on("mouseover", function(event, d) {
            // Display a tooltip with the population when the mouse hovers over a bar
            var tooltipText = d3.select("#tooltip-text");
            tooltipText.html("</b><br>Population: " + (d[1]-d[0]));
            tooltip.style("visibility", "visible")
                .style("left", (event.pageX - 410) + "px")
                .style("top", (event.pageY - 150) + "px");
            // Highlight the bar under the mouse
            d3.select(this)
                .style("stroke", "black")
                .style("stroke-width", 2);
        })
        .on("mouseout", function() {
            // Hide the tooltip and remove the bar highlight when the mouse moves away
            tooltip.style("visibility", "hidden");
            d3.select(this)
                .style("stroke", null)
                .style("stroke-width", null);
        });
}

// Function to draw the axes
function drawAxes(svg, x, y, height) {
    // Append the x-axis to the svg
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .style("font-size", "14px")
        .call(d3.axisBottom(x));

    // Append the y-axis to the svg
    svg.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
        .selectAll("text")
        .style("font-size", "14px");

    // Append y-axis label
    svg.append("text")
        .attr("x", -300)
        .attr("y", y(y.ticks().pop()) - 55)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-size", "25px")
        .attr("text-anchor", "start")
        .attr("transform", "rotate(-90)")
        .text("Population(k)");
}

// Function to draw the legend
function drawLegend(svg, keys, z, width) {
    // Append a group for the legend
    var legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        // Bind the legend data (keys) to groups
        .data(keys.slice().reverse())
        .enter().append("g")
            .attr("transform", (d, i) => "translate(0," + i * 35 + ")");

    // For each legend item, append a colored rectangle
    legend.append("rect")
        .attr("x", width +60)
        .attr("width", 30)
        .attr("height", 30)
        .attr("fill", z);

    // And a text label
    legend.append("text")
        .attr("x", width +60)
        .attr("y", 14)
        .attr("dy", "0.32em")
        .style("font-size","14px")
        .text(d => d);
}

// The main function to setup the SVG canvas, scales, axes, and call the other functions to draw the chart
function main() {
    // Set the margins and dimensions of the svg
    var margin = {top: 50, right: 100, bottom: 30, left: 70},
    width = 1100 - margin.left - margin.right,
    height = 650 - margin.top - margin.bottom;

    // Define the x scale, y scale, and color scale
    var x = d3.scaleBand().rangeRound([0, width]).paddingInner(0.05).align(0.1);
    var y = d3.scaleLinear().rangeRound([height, 0]);
    var z = d3.scaleOrdinal().range(["#98abc5", "#8a89a6", "#7b6888"]);

    // Append the svg to the chart div, and add a group within the svg for the chart
    var svg = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create a tooltip for displaying information on hover
    var tooltip = d3.select("#tooltip");

    // Load the data from a CSV file
    d3.csv("/data/impact-on-workforce/impact-migration-workforce.csv").then(function(data) {
        // Get the column names (keys) and calculate the total for each row
        var keys = data.columns.slice(1);
        data.forEach(function(d) {
            d.total = d3.sum(keys, k => d[k] = +d[k]);
            return d;
        });

        // Define the domains for the scales based on the data
        x.domain(data.map(function(d) { return d["Residency Type"]; }));
        y.domain([0, d3.max(data, d => d.total)]).nice();
        z.domain(keys);

        // Draw the elements of the chart
        drawBar(svg, data, x, y, z, keys, tooltip);
        drawAxes(svg, x, y, height);
        drawLegend(svg, keys, z, width);
    });
}

// Call the main function when the window loads
window.onload = function() {
    main();
};
