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
// import makeCbs2010 from './cbs2010';

(async () => {
  const mapBlocks = await d3.json('dist/data/ivblocks.json');
  // const mapBlocks2010 = await d3.json('dist/data/ivblocks2010.json');
  // const data2010p1 = await d3.csv('dist/data/ivDataP1.csv');
  const data2020p1 = await d3.csv('dist/data/ivData2020P1.csv');

  const lineData = d3Collection
    .nest()
    .key((k) => k.race)
    .entries([
      { year: '2020', val: 0.4731852, race: 'white' },
      { year: '2020', val: 0.01840539, race: 'black' },
      { year: '2020', val: 0.2740976, race: 'asian' },
      { year: '2020', val: 0.108687, race: 'other' },
      { year: '2020', val: 0.12562481, race: 'more2' },
      { year: '2010', val: 0.6440509, race: 'white' },
      { year: '2010', val: 0.02571874, race: 'black' },
      { year: '2010', val: 0.1466488, race: 'asian' },
      { year: '2010', val: 0.1162972, race: 'other' },
      { year: '2010', val: 0.06728436, race: 'more2' },
      { year: '2020', val: 0.2418088, race: 'hisp' },
      { year: '2010', val: 0.2279616, race: 'hisp' },
    ]);
  console.log(lineData);

  const resize = () => {
    // makeCbgs(map, data2010p1);
    makeCbs(mapBlocks, data2020p1);
    makeLinePlot(lineData);
    // makeCbgs2010(map2010, data2010p1);
    // makeCbs2010(mapBlocks2010, data2010p1);
  };

  window.addEventListener('resize', () => {
    resize();
  });

  resize();
})();
