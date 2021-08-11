/**
 * @file
 * @author
 * @since
 */
import './styles.scss';
import * as d3 from 'd3';

// import other files here
import makeCbgs from './cbgs';
import makeCbs from './cbs';

(async () => {
  const map = await d3.json('dist/data/iv.json');
  const mapBlocks = await d3.json('dist/data/ivblocks.json');
  const data2010p1 = await d3.csv('dist/data/ivDataP1.csv', (d) => ({
    fips: +d.fips,
    pop: +d.pop,
  }));

  const resize = () => {
    makeCbgs(map, data2010p1);
    makeCbs(mapBlocks, data2010p1);
  };

  window.addEventListener('resize', () => {
    resize();
  });

  resize();
})();
