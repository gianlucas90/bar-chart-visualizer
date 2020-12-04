const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

console.log(d3);
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    dataset = data.data;

    const w = 1000;
    const h = 500;

    const parseDate = d3.timeParse('%Y-%m-%d');

    const padding = 80;

    const minX = d3.min(dataset, function (d) {
      return parseDate(d[0]);
    });
    const maxX = d3.max(dataset, function (d) {
      return parseDate(d[0]);
    });

    const maxY = d3.max(dataset, (d) => d[1]);

    const xScale = d3
      .scaleTime()
      .domain([minX, maxX])
      .range([padding, w - padding]);

    const yScale = d3
      .scaleLinear()
      .domain([0, maxY])
      .range([h - padding, padding]);

    const svg = d3
      .select('.container')
      .append('svg')
      .attr('width', w)
      .attr('height', h);

    var div = d3
      .select('body')
      .append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0);

    const rec = svg
      .selectAll('rect')
      .data(dataset)
      .enter()
      .append('rect')
      .attr('y', (d, i) => yScale(d[1]))
      .attr('x', (d, i) => xScale(parseDate(d[0])))
      .attr('width', (d, i) => 2)
      .attr('height', (d, i) => h - padding - yScale(d[1]))
      .attr('fill', 'navy')
      .attr('class', 'bar')
      .attr('data-date', (d) => d[0])
      .attr('data-gdp', (d) => d[1]);

    rec.on('mouseover', handleMouseOver).on('mouseout', handleMouseOut);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg
      .append('g')
      .attr('transform', 'translate(0,' + (h - padding) + ')')
      .attr('id', 'x-axis')
      .call(xAxis);

    svg
      .append('g')
      .attr('transform', 'translate(' + padding + ' , 0)')
      .attr('id', 'y-axis')
      .call(yAxis);

    // Create Event Handlers for mouse
    function handleMouseOver(e, d) {
      div.transition().duration(200).style('opacity', 0.9);
      console.log(e.x);
      div.html(formatDate(d[0]) + '<br/>' + d[1]).style('left', e.x + 'px');
      div.attr('data-date', d[0]).attr('data-gdp', d[1]);
    }

    function handleMouseOut(e, d) {
      div.transition().duration(500).style('opacity', 0);
    }

    // format date
    function formatDate(date) {
      const year = date.split('-')[0];
      const month = date.split('-')[1];
      switch (month) {
        case '01':
          return `Q1 ${year}`;
          break;
        case '04':
          return `Q2 ${year}`;
          break;
        case '07':
          return `Q3 ${year}`;
          break;
        case '10':
          return `Q4 ${year}`;
          break;
        default:
          return null;
      }
    }
  });
