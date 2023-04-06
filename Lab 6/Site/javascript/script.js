let fixedBarWidth = 20;
let fixedPadding = 2;
let easeEffect = d3.easeElasticOut
let dataset = [14, 5, 26, 23 , 9, 15, 21, 8, 7, 16, 30, 28, 26, 15, 12, 10, 16, 19];

//FUN STUFF (Extension)
let sortInterval;
let wavePhase = 0;
let waveIntervalTime = 100;

function startWaveSorting() {
  // Clear any existing interval
  if (sortInterval) {
    clearInterval(sortInterval);
  }

  sortInterval = setInterval(function() {
    dataset.sort(function(a, b) {
      return Math.sin(a + wavePhase) - Math.sin(b + wavePhase);
    });
    updateBarChart(dataset);
    wavePhase += Math.PI / 6;
  }, waveIntervalTime);
}

function stopWaveSorting() {
  // Clear the interval to stop 
  if (sortInterval) {
    clearInterval(sortInterval);
  }
}

//END Fun Stuff (Extension)

// Data Sorting
function dataAscending() {
  dataset.sort(function(a, b) {
    return a - b;
  });
  updateBarChart(dataset);
}

function dataDescendings() {
  dataset.sort(function(a, b) {
    return b - a;
  });
  updateBarChart(dataset);
}
//End Data Sorting

// Add and Remove Data Point
function addDataPoint() {
  let newValue = Math.floor(Math.random() * 30);
  dataset.push(newValue);
  updateBarChart(dataset);
}

function removeDataPoint() {
    dataset.shift();
    updateBarChart(dataset);
}
// End Add and Remove Data Point

function generateRandomData(maxValue) {
  let data = [];
  for (let i = 0; i < maxValue; i++) {
    data.push(Math.floor(Math.random() * maxValue));
  }
  return data;
}

function updateTransition(transitionType) {
  if (transitionType === "trans1") {
    easeEffect = d3.easeLinear;
  } else if (transitionType === "trans2") {
    easeEffect = d3.easeCircleOut;
  }
}

function updateBarChart(dataset) {
  console.log(dataset);

  var w = fixedBarWidth * dataset.length + fixedPadding * (dataset.length - 1);
  var h = 200;

  var xScale = d3.scaleBand()
    .domain(d3.range(dataset.length))
    .rangeRound([0, w])
    .paddingInner(0.05);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(dataset)])
    .range([h, 0]);

  var svg = d3.select("#chart1").select("svg");

  // Update the SVG size
  svg.attr("width", w);

  // Update the rectangles
  var bars = svg.selectAll("rect")
    .data(dataset);

  // Create new bars
  var newBars = bars.enter()
    .append("rect")
    .style("fill", function(d) {
      return "grey";
    })
    .on("mouseover", function(event, d, i) {
      d3.select(this)
        .style("fill", "red");

      var bar = d3.select(this);
      var xPosition = parseFloat(bar.attr("x")) + xScale.bandwidth() / 2;
      var yPosition = parseFloat(bar.attr("y")) + 15;
    
      svg.append("text")
        .attr("id", "tooltip")
        .attr("x", xPosition)
        .attr("y", yPosition)
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "black")
        .attr("text-anchor", "middle")
        .text(d);
    })
    .on("mouseout", function(event, d) {
      d3.select(this)
        .style("fill", function(d) {
          return "grey";
        });
      // Remove the browser tooltip
      d3.select("#tooltip").remove();
    });


  // Update the rectangles
  newBars.merge(bars)
    .transition()
    .ease(easeEffect)
    .duration(1000) // ms default = 0
    .delay(1000) // ms default = 0
    .attr("x", function(d, i) {
      return xScale(i) // update x value
    })
    .attr("y", function(d) {
      return yScale(d) // update y value
    })
    .attr("width", xScale.bandwidth()) // update width value
    .attr("height", function(d) {
      return 0, h - yScale(d); // update height value
    });

  bars.exit().remove();

  // Update the labels
  var labels = svg.selectAll("text")
    .data(dataset);

  labels.enter()
    .append("text")
    .merge(labels)
    .transition()
    .ease(easeEffect)
    .duration(1000)
    .delay(1000)
    .text(function(d) {
      return d;
    })
    .attr("x", function(d, i) {
      return xScale(i) + xScale.bandwidth() / 2;
    })
    .attr("y", function(d) {
      return yScale(d) + 15;
    })
    .attr("font-family", "sans-serif")
    .attr("font-size", "11px")
    .attr("fill", "white")
    .attr("text-anchor", "middle");

  labels.exit().remove();
}

function drawBarChart() {
    var w = fixedBarWidth * dataset.length + fixedPadding * (dataset.length - 1);
    var h = 200; 

    var xScale = d3.scaleBand()
      .domain(d3.range(dataset.length))
      .rangeRound([0, w])
      .paddingInner(0.05);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(dataset)])
      .range([h, 0]);


    var svg = d3.select("#chart1")
                .append("svg")
                .attr("width", w)
                .attr("height", h);

    // Draw a rectangle
    svg.selectAll("rect")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return xScale(i)
      })
      .attr("y", function(d) {
        return yScale(d)
      })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d){
        return h - yScale(d);
      })
      .attr("fill",function(d){
          return "grey";
      })
      // Adding Mouseover + Mouseout
      .on("mouseover", function(event, d, i) {
        d3.select(this)
          .attr("fill", "red");

        var bar = d3.select(this);
        // Add the browser tooltip
        bar.attr("title", "This value is: " + d);

        var xPosition = parseFloat(bar.attr("x")) + xScale.bandwidth() / 2;
        var yPosition = parseFloat(bar.attr("y")) + 15;
      
        svg.append("text")
          .attr("id", "tooltip")
          .attr("x", xPosition)
          .attr("y", yPosition)
          .attr("font-family", "sans-serif")
          .attr("font-size", "11px")
          .attr("fill", "black")
          .attr("text-anchor", "middle")
          .text(d);
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .attr("fill", function(d) {
            return "grey";
          });

        d3.select("#tooltip").remove();
      })
      // Adding browser tool tip
      .append("title")
      .text(function(d) {
        return "This value is: " + d;
      });

    //Label
    svg.selectAll("text")
      .data(dataset)
      .enter()
      .append("text")
      .text(function(d) {
        return d;
      })
      .attr("x", function(d, i) {
        return xScale(i) + xScale.bandwidth() / 2;
      })
      .attr("y", function(d) {
        return yScale(d) + 15;
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", "11px")
      .attr("fill", "white")
      .attr("text-anchor", "middle");
}


function main() {
  drawBarChart();
}
  
// Call the getData function when the window is loaded
window.onload = function() {
  main();
  document.getElementById("updateBtn").addEventListener("click", function() {
    dataset = generateRandomData(30);
    console.log(dataset)
    updateBarChart(dataset)
  });
  document.getElementById("trans1").addEventListener("click", function() {
    updateTransition("trans1");
  });
  
  document.getElementById("trans2").addEventListener("click", function() {
    updateTransition("trans2");
  });
  document.getElementById("add").addEventListener("click", addDataPoint);
  document.getElementById("remove").addEventListener("click", removeDataPoint);
  document.getElementById("ass").addEventListener("click", dataAscending);
  document.getElementById("des").addEventListener("click", dataDescendings);

  document.getElementById("start").addEventListener("click", startWaveSorting);
  document.getElementById("stop").addEventListener("click", stopWaveSorting);
};
