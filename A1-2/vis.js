const width = 1200;
const height = 600;
const margin = { top: 100, bottom: 100, left: 100, right: 100 };

d3.csv('data.csv').then(data => {

    // loops over the data to make no of visitor as number
    data.forEach(d => {
        d.Visitors = +d.Visitors;
    });

    // picks the visitor from the data
    const visitors = data => data.Visitors;

    // attaching the container to html page
    const svg = d3.select('#container')
        .append('svg')
        .attr('height', height - margin.top - margin.bottom)
        .attr('width', width - margin.left - margin.right)
        .attr('viewBox', [0, 0, width, height]);

    // defining the ranges and padding of x-axis
    const x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    //defining the ranges and padding of y-axis
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, visitors)])
        .range([height - margin.bottom, margin.top]);

    // appending the bars
    svg.append('g')
        .selectAll('rect')
        .data(data)
        .join('rect')
        .attr('x', (d, i) => x(i))
        .attr('y', (d) => y(d.Visitors))
        .attr('height', d => y(0) - y(d.Visitors))
        .attr('width', x.bandwidth())
        .attr('class', 'bar');

    // appending the x-axis bar
    svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .attr("dx", "1em")
        .call(d3.axisBottom(x).tickFormat(i => data[i].Place))
        .selectAll(".tick text")
        .call(breakTickText);

    // appending the y-axis lines
    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).ticks(null, data.format)
            .tickFormat(d3.format('.3s')));

    // appending the x-axis text
    svg.append('text')
        .attr('class', 'axis-label')
        .attr('y', height)
        .attr('x', (width - margin.left - margin.right) / 2)
        .text('Tourist attractions')
        .attr('fill', 'black');

    // appending the y-axis text
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0)
        .attr('x', (-height - margin.bottom - margin.top) / 2)
        .attr('class', 'axis-label')
        .text('Number of visitors')
        .attr('fill', 'black');


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