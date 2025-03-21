import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const data = await d3.csv('https://raw.githubusercontent.com/Jax-Man/fluffy-memory/refs/heads/main/csv-drug-store/climate_change.csv');
function formatData() {
  
  //Setting min max to date for formatting and ease of use
  const xFormatYear = 0;
  const colorArray = data.map(e => parseFloat(e.Temp));
  const xArray = data.map((e) => {
    let date = new Date(1970, 0, 1, 0, 0, 0);
    date.setFullYear(e.Year);
    return date;
  });
  //Set up Yarray for axis
 console.log(xArray)
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
  const dataWidth = width / 275;
  const marginTop = 80;
  const marginRight = 160;
  const marginBottom = 30;
  const marginLeft = 160;
  

 

  

 
// Declare the x (horizontal position) scale.
const xMin = new Date(d3.min(xArray));
const xMax = new Date(d3.max(xArray));
const xMinValue = xMin.getFullYear();
const xMaxValue = xMax.getFullYear();
xMin.setFullYear(xMinValue - 1);
xMax.setFullYear(xMaxValue + 1);
  const x = d3.scaleTime().range([marginLeft, width - marginRight])
  .domain([xMin, xMax]);
  
  
  const xAxis = d3.axisBottom(x);
// Declare the y (vertical position) scale.
  const y = d3.scaleBand().range([marginTop, height - marginBottom])
          .domain(yArray);

  const yAxis = d3.axisLeft(y);

// Create the SVG container.
  const svg = d3.select("#graph-wrapper").append("svg")
      .attr("width", width + marginLeft + marginRight)
      .attr("height", height + marginTop + marginBottom);
//creat legend on side
  const legend = d3.select('svg')
      .append('g')
      .attr('id', 'legend')
      
    //make box
      legend.append('rect')
        .attr('width', 250)
        .attr('height', 100)
        .style('opacity', 0)
        
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

  svg.append('text').text('Time in Minutes').attr('x', (height / 2 + 120) * -1).attr('y', 90).style('transform', 'rotate(-90deg)').style('font-size', '2rem');

  svg.append('text').text('Year of Recorded Time').attr('x', width / 2 - marginRight).attr('y', height + 40).style('font-size', '2rem')
// Add the y-axis.
  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .attr('id', 'y-axis')
      .call(yAxis);

// Append the SVG data.

  svg.selectAll()
  
}
if (document.readyState !== 'loading') {
  formatData();
} else { document.addEventListener("DOMContentLoaded", () => formatData()) }
