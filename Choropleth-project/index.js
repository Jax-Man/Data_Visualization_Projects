import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as topojson from "https://cdn.jsdelivr.net/npm/topojson@3/+esm";
const data = await d3.csv('');
function formatData() {
  
  //Setting Up Color Array
  console.log(data)
  const colorArray = '';

  function mapLegend(array) {}

  const legendBreakPoints = [0, 0.25, 0.5, 0.75, 1]
  const legendColors = '';
  // Set up xArray for axis
  const xArray = '';
  //Set up yArray for axis
 
  const yArray = [];
  

  // Declare the chart dimensions and margins.
  const width = 1000;
  const height = 500;
  const dataWidth = '';
  const marginTop = 80;
  const marginRight = 160;
  const marginBottom = 30;
  const marginLeft = 160;
  
  // Variable attributes
  

  

 
// Declare the x (horizontal position) scale.

  const x = '';
  
  
  const xAxis = '';
// Declare the y (vertical position) scale.
  const y = '';

  const yAxis = '';

// Create the SVG container.
  const svg = d3.select("#graph-wrapper").append("svg")
      .attr("width", width + marginLeft + marginRight)
      .attr("height", height + marginTop + marginBottom);

//create US map
  const path = d3.geoPath();

  const g = svg.append('g')

  const states = g.append("g")
    .attr("fill", "#444")
    .attr("cursor", "pointer")
  .selectAll("path")
  .data(topojson.feature(us, us.objects.states).features)
  .join("path")
    .on("click", clicked)
    .attr("d", path);

  states.append("title")
   .text(d => d.properties.name);

  g.append("path")
  .attr("fill", "none")
  .attr("stroke", "white")
  .attr("stroke-linejoin", "round")
  .attr("d", path(topojson.mesh(us, us.objects.states, (a, b) => a !== b)));
//create legend on side
  const legend = svg
      .append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${50 + width - marginLeft}, ${height / 2})`)
      
  const threshold = '';

    var xAxisLegend = '';
  
  //Add Text, axis, and rectangles

  legend.append('g').call(xAxisLegend).attr('transform', `translate(20, 1)`);
  
  legend.append('text')
    .text('Global temp difference in C°')
    .attr('transform', 'translate(70, 125)')
    .style('font-weight', '900')

  legend.selectAll("rect")
      .data()
      .enter().append("rect")
        .attr("height", 50)
        .attr("y", '')
        .attr("width", 20)
        .attr("fill", '')
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
  .attr('x', '')
  .attr('y', '')
  .attr('width', dataWidth)
  .attr('height', '')
  .attr('fill', '')
  //.attr('style', outlineBase)
  .attr('data-month', '')
  .attr('data-year', '')
  .attr('data-temp', '')
  .attr('index', '');

  svg.selectAll('.cell').on('mouseover', (event, d) => {
    
    const [xTooltip, yTooltip] = d3.pointer(event);
    const selected = d3.select(event.target);

    selected.raise()
    
    selected.transition().duration(200)
      

    tooltip.raise();

    tooltip.selectAll('rect').remove();

    tooltip.selectAll('text').remove();

    tooltip
          .transition()
          .duration(200)
          .style('opacity', 0.9)
          

          tooltip.append('text')
          .text(``)
          .attr('x', xTooltip + 45)
          .attr('y', yTooltip );

          tooltip.append('text')
          .text(``)
          .attr('x', xTooltip + 45)
          .attr('y', yTooltip + 25);
  })
  .on('mouseout', () => {
    tooltip.transition().duration(200).style('opacity', 0)
    d3.selectAll('').transition().duration(200)
      
    tooltip.lower();
  
    
  })
}
if (document.readyState !== 'loading') {
  formatData();
} else { document.addEventListener("DOMContentLoaded", () => formatData()) }
