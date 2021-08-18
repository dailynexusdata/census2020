/**
 * @file
 * @author
 * @since
 */
import './styles.scss';
import * as d3 from 'd3';
import * as d3Collection from 'd3-collection';

// import other files here
// import makeCbgs from './cbgs';
// import makeCbgs2010 from './cbgs2010';
import makeCbs from './cbs';
import makeLinePlot from './linePlot';
import makeHousingPlot from './housingPlot';
// import makeCbs2010 from './cbs2010';

(async () => {
  const mapBlocks = await d3.json('dist/data/ivblocks.json');
  // const mapBlocks2010 = await d3.json('dist/data/ivblocks2010.json');
  // const data2010p1 = await d3.csv('dist/data/ivDataP1.csv');
  const data2020p1 = await d3.csv('dist/data/ivData2020P1.csv');

  const lineData = d3Collection
    .nest()
    .key((k) => k.where)
    .key((k) => k.race)
    .entries([
      {
        year: '2020',
        val: 0.4731852,
        race: 'white',
        where: 'iv',
      },
      {
        year: '2020',
        val: 0.01840539,
        race: 'black',
        where: 'iv',
      },
      {
        year: '2020',
        val: 0.2740976,
        race: 'asian',
        where: 'iv',
      },
      {
        year: '2020',
        val: 0.108687,
        race: 'other',
        where: 'iv',
      },
      {
        year: '2020',
        val: 0.12562481,
        race: 'more2',
        where: 'iv',
      },
      {
        year: '2010',
        val: 0.6440509,
        race: 'white',
        where: 'iv',
      },
      {
        year: '2010',
        val: 0.02571874,
        race: 'black',
        where: 'iv',
      },
      {
        year: '2010',
        val: 0.1466488,
        race: 'asian',
        where: 'iv',
      },
      {
        year: '2010',
        val: 0.1162972,
        race: 'other',
        where: 'iv',
      },
      {
        year: '2010',
        val: 0.06728436,
        race: 'more2',
        where: 'iv',
      },
      {
        year: '2020',
        val: 0.2418088,
        race: 'hisp',
        where: 'iv',
      },
      {
        year: '2010',
        val: 0.2279616,
        race: 'hisp',
        where: 'iv',
      },
      // county 2020
      {
        year: '2020',
        val: 0.5014133,
        race: 'white',
        where: 'sb',
      },
      {
        year: '2020',
        val: 0.01645141,
        race: 'black',
        where: 'sb',
      },
      {
        year: '2020',
        val: 0.05923088,
        race: 'asian',
        where: 'sb',
      },
      {
        year: '2020',
        val: 0.2219892,
        race: 'other',
        where: 'sb',
      },
      {
        year: '2020',
        val: 0.2009152,
        race: 'more2',
        where: 'sb',
      },
      {
        year: '2020',
        val: 0.4698134,
        race: 'hisp',
        where: 'sb',
      },
      // county 2010
      {
        year: '2010',
        val: 0.6962196,
        race: 'white',
        where: 'sb',
      },
      {
        year: '2010',
        val: 0.0200828,
        race: 'black',
        where: 'sb',
      },
      {
        year: '2010',
        val: 0.04875028,
        race: 'asian',
        where: 'sb',
      },
      {
        year: '2010',
        val: 0.1742413,
        race: 'other',
        where: 'sb',
      },
      {
        year: '2010',
        val: 0.06070607,
        race: 'more2',
        where: 'sb',
      },
      {
        year: '2010',
        val: 0.4286132,
        race: 'hisp',
        where: 'sb',
      },
    ])
    .reduce((a, b) => [...a, ...b.values], []);

  const housingData = [
    { where: 'UCSB', pct: 0.028 },
    { where: 'GOLETA', pct: 0.181 },
    { where: 'IV', pct: -0.063 },
    { where: 'SB City', pct: 0.133 },
  ];

  const resize = () => {
    // makeCbgs(map, data2010p1);
    makeCbs(mapBlocks, data2020p1);
    makeLinePlot(lineData);
    makeHousingPlot(housingData);
    // makeCbgs2010(map2010, data2010p1);
    // makeCbs2010(mapBlocks2010, data2010p1);
  };

  window.addEventListener('resize', () => {
    resize();
  });

  resize();
})();
