const titleText = 'Temperature in san fransisco';

const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');

const margin = { top: 50, right: 40, bottom: 77, left: 180 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;


d3.csv('data-canvas.csv').then(data => {
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

    const colorValue = d => d.city;

    // value range for x axis
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();

    // value range for y axis
    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([innerHeight, 0])
        .nice();

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10)

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // grid line for height
    const xAxis = d3.axisBottom(xScale)
        .tickSize(-innerHeight)
        .tickPadding(15);

    // grid line for width
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

    const nested = d3.group(data, d => d.city);

    var domain = [];
    nested.forEach(d => {
        domain.push(d[0].city);
    });
    colorScale.domain(domain);

    g.selectAll('.line-path')
        .data(nested)
        .enter()
        .append('path')
        .attr('class', 'line-path')
        .attr('d', d => lineGenerator(d[1]))
        .attr('stroke', d => colorScale(d[0]));

    svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2)
        .attr('y', 45)
        .text(titleText);
});