const svg = d3.select('svg');

const width = +svg.attr('width');
const height = +svg.attr('height');
const margin = { top: 50, right: 40, bottom: 77, left: 180 };
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const titleText = 'World fertility rate from 1960 to 2020 per country';
const xAxisLabel = 'Years';
const yAxisLabel = 'Fertility Rate (Births per Woman)';

d3.csv('data.csv').then(original_data => {

    // parse the data in useful format
    var data = parse_data_in_suitable_d3_format(original_data);

    // appending the y-axis text
    append_x_y_axis_label();

    // taking x value and its label
    const x_value = d => d.year;

    // taking y value and its label
    const y_value = d => d.value;

    // value range for x axis
    const x_axis_range = d3.scaleLinear()
        .domain(d3.extent(data, x_value))
        .range([0, innerWidth])
        .nice();

    // value range for y axis
    const y_axis_range = d3.scaleLinear()
        .domain(d3.extent(data, y_value))
        .range([innerHeight, 0])
        .nice();

    // grid line for height
    const x_axis_bottom = d3.axisBottom(x_axis_range)
        .tickSize(-innerHeight)
        .tickFormat(d3.format("d"))
        .tickPadding(15);

    // grid line for width
    const y_axis_left = d3.axisLeft(y_axis_range)
        .tickSize(-innerWidth)
        .tickPadding(10);

    // appending the main elements as a group
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // append y_axis to g
    const y_axis_g = g.append('g')
        .call(y_axis_left);

    // append x_axis to g
    const x_axis_g = g.append('g')
        .call(x_axis_bottom)
        .attr('transform', `translate(0,${innerHeight})`);

    // creates the line
    const line_creator = d3.line()
        .x(d => x_axis_range(x_value(d)))
        .y(d => y_axis_range(y_value(d)));

    // group the country name
    const country_names = d3.group(data, d => d.countryName);

    // different color for different country
    var domain_values = [];
    country_names.forEach(d => {
        domain_values.push(d[0].countryName);
    });
    const col_scale = d3.scaleOrdinal(d3.schemeCategory10)
        .domain(domain_values);

    // defining the line
    g.selectAll('.line-path')
        .data(country_names)
        .enter()
        .append('path')
        .attr('class', 'line-path')
        .attr('d', d => line_creator(d[1]))
        .attr('stroke', d => col_scale(d[0]));
});

// parse the given data into suitable d3 format
const parse_data_in_suitable_d3_format = function (original_data) {
    var new_data = [];
    original_data.forEach(d => {
        for (var i = 1960; i < 2021; i++) {
            var countryName = d["Country Name"];
            var year = i;
            var value = d[i];
            var obj = {
                "countryName": countryName,
                "year": year,
                "value": value
            }
            new_data.push(obj);
        }
    });
    return new_data;
}

// appends the x and y axis label
function append_x_y_axis_label() {
    // appending the y-axis label
    svg.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 150)
        .attr('x', -height + 50)
        .attr('class', 'axis-label')
        .text(yAxisLabel)
        .attr('fill', 'black');

    // appending the x-axis label
    svg.append('text')
        .attr('class', 'axis-label')
        .attr('y', height)
        .attr('x', width / 2)
        .text(xAxisLabel)
        .attr('fill', 'black');
}

