import * as d3 from 'd3';

const housingPlot = (unsortedData) => {
  /**
   * TODO: Sort the data by the pct in decreasing order,
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
   */
  const sortedData = unsortedData.sort((a, b) => a.pct - b.pct);

  const container = d3.select('#census-housingplot');

  container.selectAll('*').remove();

  container.append('h1').text('IV and UCSB Demographics 2020');

  const size = {
    height: 250,
    width: Math.min(600, window.innerWidth - 40),
  };

  // you can see that the 20% in the axis is cut off --
  //  and the xaxis overlaps with the other text at the bottom
  // add more margin to give it space and see what happens
  const margin = {
    top: 10,
    right: 15,
    bottom: 39,
    left: 10,
  };

  const svg = container
    .append('svg')
    .attr('width', size.width)
    .attr('height', size.height);

  container
    .append('div')
    .html(
      "Source: Housing, Dining & Auxiliary Enterprises Business Intelligence 'Where Students Live - Winter 2019'",
    );

  container
    .append('p')
    .text('Chart: Bella Gennuso / Daily Nexus')
    .style('font-style', 'italic');

  /*

  SCALES:

  */
  const y = d3
    .scaleBand()
    .domain(sortedData.map((d) => d.where))
    .range([size.height - margin.bottom, margin.top]);

  const x = d3
    .scaleLinear()
    .domain([-0.1, 0.2])
    .range([margin.left, size.width - margin.right]);

  svg
    .append('g')
    .style('color', '#adadad')
    .style('font-size', '12pt')
    .attr('transform', `translate(0, ${size.height - margin.bottom})`)
    .call(
      d3
        .axisBottom()
        .scale(x)
        .ticks(5)
        .tickFormat((d) => d * 100 + (d === 0.2 ? '%' : '')),
    );

  svg
    .append('text')
    .attr('x', margin.left)
    .attr('y', size.height)
    .attr('fill', '#adadad')
    .attr('font-size', '12pt')
    .text('% increase from Winter 2018');

  /*
        Plot
    */
  const colors = {
    UCSB: 'gray',
    IV: 'red',
    GOLETA: 'green',
    'SB City': 'green',
  };

  console.log(d3.scaleOrdinal(d3.schemeTableau10));

  const places = svg.selectAll('places').data(sortedData).join('g');

  places
    .append('rect')
    .attr('x', (d) => (d.pct < 0 ? x(d.pct) : x(0)))
    .attr('y', (d) => y(d.where))
    .attr('height', 20)
    .attr('width', (d) => Math.abs(x(d.pct) - x(0)))
    .attr('fill', (d) => colors[d.where]);
  // add a 'fill' attr to the bars to color them with the `colors` object ^

  // attributes can take either a value, like above I pass in 20 for the height
  // or a funcion:

  // You'll see functionsx done a few ways in JS, just stick with these:

  // for short functions that just return a value, use arrow notation:
  // this takes an argument `a` and returns the square
  // (a) => a**2

  // for moe complicated functions, use an arrow into curly brackets and use the `return` statement to return a value
  // often I'll want to see what is actually being passed into the function, so above the `return`
  // I'll have something like `console.log(a)`
  // after `return` the function is exited and code below that statement doesnt run
  //   (a) => {
  //     // other lines
  //     return a**2
  //   }

  places
    .append('text')
    .text((d) => `${Math.round(d.pct * 100)}%`)
    .attr('x', (d) => x(d.pct) + (d.pct > 0 ? 3 : -3))
    .attr('y', (d) => y(d.where) + 11) // y(d.where) is where the bar starts then add 10 for half of the bar height -- add 1 more just cause
    .attr('alignment-baseline', 'middle') // vertical alignment
    .attr('text-anchor', (d) => (d.pct > 0 ? 'start' : 'end')) // horizontal anchor of text
    .attr('fill', (d) => colors[d.where]);
  // add a fill the same as above ^

  // this is called a ternary operator:
  // (condition ? value-if-true : value-if-false)
  // it's a short hand if-else condition
  // What it does is evaluate the `condition`
  // if that results in a `true` then the first value is returned
  // if not the second

  // I'm using it in the 'text-anchor' attribute to see if the text alignment is left (start) or right (end) aligned
  // I also use it in the 'x' to add a little more space between the bar
  // If the percentage is positive, I want to move the text to the right for extra space
  // So the ternary operator returns a 3
  // if the pct is negative, I want to move the text left so it returns a -3

  places
    .append('text')
    .text((d) => d.where)
    .attr('x', (d) => x(0) + (d.pct > 0 ? -3 : 3))
    .attr('y', (d) => y(d.where) + 11)
    .attr('alignment-baseline', 'middle')
    .attr('text-anchor', (d) => (d.pct > 0 ? 'end' : 'start'))
    .attr('fill', (d) => colors[d.where]);

  // TODO
  // do the same thing with the text as above ^
  // this time the text should be .text(d => d.where) to list the city name
  // align this text on the other side of the bar as the pct's
  // so you'll reverse the ternary in 'x' and in the 'text-anchor'

  // I'm not sure how this will look:
  // - try making the text black or the same color as the bar, just see what looks cleaner

  // If the city labels don't look good on the other side of the bar,
  // put them on top of the bars - left aligned

  svg
    .append('line')
    .attr('x1', x(0))
    .attr('x2', x(0))
    .attr('y1', size.height - margin.bottom)
    .attr('y2', margin.height)
    .attr('stroke', 'black')
    .style('stroke-dasharray', '1, 3');
};

export default housingPlot;
