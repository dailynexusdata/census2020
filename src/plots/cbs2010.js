import * as d3 from 'd3';

const makePlot = (mapData, data) => {
  const container = d3.select('#census-cbs2010');
  container.selectAll('*').remove();

  container.append('h1').text('IV and UCSB Demographics 2010');
  container.append('p').text('Race alone');
  const size = {
    height: Math.min(350, window.innerWidth - 40 * 2),
    width: Math.min(600, window.innerWidth - 40),
  };

  const barsSize = {
    width: Math.min(535, window.innerWidth - 40),
    height: 120,
  };

  const selector = container
    .append('div')
    .style('display', 'flex')
    .style('flex-wrap', 'wrap')
    .style('justify-content', 'center');

  const legend = container
    .append('div')
    .style('margin-top', '5px')
    .style('display', 'flex')
    .style('justify-content', 'center')
    .style('flex-wrap', 'wrap')
    .style('width', `${size.width}px`);

  const scaleContainer = container
    .append('div')
    .style('margin-top', '5px')
    .style('display', 'flex')
    .style('justify-content', 'center');

  const hoverArea = container.append('div').style('position', 'relative');
  const svg = hoverArea.append('svg');

  container
    .append('div')
    .html(
      '<p>Source: <a href="https://www2.census.gov/census_2010/01-Redistricting_File--PL_94-171/">United States 2010 Census Redistricting</a></p>',
    );

  const proj = d3
    .geoMercator()
    .fitSize([size.width - 10, size.height], mapData);

  const projection = d3
    .geoMercator()
    .scale(proj.scale())
    .translate([proj.translate()[0] + 5, proj.translate()[1]]);

  // .scale(700000)
  // .rotate([119.8626, -34.41768])
  // .translate([257, 200]);

  //   const projection = d3
  //     .geoAlbersUsa()
  //     .fitSize([size.width / 2, size.height / 2], mapData)
  //     .scale(100);

  const path = d3.geoPath().projection(projection);

  svg.attr('height', size.height + barsSize.height).attr('width', size.width);
  // .style('border', '1px solid black');

  //   svg
  //     .append('g')
  //     .attr('fill', 'white')
  //     .attr('stroke', 'black')
  //     .datum(mapData)
  //     .append('path')
  //     .attr('d', path);
  //   return;

  const colors = {
    sb: '#76b7b2',
    iv: '#4e79a7',
    goleta: '#f28e2c66',
  };

  const cityLabs = {
    sb: 'UCSB',
    iv: 'Isla Vista',
    goleta: 'Goleta',
  };
  const cbs = svg
    .append('svg')
    .selectAll('path')
    .data(mapData.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', (d) => colors[d.properties.city])
    .attr('stroke', 'black');

  const tooltip = hoverArea
    .append('div')
    .style('display', 'none')
    .style('pointer-events', 'none')
    .style('position', 'absolute')
    .style('background-color', 'white')
    .style('padding', '10px')
    .style('border-radius', '10px')
    .style('border', '1px solid #d3d3d3');
  // .style('left', '20px')
  // .style('top', '50px');

  cbs
    .filter((d) => d.properties.city !== 'goleta')
    .on('mousemove', function (event, d) {
      d3.select(this).attr('stroke-width', 3);

      const [mouseX, mouseY] = d3.pointer(event);

      const cityName = cityLabs[d.properties.city];

      const width = 140;
      const k = `06083${d.properties.TRACTCE10}${d.properties.BLOCKCE10}`;
      const pt = data.find((d) => d.fips === k);

      const makeToolTipLabel = (lab, val) => {
        if (val === 'NA') {
          return '';
        }
        const title =
          lab === 'pop' ? 'Population' : lab[0].toUpperCase() + lab.slice(1);
        return `<p style="font-size:10pt">${title}: ${
          lab === 'pop' ? val : `${Math.round(val * 100) / 100}%`
        }</p>`;
      };

      tooltip.style('display', 'block');
      tooltip
        .style('width', `${width}px`)
        .style('left', `${Math.min(mouseX, size.width - width)}px`)
        .style('top', `${mouseY}px`)
        .html(
          `<h3>Part of ${cityName}</h3><hr style="margin: 3px 0;"/>${Object.entries(
            pt,
          )
            .slice(2)
            .map(([lab, val]) => makeToolTipLabel(lab, val))
            .join('')}`,
        );
    });

  cbs.on('mouseleave', function () {
    d3.select(this).attr('stroke-width', 1);
    tooltip.style('display', 'none');
  });

  Object.entries(cityLabs).forEach(([abbr, label]) => {
    const entry = legend
      .append('div')
      .style('display', 'flex')
      .style('margin', '5px 10px');

    entry
      .append('div')
      .style('background-color', colors[abbr])
      .style('height', '20px')
      .style('width', '20px');
    entry.append('p').text(label).style('margin-left', '5px');
  });

  const mapOptions = ['Cities', 'White', 'Black', 'Asian', 'Other'];

  const getDomain = (d) => {
    switch (d.toLowerCase()) {
      case 'white':
        return [0, 1];
      case 'asian':
        return [0, 0.4];
      case 'black':
        return [0, 0.2];
      case 'other':
        return [0, 0.5];
      default:
        return [0, 1];
    }
  };
  const getColorScale = (d) => {
    switch (d.toLowerCase()) {
      case 'white':
        return d3.interpolateBlues;
      case 'asian':
        return d3.interpolateGreens;
      case 'black':
        return d3.interpolatePurples;
      case 'other':
        return d3.interpolateGreys;
      default:
        return [0, 1];
    }
  };

  const selectMapOption = (event, d) => {
    selector.selectAll('*').style('background-color', 'white');
    d3.select(event).style('background-color', '#d3d3d344');
    legend.style('display', d === 'Cities' ? 'flex' : 'none');
    svg.selectAll('.raceBarLabels').attr('fill-opacity', 0);
    scaleContainer.selectAll('*').remove();

    svg
      .selectAll(`#census2020-raceLabel-${d.toLowerCase()}`)
      .attr('fill-opacity', 1);

    if (d === 'Cities') {
      cbs
        .transition()
        .duration(1000)
        .attr('fill', (d1) => colors[d1.properties.city]);

      svg.selectAll('#census2020-raceLabel-more2').attr('fill-opacity', 1);
    } else {
      const dom = getDomain(d);
      const colScale = d3.scaleSequential(getColorScale(d)).domain(dom);

      const scale = scaleContainer
        .append('svg')
        .attr('width', size.width)
        .attr('height', 40);

      const axisX = d3
        .scaleLinear()
        .domain(dom)
        .range([45, size.width - 45]);
      const step = (dom[1] - dom[0]) / 20;
      const barDom = d3
        .range(dom[0], dom[1] + step, step)
        .reduce(
          (acc, curr) => {
            const lastVal = acc[acc.length - 1].x1;
            return [...acc, { x0: lastVal, x1: curr }];
          },
          [{ x0: 0, x1: 0 }],
        )
        .slice(1);

      scale
        .append('text')
        .text('% of census block population')
        .attr('x', 15)
        .attr('y', '12');

      scale
        .append('text')
        .text(`${dom[0] * 100}%`)
        .attr('x', axisX(dom[0]) - 5)
        .attr('y', 35)
        .attr('alignment-basline', 'middle')
        .attr('text-anchor', 'end');

      scale
        .append('text')
        .text(`${dom[1] * 100}%`)
        .attr('x', axisX(dom[1]) + 5)
        .attr('y', 35)
        .attr('alignment-basline', 'middle');

      scale
        .selectAll('bars')
        .data(barDom)
        .enter()
        .append('rect')
        .attr('x', (d1) => axisX(d1.x0))
        .attr('width', (d1) => axisX(d1.x1) - axisX(d1.x0))
        .attr('y', 20)
        .attr('height', 20)
        .attr('fill', (d1) => colScale(d1.x0));

      cbs
        .transition()
        .duration(1000)
        .attr('fill', (d1) => {
          const k = `06083${d1.properties.TRACTCE10}${d1.properties.BLOCKCE10}`;
          const pt = data.find((d2) => d2.fips === k);

          if (pt[d.toLowerCase()] === 'NA' || d1.properties.city === 'goleta') {
            return '#00000000';
          }

          return colScale.domain(dom)(+pt[d.toLowerCase()] / 100);
        });
    }
  };

  const buttons = selector
    .selectAll('selections')
    .data(mapOptions)
    .enter()
    .append('div')
    .text((d) => d)
    .style('padding', '5px 10px')
    .style('border', '1px solid #d3d3d3')
    .style('border-radius', '10px')
    .style('margin', '5px')
    .style('cursor', 'pointer')
    .style('background-color', (d) =>
      d === 'Cities' ? '#d3d3d344' : '#ffffff',
    );

  // const campusPoint = projection([-119.8444, 34.40416]);
  // svg
  //   .append('circle')
  //   .attr('cx', campusPoint[0])
  //   .attr('cy', campusPoint[1])
  //   .attr('r', 4);

  const annotation = svg.append('g');
  const endIV = projection([-119.8743, 34.40869]);
  annotation
    .append('circle')
    .attr('cx', endIV[0])
    .attr('cy', endIV[1])
    .attr('r', 4);
  const endIVyOffset = 15;
  annotation
    .append('line')
    .attr('x1', endIV[0])
    .attr('x2', endIV[0])
    .attr('y2', endIV[1] + endIVyOffset)
    .attr('y1', endIV[1])
    .style('stroke-dasharray', '1, 2')
    .style('stroke', 'black');

  annotation
    .append('text')
    .text('This region contains 385 people')
    .attr('alignment-baseline', 'hanging')
    .style('font-size', '12px')
    .attr('x', endIV[0] - 5)
    .attr('y', endIV[1] + endIVyOffset + 2);

  annotation
    .append('text')
    .text('from West Campus Housing and')
    .attr('alignment-baseline', 'hanging')
    .style('font-size', '12px')
    .attr('x', endIV[0] - 5)
    .attr('y', endIV[1] + endIVyOffset + 2 + 12);

  annotation
    .append('text')
    .text('20 from IV.')
    .attr('alignment-baseline', 'hanging')
    .style('font-size', '12px')
    .attr('x', endIV[0] - 5)
    .attr('y', endIV[1] + endIVyOffset + 2 + 24);

  const margin = {
    top: 50,
    left: 5,
    bottom: 10,
    right: 35,
  };

  const y = d3
    .scaleBand()
    .domain(['iv', 'ucsb'])
    .range([
      size.height + margin.top,
      size.height + barsSize.height - margin.bottom,
    ])
    .paddingInner(0.75);

  const x = d3.scaleLinear().range([margin.left, size.width - margin.right]);

  const raceColors = {
    white: '#4e79a7',
    black: '#af7aa1',
    asian: '#59a14f',
    other: '#B0B0B0',
    more2: '#e15759',
  };

  const raceLabels = {
    white: 'White',
    black: 'Black',
    asian: 'Asian',
    other: 'Other',
    more2: '≥2 races',
  };

  const barData = [
    {
      x1: 0,
      x2: 0.669,
      y: 'iv',
      name: 'white',
    },
    {
      x1: 0.669,
      x2: 0.6886,
      y: 'iv',
      name: 'black',
    },
    {
      x1: 0.6886,
      x2: 0.7082,
      y: 'iv',
      name: 'asian',
    },
    {
      x1: 0.7082,
      x2: 0.8372,
      y: 'iv',
      name: 'other',
    },
    {
      x1: 0.8372,
      x2: 1,
      y: 'iv',
      name: 'more2',
    },
    {
      x1: 0,
      x2: 0.6,
      y: 'ucsb',
      name: 'white',
    },
    {
      x1: 0.6,
      x2: 0.6367,
      y: 'ucsb',
      name: 'black',
    },
    {
      x1: 0.6367,
      x2: 0.8347,
      y: 'ucsb',
      name: 'asian',
    },
    {
      x1: 0.8347,
      x2: 0.9275,
      y: 'ucsb',
      name: 'other',
    },
    {
      x1: 0.9275,
      x2: 1,
      y: 'ucsb',
      name: 'more2',
    },
  ];

  // svg
  //   .selectAll('bars')
  //   .data(barData)
  //   .enter()
  //   .append('rect')
  //   .attr('x', (d) => x(d.x1))
  //   .attr('width', (d) => x(d.x2) - x(d.x1))
  //   .attr('y', (d) => y(d.y))
  //   .attr('height', y.bandwidth() * 2)
  //   .attr('fill', (d) => raceColors[d.name]);

  const triangle = d3.symbol().type(d3.symbolTriangle).size(25);

  svg
    .append('text')
    .text('UCSB')
    .attr('x', x(0))
    .attr('y', y('ucsb') - 2);
  svg
    .append('text')
    .text('Isla Vista')
    .attr('x', x(0))
    .attr('y', y('iv') - 2);

  svg
    .append('text')
    .text('Overall area makeup')
    .attr('font-size', '16pt')
    .attr('x', x(0))
    .attr('y', y('iv') - 30);

  svg
    .selectAll('bars')
    .data(barData)
    .join((enter) => {
      enter
        .append('rect')
        .attr('x', (d) => x(d.x1))
        .attr('width', (d) => x(d.x2) - x(d.x1))
        .attr('y', (d) => y(d.y))
        .attr('height', y.bandwidth() * 2)
        .attr('fill', (d) => raceColors[d.name]);

      enter
        .append('text')
        .attr('class', 'raceBarLabels')
        .attr('id', (d) => `census2020-raceLabel-${d.name}`)
        .attr('x', (d) => (x(d.x2) + x(d.x1)) / 2)
        .attr('y', (d) => y(d.y) - 9)
        .text(
          (d) =>
            `${`${raceLabels[d.name]}: ${Math.round((d.x2 - d.x1) * 100)}`}%`,
        )
        .attr('text-anchor', 'middle')
        .attr('fill-opacity', (d) => (d.name === 'more2' ? 1 : 0));

      enter
        .append('path')
        .attr('class', 'raceBarLabels')
        .attr('id', (d) => `census2020-raceLabel-${d.name}`)
        .attr('d', triangle)
        .attr(
          'transform',
          (d) =>
            `translate(${(x(d.x2) + x(d.x1)) / 2},${y(d.y) - 5}) rotate(180)`,
        )
        .attr('fill-opacity', (d) => (d.name === 'more2' ? 1 : 0));
    });

  let i = 0;
  const playButtonInterval = setInterval(() => {
    ++i;
    if (i === mapOptions.length) {
      i = 0;
    }
    buttons
      .filter((d, j) => j === i)
      .each(function (d) {
        selectMapOption(this, d);
      });
  }, 5000);

  buttons.on('click', (event, d) => {
    clearInterval(playButtonInterval);
    selectMapOption(event.target, d);
  });
};

export default makePlot;
