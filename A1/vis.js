const svg = d3.select('svg');

const height = +(svg.attr('height'));
const width = +(svg.attr('width'));

const renderBarSideway = data => {

    const margin = { top: 50, right: 40, bottom: 70, left: 350 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xValue = d => d.Visitors;
    const yValue = d => d.Place;

    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, xValue)])
        .range([0, innerWidth]);

    const yScale = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.10);

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('.3s'))
        .tickSize(-innerHeight);

    g.append('g')
        .call(d3.axisLeft(yScale))
        .selectAll('.domain, .tick line')
        .remove();

    const xAxisG = g.append('g')
        .call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`);

    xAxisG.selectAll('.domain')
        .remove();

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('y', 50)
        .attr('x', innerWidth / 2)
        .text('Number of Tourists')
        .attr('fill', 'black');


    g.selectAll('rect').data(data)
        .enter().append('rect')
        .attr('y', d => yScale(yValue(d)))
        .attr('width', d => xScale(xValue(d)))
        .attr('height', yScale.bandwidth());

    g.append('text')
        .attr('y', -10)
        .text('Austria most visited place 2018')
};


d3.csv('data.csv').then(data => {
    data.forEach(d => {
        d.Visitors = +d.Visitors
    });
    renderBarSideway(data);
    console.log(data);
});