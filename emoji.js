const svg = d3.select('svg');

const height = +(svg.attr('height'));
const width = +(svg.attr('width'));

const eyeXOffset = 100;
const eyeYOffset = -100;

const eyeBrowYOffset = -60;
const eyeBrowXOffset = eyeXOffset + 60;
const eyeBrowWidth = 50;
const eyeBrowHeight = 10;

const faceSize = height / 2;
const eyeRadius = 30;

const g = svg
    .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

const face = g
    .append('circle')
      .attr('r', faceSize)
      .attr('fill', "yellow")
      .attr('stroke', "black");

const mounth = g
    .append('path')
      .attr('d', d3.arc()({
          innerRadius: 120,
          outerRadius: 140,
          startAngle: Math.PI / 2,
          endAngle: Math.PI * 3 / 2
      }));

const eyesG = g
    .append('g')
      .attr('transform', `translate(0, ${eyeYOffset})`);

const leftEye = eyesG
    .append('circle')
      .attr('r', eyeRadius)
      .attr('cx', -eyeXOffset);

const rightEye = eyesG
    .append('circle')
      .attr('r', eyeRadius)
      .attr('cx', eyeXOffset);

const eyesBrowG = eyesG
    .append('g')
      .attr('transform', `translate(${-25}, ${eyeBrowYOffset})`);

const leftEybrow = eyesBrowG
    .append('rect')
      .attr('x', -eyeXOffset)
      . attr('width', eyeBrowWidth)
      .attr('height', eyeBrowHeight)
    .transition()
      .duration(1000)
      .attr('y', -40)
    .transition()
      .duration(1000)
      .attr('y', 0)


const rightEybrow = eyesBrowG
    .append('rect')
      .attr('x', eyeXOffset)
      .attr('width', eyeBrowWidth)
      .attr('height', eyeBrowHeight);



