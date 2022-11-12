
const titleText = 'Temperature in san fransisco';

const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const margin = { top: 50, right: 40, bottom: 77, left: 180 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;


d3.csv('temperature.csv').then(data => {
    data.forEach(d => {
        d.temperature = +d.temperature;
        d.timestamp = new Date(d.timestamp);
    });

    // taking x value and its label
    const xValue = d => d.timestamp;
    const xAxisLabel = 'Timestamp';

    // taking y value and its label
    const yValue = d => d.temperature;
    const yAxisLabel = 'Temperature';

    const xScale = d3.scaleTime()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([innerHeight, 0])
        .nice();

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const xAxis = d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickPadding(15);

    const yAxis = d3.axisLeft(yScale)
        .tickSize(-innerWidth)
        .tickPadding(10);

    const yAxisG = g.append('g')
        .call(yAxis)
        .selectAll('.domain')
        .remove();

    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', -60)
        .attr('x', -innerHeight / 2)
        .attr('fill', 'black')
        .attr('transform', `rotate(-90)`)
        .attr('text-anchor', 'middle')
        .text(yAxisLabel);

    const xAxisG = g.append('g').call(xAxis)
        .attr('transform', `translate(0,${innerHeight})`);

    xAxisG.select('.domain').remove();

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 80)
        .attr('x', innerWidth / 2)
        .attr('fill', 'black')
        .text(xAxisLabel);

    const lineGenerator = d3.line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)));

    g.append('path')
        .attr('class', 'line-path')
        .attr('d', lineGenerator(data))

    g.append('text')
        .attr('class', 'title')
        .attr('y', -10)
        .text(titleText);
});