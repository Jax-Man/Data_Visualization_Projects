import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const data = await d3.csv('https://raw.githubusercontent.com/Jax-Man/fluffy-memory/refs/heads/main/csv-drug-store/climate_change.csv');
function formatData() {
  
  //Setting Up Color Array
  
  const colorArray = data.map(e => d3.interpolateLab('steelblue', 'red')(parseFloat(e.Temp)));

  function mapLegend(array) {
    const tempValues = data.map(e => parseFloat(e.Temp))
    let tempArray = []
  
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        const breakPoint = d3.quantile(tempValues, element).toFixed(2);
        tempArray.unshift(breakPoint);
        
      }
    return tempArray
  }

  const legendBreakPoints = [0, 0.25, 0.5, 0.75, 1]
  const legendColors = mapLegend(legendBreakPoints);
  // Set up xArray for axis
  const xArray = data.map((e) => e.Year);
  //Set up yArray for axis
 
  const yArray = ['January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'];
  

  // Declare the chart dimensions and margins.
  const width = 1000;
  const height = 500;
  const dataWidth = width / 38;
  const marginTop = 80;
  const marginRight = 160;
  const marginBottom = 30;
  const marginLeft = 160;
  
  // Variable attributes
  const dashArray = '10, 5';
  const strokeWidth = '5';
 

  console.log(data)

 
// Declare the x (horizontal position) scale.
const xMin = new Date(d3.min(xArray));
const xMax = new Date(d3.max(xArray));
const xMinValue = xMin.getFullYear();
const xMaxValue = xMax.getFullYear();
xMin.setFullYear(xMinValue + 1);
xMax.setFullYear(xMaxValue + 1);
  const x = d3.scaleBand().range([marginLeft, width - marginRight])
  .domain([...xArray]);
  
  
  const xAxis = d3.axisBottom(x).tickValues(x.domain().filter((year) => year % 2 === 0));
// Declare the y (vertical position) scale.
  const y = d3.scaleBand().range([marginTop, height - marginBottom])
          .domain(yArray);

  const yAxis = d3.axisLeft(y);

// Create the SVG container.
  const svg = d3.select("#graph-wrapper").append("svg")
      .attr("width", width + marginLeft + marginRight)
      .attr("height", height + marginTop + marginBottom);
//create legend on side
  const legend = svg
      .append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${50 + width - marginLeft}, ${height / 2})`)
      
  const threshold = d3.scaleBand()
      .domain(legendColors)
      .range([0, 240]);

    var xAxisLegend = d3.axisRight(threshold)
      .tickSize(13);
  
  //Add Text, axis, and rectangles

  legend.append('g').call(xAxisLegend).attr('transform', `translate(20, 1)`);
  
  legend.append('text')
    .text('Global temp difference in C°')
    .attr('transform', 'translate(70, 125)')
    .style('font-weight', '900')

  legend.selectAll("rect")
      .data(legendColors)
      .enter().append("rect")
        .attr("height", 50)
        .attr("y", (_, i) => threshold(legendColors[i]))
        .attr("width", 20)
        .attr("fill", (_, i) => d3.interpolateLab('steelblue', 'red')(legendColors[i]))
        .attr('style', 'outline: 2px solid black');
      
        
        
    //make identifiers

//create tooltip on hover
  const tooltip = d3.select('svg')
      .append('g')
      .attr('id', 'tooltip')
      .attr('class', 'overlay')
      .style('opacity', 0)
// Add the x-axis.
  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .attr('id', 'x-axis')
      .call(xAxis);
  //and the X label

  svg.append('text').text('Month of Temp Reading').attr('x', (height / 2 + 160) * -1).attr('y', 90).style('transform', 'rotate(-90deg)').style('font-size', '2rem');

  svg.append('text').text('Year of Recorded Temp').attr('x', width / 2 - marginRight).attr('y', height + 40).style('font-size', '2rem')
// Add the y-axis.
  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .attr('id', 'y-axis')
      .call(yAxis);

// Append the SVG data.

  svg.selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .style('stroke', 'black').style('stroke-dasharray', dashArray)
  .attr('class', 'cell')
  .attr('x', (_, i) => x(xArray[i]))
  .attr('y', (d) => y(yArray[d.Month - 1]))
  .attr('width', dataWidth)
  .attr('height', (height - marginBottom - marginTop + 8) / 12)
  .attr('fill', (_, i) => colorArray[i])
  //.attr('style', outlineBase)
  .attr('data-month', d => d.Month - 1)
  .attr('data-year', d => d.Year)
  .attr('data-temp', d => d.Temp)
  .attr('index', (_, i) => i);

  svg.selectAll('.cell').on('mouseover', (event, d) => {
    
    const [xTooltip, yTooltip] = d3.pointer(event);
    const selected = d3.select(event.target);
    const month = yArray[selected.attr('data-month')];
    const temp = parseFloat(selected.attr('data-temp')) + 0.5;
    const tooltipOutline = d3.interpolateRgb('red', 'steelblue')(temp);
    const boxColor = d3.interpolateRgb('white', selected.attr('fill'))(0.2)
    selected.raise()
    console.log(tooltipOutline)
    selected.transition().duration(200)
      .style('stroke', 'black')
      .style('stroke-dasharray', '')
      .style('stroke-width', strokeWidth);

    tooltip.raise();

    tooltip.selectAll('rect').remove();

    tooltip.selectAll('text').remove();

    tooltip
          .transition()
          .duration(200)
          .style('opacity', 0.9)
          .attr('data-year', d.Year)
          //make fill an interpolation of white and color of cell, make outline opposite color
          tooltip.append('rect')
            .attr('style', `outline: thin solid ${tooltipOutline}`)
            .attr('fill', boxColor)
            .attr('height', '60px')
            .attr('width', '160')
            .attr('x', xTooltip + 35)
            .attr('y', yTooltip - 20);

          tooltip.append('text')
          .text(`${month} of ${selected.attr('data-year')}`)
          .attr('x', xTooltip + 45)
          .attr('y', yTooltip );

          tooltip.append('text')
          .text(`Temp Diff: ${selected.attr('data-temp')} C°`)
          .attr('x', xTooltip + 45)
          .attr('y', yTooltip + 25);
  })
  .on('mouseout', () => {
    tooltip.transition().duration(200).style('opacity', 0)
    d3.selectAll('.cell').transition().duration(200)
      .style('stroke', 'black')
      .style('stroke-dasharray', dashArray)
      .style('stroke-width', '1')
    tooltip.lower();
  
    
  })
}
if (document.readyState !== 'loading') {
  formatData();
} else { document.addEventListener("DOMContentLoaded", () => formatData()) }
