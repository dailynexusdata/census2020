import * as d3 from 'd3';

const size = {
  height: 200,
  width: 230,
};

const margin = {
  top: 30,
  right: 70,
  bottom: 50,
  left: 70,
};

const colors = {
  iv: '#709BFF',
  sb: '#d3d3d3',
};

const singlePlot = (div, data, color, label, key) => {
  const svg = div
    .append('svg')
    .attr('width', size.width)
    .attr('height', size.height);

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

  svg
    .selectAll('lines')
    .data(data.filter((d) => d.key !== 'other'))
    .join((enter) => {
      enter
        .append('path')
        .attr('d', (d) => line(d.values))
        .attr('stroke', (d) => colors[d.values[0].where])
        // .attr('stroke', color)
        // .attr('stroke-opacity', (d) => (d.values[0].where === 'sb' ? 0.4 : 1))
        .attr('stroke-width', 2);

      const yOffset = (() => {
        switch (key) {
          case 'white':
            return [8, -2];
          case 'black':
            return [-18, 0];
          case 'more2':
            return [5, -12];
          default:
            return [0, 0];
        }
      })();

      enter
        .append('text')
        .text((d) => `${Math.round(d.values[1].val * 100)}%`)
        .attr('x', margin.left - 5)
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '14pt')
        .attr('fill', (d) => colors[d.values[0].where])
        // .attr('fill-opacity', (d) => (d.values[0].where === 'sb' ? 0.3 : 1))
        .attr(
          'y',
          (d) => y(d.values[1].val) + yOffset[+(d.values[1].where === 'sb')],
        );

      enter
        .append('text')
        .text(label)
        .attr('x', '50%')
        .attr('y', margin.top)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        // .attr('fill', (d) => colors[d.values[0].where])
        // .attr('font-weight', 'bold')
        .attr('font-size', '14pt');

      enter
        .append('text')
        .text((d) => `${Math.round(d.values[0].val * 100)}%`)
        .attr('x', size.width - margin.right + 5)
        .attr('alignment-baseline', 'middle')
        .attr('font-size', '14pt')
        .attr('fill', (d) => colors[d.values[0].where])
        // .attr('fill-opacity', (d) => (d.values[0].where === 'sb' ? 0.3 : 1))
        .attr(
          'y',
          (d) => y(d.values[0].val)
            + (key !== 'more2'
              ? yOffset[+(d.values[1].where === 'sb')]
              : -5 * +(d.values[1].where === 'sb')),
        );
    });
};

const makeLegend = (div) => {
  const svg = div
    .append('svg')
    .attr('width', size.width)
    .attr('height', size.height);

  // svg
  //   .append('rect')
  //   .attr('x', 30)
  //   .attr('width', size.width - 60)
  //   .attr('y', 35)
  //   .attr('height', size.height - 80)
  //   .attr('fill', 'none')
  //   .attr('stroke', 'black')
  //   .attr('stroke-dasharray', '1, 3');

  svg
    .append('text')
    .attr('x', '50%')
    .attr('y', '40%')
    .text('Isla Vista & UCSB')
    .attr('text-anchor', 'middle')
    .attr('fill', colors.iv);

  svg
    .append('line')
    .attr('x1', margin.left)
    .attr('x2', size.width - margin.right)
    .attr('y1', '47%')
    .attr('y2', '47%')
    .attr('stroke', colors.iv)
    .attr('stroke-width', 2);

  svg
    .append('text')
    .attr('x', '50%')
    .attr('y', '63%')
    .text('Santa Barbara County')
    .attr('text-anchor', 'middle')
    .attr('fill', colors.sb);
  // .attr('fill-opacity', 0.3);

  svg
    .append('line')
    .attr('x1', margin.left)
    .attr('x2', size.width - margin.right)
    .attr('y1', '68%')
    .attr('y2', '68%')
    .attr('stroke', colors.sb)
    .attr('stroke-width', 2);
  // .attr('stroke-opacity', 0.3);
};

const makePlot = (data) => {
  const container = d3
    .select('#census-linePlot2020')
    .style('max-width', `${size.width * 3}px`);
  container.selectAll('*').remove();

  container
    .append('h1')
    .text('Changes in I.V. and UCSB Demographics 2010-2020')
    .style('font-size', '20pt');
  // container
  //   .append('p')
  //   .text(
  //     '',
  //   );

  const plots = container
    .append('div')
    .style('display', 'flex')
    .style('flex-wrap', 'wrap')
    .style('justify-content', 'center');

  container
    .append('div')
    .html(
      '<p>Source: <a href="https://www.census.gov/programs-surveys/decennial-census/about/rdo/summary-files.2020.html">United States 2010 and 2020 Census Redistricting Data.</a></p>',
    );

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

  Object.keys(raceColors)
    .filter((d) => d !== 'other')
    .forEach((race) => {
      const plot = plots.append('div');

      singlePlot(
        plot,
        data.filter((d) => d.key === race),
        raceColors[race],
        raceLabels[race],
        race,
      );
    });

  makeLegend(plots.append('div'));
};

export default makePlot;
