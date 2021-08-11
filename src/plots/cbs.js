import * as d3 from 'd3';

const makePlot = (mapData, data) => {
  const container = d3.select('#census-cbs2020');
  container.selectAll('*').remove();

  container.append('h1').text('Census Blocks');
  const size = { height: 400, width: 525 };
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
    .html(
      '<p>Source: <a href="https://www.google.com">my big fucking brain</a></p>',
    );

  const projection = d3
    .geoMercator()
    .scale(700000)
    .rotate([119.8626, -34.41768])
    .translate([250, 200]);

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
    if (['980300'].includes(prop.TRACTCE20)) {
      return 'sb';
    }
    if (['002936', '002926', '002924'].includes(prop.TRACTCE20)) {
      return 'iv';
    }

    return 'goleta';
  };

  const cityLabs = {
    sb: 'Santa Barbara',
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
    .style('border', '1px solid black');
  // .style('left', '20px')
  // .style('top', '50px');

  cbs.on('mousemove', (event, d) => {
    const [mouseX, mouseY] = d3.pointer(event);

    tooltip.style('display', 'block');
    tooltip
      .html(`${cityLabs[inCity(d.properties)]}<hr />`)
      .style('left', `${mouseX}px`)
      .style('top', `${mouseY}px`);

    const k = `${d.properties.TRACTCE}${d.properties.BLKGRPCE}`;
    // console.log(+k, data);
    const pt = data.find((d) => d.fips === +k);

    // console.log(pt);
  });

  cbs.on('mouseleave', () => {
    tooltip.style('display', 'none');
  });

  Object.entries(cityLabs)
    .reverse()
    .forEach(([abbr, label]) => {
      const entry = legend
        .append('div')
        .style('display', 'flex')
        .style('margin', '0 10px');

      entry
        .append('div')
        .style('background-color', colors[abbr])
        .style('height', '20px')
        .style('width', '20px');
      entry.append('p').text(label).style('margin-left', '5px');
    });
};

export default makePlot;
