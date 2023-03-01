function main(){

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
  

// Call the getData function when the window is loaded
window.onload = function() {
  main();
};
