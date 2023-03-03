function text(){

  let dataset = [14, 5, 26, 23, 9];
    d3.select("body")
    .selectAll("p")
    .data(dataset)
    .enter()
    .append("p")
    .text(function(d) {
      if (d > 10) {
        return "Warning Joe watched " + d + " cats videos today";
      }
      else {
        return "Joe watched " + d + " cats videos today";
      }
    })
    .style("color", function(d) {
      if (d > 10) {
        return "red";
      }
    });

    console.log(d3.selectAll("p"));
}

function drawShape(){
  var w = 500;
    var h = 200; 
    //gap between bars
    var barPadding = 1;
    var dataset =[14, 5, 26, 23 , 9, 15, 21, 8, 7, 16, 30, 28, 26, 15, 12, 10, 16, 19];
    var svg = d3.select("body")
                .append("svg")
                .attr("width", w)
                .attr("height", h);
    // Draw a rectangle
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("x", function(d,i){
            return i* (w / dataset.length);
        })
        .attr("y", function(d) {
            return h - d * 4;
        })
        .attr("width", w/dataset.length - barPadding)
        .attr("height", function(d){
            return d * 4;
        })
        .style("fill",function(d){
            return "rgb(1,10, " + d*10 + ")";
        })
    // Lable
        svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function(d) {
            return d;
        })
        .attr("x", function(d, i) {
            // get the text to centre of the bar 
            return i * (w / dataset.length) + 15;
        })
        .attr("y", function(d) {
            //get the text to the top of the bar
            return h - d * 4 + 15;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "11px")
        .attr("fill", "white")
        .attr("text-anchor", "middle");
}

function main(){
  text(); drawShape();
}
  

// Call the getData function when the window is loaded
window.onload = function() {
  main();
};
