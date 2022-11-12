const width = 1200;
const height = 600;
const margin = { top: 100, bottom: 100, left: 100, right: 100 };
const inner_width = width - margin.left - margin.right;
const innner_height = height - margin.top - margin.bottom;

d3.csv('data.csv').then(data => {
    
    // loops over the data to parse it in usable own format
    data.forEach(d => {
        d.temperature = +d.temperature;
        d.timestamp = new Date(d.timestamp);
    });

    // attaching the container to html page
    const svg = d3.select('#container')
        .append('svg')
        .attr('height', innner_height)
        .attr('width', inner_width)
        .attr('viewBox', [0, 0, width, height]);

    // defining the ranges and padding of x-axis
    const x = d3.scaleLinear()
        .range([0, inner_width])

    //defining the ranges and padding of y-axis
    const y = d3.scaleLinear()
        .range([innner_height, 0]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // appending the x-axis text
    const x_axis_label = "Something"
    svg.append('text')
    .attr('class', 'axis-label')
    .attr('y', height)
    .attr('x', (width - margin.left - margin.right) / 2)
    .text(x_axis_label)
    .attr('fill', 'black');
    
    // appending the y-axis text
    const y_axis_label = "Something"
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0)
        .attr('x', (-height - margin.bottom - margin.top) / 2)
        .attr('class', 'axis-label')
        .text(y_axis_label)
        .attr('fill', 'black');

    // appending the x-axis
    var x_axis = d3.select(".axis")
        .call(d3.axisBottom(x));

    // appending the y-axis
    // var y_axis = d3.select(".axis")
    // .call(d3.axisLeft(y));




});

// breaks the name of the places to visualize without overlapping each other.
function breakTickText(txt) {
    txt.each(function () {
        var txt = d3.select(this),
            splittedTxtArr = txt.text().split(" "),
            lnNum = 0,
            y = txt.attr("y"),
            dy = parseFloat(txt.attr("dy")),
            tspan = txt.text("")
                .append("tspan")
                .attr("x", 0)
                .attr("y", y)
                .attr("dy", dy + "em");

        // loop over the splitted names array and place it in span
        for (var i = 0; i < splittedTxtArr.length; i++) {
            tspan = txt
                .append("tspan")
                .attr("x", 0)
                .attr("y", y)
                .attr("dy", moveTxtDown())
                .text(splittedTxtArr[i]);
        }

        // moves down the each word in the places
        function moveTxtDown() {
            return ++lnNum * parseFloat(1) + dy + "em";
        }
    });
}