function map() {
    // Set up svg

    w = 500;
    h = 900;

    const projection =  d3.geoMercator()

    const path = d3.geoPath()
                   .projection(projection);

    var svg = d3.select()
}
function main(){
    map();
}

window.onload = function (){
    main();
}