import * as d3 from 'd3';
import { getTextWidth } from './utility';

const makePlot = (mapData, data) => {
  const container = d3.select('#census-cbgs2010');
  container.selectAll('*').remove();

  container.append('h1').text('Census Block Groups');

  const size = {
    height: Math.min(400, window.innerWidth - 40),
    width: Math.min(535, window.innerWidth - 40),
  };

  const legend = container
    .append('div')
    .style('margin-top', '5px')
    .style('display', 'flex')
    .style('justify-content', 'center')
    .style('flex-wrap', 'wrap')
    .style('width', `${size.width}px`);

  const hoverArea = container.append('div').style('position', 'relative');
  const svg = hoverArea.append('svg');

  container
    .append('div')
    .html('<p>Source: <a href="https://www.google.com">here</a></p>');

  const projection = d3
    .geoMercator()
    .fitSize([size.width - 10, size.height - 10], mapData);
  // .scale(700000)
  // .rotate([119.8626, -34.41768])
  // .translate([257, 200]);

  //   const projection = d3
  //     .geoAlbersUsa()
  //     .fitSize([size.width / 2, size.height / 2], mapData)
  //     .scale(100);

  const path = d3.geoPath().projection(projection);

  svg.attr('height', size.height).attr('width', size.width);
  // .style('border', '1px solid black');

  //   svg
  //     .append('g')
  //     .attr('fill', 'white')
  //     .attr('stroke', 'black')
  //     .datum(mapData)
  //     .append('path')
  //     .attr('d', path);
  //   return;
  const area = svg.append('g').attr('fill', 'white').attr('stroke', 'black');

  const colors = {
    sb: '#76b7b2',
    iv: '#4e79a7',
    goleta: '#f28e2c',
  };

  const inCity = (prop) => {
    if (['060830029221', '060830029223'].includes(prop.GEOID10)) {
      return 'sb';
    }
    if (
      ['002936', '002926', '002924'].includes(prop.TRACTCE10) ||
      prop.GEOID10 === '060830029282'
    ) {
      return 'iv';
    }

    return 'goleta';
  };

  const cityLabs = {
    sb: 'Santa Barbara',
    iv: 'Isla Vista',
    goleta: 'Goleta',
  };

  const cbgs = svg
    .append('svg')
    .selectAll('path')
    .data(mapData.features)
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', (d) => colors[inCity(d.properties)])
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

  cbgs.on('mousemove', (event, dat) => {
    const [mouseX, mouseY] = d3.pointer(event);

    const cityName = cityLabs[inCity(dat.properties)];

    const width =
      2 * 10 +
      getTextWidth(cityName, 'normal 18.72px Arial, Helvetica, sans-serif');

    tooltip.style('display', 'block');
    tooltip
      .html(`<h3>${cityName}</h3><hr style="margin: 3px 0;"/>`)
      .style('width', `${width}px`)
      .style('left', `${Math.min(mouseX, size.width - width)}px`)
      .style('top', `${mouseY}px`);

    console.log(dat);
    const pt = data.find((d) => d.fips === dat.properties.GEOID10);
    console.log(data);
    console.log(pt);
  });

  cbgs.on('mouseleave', () => {
    tooltip.style('display', 'none');
  });

  Object.entries(cityLabs)
    .reverse()
    .forEach(([abbr, label]) => {
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

  console.log(data);
};

export default makePlot;
