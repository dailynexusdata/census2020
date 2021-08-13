import * as d3 from 'd3';

const makePlot = (data) => {
  const container = d3.select('#census-linePlot2020');
  container.selectAll('*').remove();

  container.append('h1').text('IV and UCSB Demographics 2020');
  container.append('p').text('Race alone');

  const size = {
    height: 400,
    width: Math.min(600, window.innerWidth - 40),
  };

  const margin = {
    top: 10,
    right: 80,
    bottom: 50,
    left: 80,
  };

  const svg = container
    .append('svg')
    .attr('width', size.width)
    .attr('height', size.height);

  container
    .append('div')
    .html(
      '<p>Source: <a href="https://www.census.gov/programs-surveys/decennial-census/about/rdo/summary-files.2020.html#P1">United States 2020 Census Redistricting</a></p>',
    );

  const y = d3
    .scaleLinear()
    .domain([0, 0.7])
    .range([size.height - margin.bottom, margin.top]);

  const x = d3
    .scalePoint()
    .domain(['2010', '2020'])
    .range([margin.left, size.width - margin.right]);

  svg
    .append('g')
    .style('color', '#adadad')
    .style('font-size', '12pt')
    .attr('transform', `translate(0, ${size.height - margin.bottom})`)
    .call(d3.axisBottom().scale(x));

  const line = d3
    .line()
    .x((d) => x(d.year))
    .y((d) => y(d.val));

  const raceColors = {
    white: '#4e79a7',
    black: '#af7aa1',
    asian: '#59a14f',
    other: '#B0B0B0',
    more2: '#e15759',
    hisp: 'orange',
  };
  const raceLabels = {
    white: 'White',
    black: 'Black',
    asian: 'Asian',
    other: 'Other',
    more2: '≥2 races',
    hisp: 'Hispanic',
  };

  svg
    .selectAll('lines')
    .data(data.filter((d) => d.key !== 'other'))
    .join((enter) => {
      enter
        .append('path')
        .attr('d', (d) => line(d.values))
        .attr('stroke', (d) => raceColors[d.key])
        .attr('stroke-width', 2);

      enter
        .append('text')
        .text((d) => raceLabels[d.key])
        .attr('x', margin.left - 5)
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '14pt')
        .attr('fill', (d) => raceColors[d.key])
        .attr('y', (d) => y(d.values[1].val));

      enter
        .append('text')
        .text((d) => `${Math.round(d.values[0].val * 10000) / 100}%`)
        .attr('x', size.width - margin.right + 5)
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '14pt')
        .attr('fill', (d) => raceColors[d.key])
        .attr('y', (d) => y(d.values[0].val));
    });
};

export default makePlot;
