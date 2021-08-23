import * as d3 from 'd3';
import { map } from 'd3';

const makePlot = (mapData, data) => {
  const container = d3.select('#census-cbs2020');
  container.selectAll('*').remove();

  container.append('h1').text('IV and UCSB Demographics 2020');
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
      '<p>Source: <a href="https://www.census.gov/programs-surveys/decennial-census/about/rdo/summary-files.2020.html#P1">United States 2020 Census Redistricting Data.</a></p>',
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
    ucsb: '#76b7b2',
    iv: '#4e79a7',
    goleta: '#f28e2c66',
  };

  const cityLabs = {
    ucsb: 'UCSB',
    iv: 'Isla Vista',
    goleta: 'Goleta',
  };
  const raceColors = {
    white: 'rgb(43,122,185)',
    black: 'rgb(253,213,173)',
    asian: '#38A055',
    other: '#DDDDDD',
    more2: '#e15759',
    hisp: '#AAA9D0',
    nothisp: '#7270b7',
  };
  const getDomain = (d) => {
    switch (d.toLowerCase()) {
      case 'white':
        return [0, 1];
      case 'asian':
        return [0, 1];
      case 'black':
        return [0, 0.25];
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
        return d3.interpolateOranges;
      case 'other':
        return d3.interpolateGreys;
      case 'hisp':
        return d3.interpolatePurples;
      default:
        return [0, 1];
    }
  };

  const getMaxKey = (d) => {
    const maxVal = d3.max(
      ['asian', 'black', 'hisp', 'other', 'white'].map((k) => +d[k]),
    );

    const meetsThresh = (x) => Math.abs(+x - maxVal) < 0.0001;
    if (meetsThresh(d.asian)) {
      return ['asian', maxVal];
    }
    if (meetsThresh(d.black)) {
      return ['black', maxVal];
    }
    if (meetsThresh(d.hisp)) {
      return ['hisp', maxVal];
    }
    if (meetsThresh(d.white)) {
      return ['white', maxVal];
    }
    return ['other', maxVal];
  };

  const fillOverview = (d) => {
    if (d.properties.city === 'goleta') {
      return '#ffffffff';
    }
    const [race, val] = getMaxKey(
      data.find((d1) => d1.fips === d.properties.GEOID20),
    );

    if (race === 'other') {
      return '#ffffffff';
    }

    return d3.scaleSequential(getColorScale(race)).domain(getDomain(race))(
      val / 100,
    );
  };

  const cbs = svg
    .selectAll('path')
    .data(mapData.features)
    .enter()
    .append('g')
    .append('path')
    .attr('d', path)
    .attr('fill', fillOverview)
    // .attr('fill', '#ffffffff')
    // .attr('fill', (d) => colors[d.properties.city])
    .attr('stroke', 'black')
    .attr('stroke-width', 0.5);

  // const centroids = svg
  //   .selectAll('centroids')
  //   .data(mapData.features)
  //   .enter()
  //   .filter((d) => {
  //     if (
  //       d.properties.city === 'goleta' // ||
  //       // d.properties.GEOID20 === '060830029333013'
  //     ) {
  //       return false;
  //     }
  //     const pt = data.find((d2) => d2.fips === d.properties.GEOID20);
  //     return +pt.pop > 0;
  //   })
  //   .append('g')
  //   .attr('transform', (d) => {
  //     const [cx, cy] = path.centroid(d);
  //     return `translate(${cx}, ${cy})`;
  //   })
  //   .raise();

  // centroids.each(function (d, i) {
  //   const cb = d3.select(this);
  //   const vals = data.find((d1) => d1.fips === d.properties.GEOID20);

  //   console.log(vals);
  //   cb.append('circle')
  //     .attr('class', 'census-centroid-group')
  //     .attr('r', 1)
  //     .attr('cx', 0)
  //     .attr('cy', 0);

  //   const maxVal = d3.max(
  //     ['asian', 'black', 'hisp', 'other', 'white'].map((k) => vals[k]),
  //   );

  //   if (vals.white === maxVal) {
  //     cb.append('line')
  //       .attr('x1', -5)
  //       .attr('x2', 5)
  //       .attr('y1', -5)
  //       .attr('y2', 5)
  //       .attr('stroke', 'black');
  //   }

  //   cb.raise();
  // });

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

  const raceLabels = {
    white: 'White',
    black: 'Black',
    asian: 'Asian',
    other: 'Other Races',
    more2: '≥2 races',
    hisp: 'Hispanic',
    cities: 'Cities',
    overview: 'Overview',
  };

  cbs
    .filter((d) => d.properties.city !== 'goleta')
    .on('mousemove', function (event, d) {
      d3.select(this).attr('stroke-width', 3);
      const [mouseX, mouseY] = d3.pointer(event);

      const cityName = cityLabs[d.properties.city];
      const width = 140;
      const k = `06083${d.properties.TRACTCE20}${d.properties.BLOCKCE20}`;
      const pt = data.find((d) => d.fips === k);

      const makeToolTipLabel = (lab, val) => {
        if (val === 'NA' || Number.isNaN(val)) {
          return '';
        }
        const title = lab === 'pop' ? 'Population' : raceLabels[lab];
        return `<p style="font-size:10pt">${title}: ${
          lab === 'pop' ? val : `${Math.round(val * 100) / 100}%`
        }</p>`;
      };

      pt.more2 = 100 - (+pt.asian + +pt.black + +pt.other + +pt.white);

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

  const mapOptions = [
    'overview',
    'white',
    'black',
    'asian',
    'other',
    'hisp',
    'cities',
  ];

  const selectMapOption = (event, d) => {
    selector.selectAll('*').style('background-color', 'white');
    d3.select(event).style('background-color', '#d3d3d344');
    legend.style('display', d === 'cities' ? 'flex' : 'none');
    svg.selectAll('.raceBarLabels').attr('fill-opacity', 0);
    scaleContainer.selectAll('*').remove();

    svg.selectAll('.census-centroid-group').attr('fill-opacity', 0);
    svg.selectAll('.census-centroid-group').attr('stroke-opacity', 0);

    svg
      .selectAll(`#census2020-raceLabel-${d.toLowerCase()}`)
      .attr('fill-opacity', 1);

    if (d === 'cities') {
      cbs
        .transition()
        .duration(1000)
        .attr('fill', (d1) => colors[d1.properties.city]);

      svg.selectAll('#census2020-raceLabel-more2').attr('fill-opacity', 1);
    } else if (d === 'overview') {
      svg.selectAll('.census-centroid-group').attr('fill-opacity', 1);
      svg.selectAll('.census-centroid-group').attr('stroke-opacity', 1);
      cbs.transition().duration(1000).attr('fill', fillOverview);
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
          const k = `06083${d1.properties.TRACTCE20}${d1.properties.BLOCKCE20}`;
          const pt = data.find((d2) => d2.fips === k);

          if (pt[d.toLowerCase()] === 'NA' || d1.properties.city === 'goleta') {
            return '#00000000';
          }
          return colScale(+pt[d.toLowerCase()] / 100);
        });
    }
    if (d.toLowerCase() === 'hisp') {
      svg.selectAll('.census2020-barOptions-race').attr('fill-opacity', 0);
      svg.selectAll('.census2020-barOptions-eth').attr('fill-opacity', 1);
    } else {
      svg.selectAll('.census2020-barOptions-race').attr('fill-opacity', 1);
      svg.selectAll('.census2020-barOptions-eth').attr('fill-opacity', 0);
    }
  };

  const buttons = selector
    .selectAll('selections')
    .data(mapOptions)
    .enter()
    .append('div')
    .text((d) => raceLabels[d])
    .style('padding', '5px 10px')
    .style('border', '1px solid #d3d3d3')
    .style('border-radius', '10px')
    .style('margin', '5px')
    .style('cursor', 'pointer')
    .style('background-color', (d) =>
      d === 'cities' ? '#d3d3d344' : '#ffffff',
    );

  // const campusPoint = projection([-119.8444, 34.40416]);
  // svg
  //   .append('circle')
  //   .attr('cx', campusPoint[0])
  //   .attr('cy', campusPoint[1])
  //   .attr('r', 4);

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

  const barData = [
    {
      x1: 0,
      x2: 0.482,
      y: 'iv',
      name: 'white',
    },
    {
      x1: 0.482,
      x2: 0.5041,
      y: 'iv',
      name: 'black',
    },
    {
      x1: 0.5041,
      x2: 0.7131,
      y: 'iv',
      name: 'asian',
    },
    {
      x1: 0.7131,
      x2: 0.8401,
      y: 'iv',
      name: 'other',
    },
    {
      x1: 0.8401,
      x2: 1,
      y: 'iv',
      name: 'more2',
    },
    {
      x1: 0,
      x2: 0.459,
      y: 'ucsb',
      name: 'white',
    },
    {
      x1: 0.459,
      x2: 0.4715,
      y: 'ucsb',
      name: 'black',
    },
    {
      x1: 0.4715,
      x2: 0.8485,
      y: 'ucsb',
      name: 'asian',
    },
    {
      x1: 0.8485,
      x2: 0.9276,
      y: 'ucsb',
      name: 'other',
    },
    {
      x1: 0.9276,
      x2: 1,
      y: 'ucsb',
      name: 'more2',
    },
    {
      x1: 0,
      x2: 0.727,
      y: 'iv',
      name: 'nothisp',
    },
    {
      x1: 0.727,
      x2: 1,
      y: 'iv',
      name: 'hisp',
    },
    {
      x1: 0,
      x2: 0.809,
      y: 'ucsb',
      name: 'nothisp',
    },
    {
      x1: 0.809,
      x2: 1,
      y: 'ucsb',
      name: 'hisp',
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
        .attr(
          'class',
          (d) =>
            `census2020-barOptions-${d.name.includes('hisp') ? 'eth' : 'race'}`,
        )
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
  svg.selectAll('.census2020-barOptions-eth').attr('fill-opacity', 0);

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

  buttons
    .filter((d, j) => j === 0)
    .each(function (d) {
      selectMapOption(this, d);
    });
};
export default makePlot;
