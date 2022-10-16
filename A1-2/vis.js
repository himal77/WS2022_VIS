const width = 1300;
const height = 600;
const margin = { top: 50, bottom: 50, left: 1, right: 1 };

d3.csv('data.csv').then(data => {

    const svg = d3.select('#d3-container')
        .append('svg')
        .attr('height', height - margin.top - margin.bottom)
        .attr('width', width - margin.left - margin.right)
        .attr('viewBox', [0, 0, width, height]);

    x = d3.scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.3);

    const y = d3.scaleLinear()
        .domain([0, 3978000])
        .range([height - margin.bottom, margin.top]);

    svg.append('g')
        .attr('fill', 'royalblue')
        .selectAll('rect')
        .data(data.sort((a, b) => d3.descending(a.Visitors, b.Visitors)))
        .join('rect')
          .attr('x', (d, i) => x(i))
          .attr('y', (d) => y(d.Visitors))
          .attr('height', d => y(0) - y(d.Visitors))
          .attr('width', x.bandwidth())
          .attr('class', 'rectangle');

    svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(i => data[i].Place))
        .attr('font-size', '20px');

    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).ticks(null, data.format))
        .attr('font-size', '20px');

    svg.node();
});