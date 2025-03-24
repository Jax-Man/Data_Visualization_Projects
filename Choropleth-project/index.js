import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as topojson from "https://cdn.jsdelivr.net/npm/topojson@3/+esm";

const COUNTY_MAP = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
const EDUCATION_DATA = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
const UNEMPLOYMENT_DATA = 'https://raw.githubusercontent.com/Jax-Man/fluffy-memory/refs/heads/main/csv-drug-store/unemployment.csv';
const stateData = await d3.json(COUNTY_MAP);
const eduData = await d3.json(EDUCATION_DATA);
const employedData = await d3.csv(UNEMPLOYMENT_DATA);
function formatData(us, education, unemployment) {
  //set up data Arrays with percents
  const bachelorsPercent = (i) => education[i].bachelorsOrHigher ? education[i].bachelorsOrHigher : undefined; 
  const unemploymentArray = unemployment.map(e => parseFloat(e.Unemployment_rate_2020));
  const educationArray = education.map((e) => e.bachelorsOrHigher); 
  
  //Setting Up Color Array
  const color = d3.interpolateBlues
  const educationColor = d3.scaleSequential(color).domain([d3.min(educationArray), d3.max(educationArray)]);
  
  console.log(education)
  
  function mapLegend(array) {
    
    let tempArray = []
  
      for (let index = 0; index < array.length; index++) {
        const element = array[index];
        const breakPoint = d3.quantile(array, element).toFixed(2);
        tempArray.push(breakPoint);
        
      }
    return tempArray
  }

  const legendBreakPoints = [0, 0.25, 0.5, 0.75, 1];
  const legendAlign = mapLegend(legendBreakPoints)
  const legendScale = d3.scaleBand().domain(legendAlign).range([0,250]);
  
  // Declare the chart dimensions and margins.
  const width = 1000;
  const height = 500;
  const dataWidth = '';
  const marginTop = 80;
  const marginRight = 160;
  const marginBottom = 30;
  const marginLeft = 160;
  
  // Variable attributes
  
  // Create the SVG container.
  const svg = d3.select("#graph-wrapper").append("svg")
      .attr("width", width + marginLeft + marginRight)
      .attr("height", height + marginTop + marginBottom);

  //create tooltip on hover
  const tooltip = d3.select('svg')
    .append('g')
    .attr('id', 'tooltip')
    .attr('class', 'overlay')
    .style('opacity', 0)

  //create US map
  const border = d3.geoPath();

  const g = svg.append('g')

  g.append('g')
    .attr('class', 'state-counties')
    .selectAll('path')
    .data(topojson.feature(us, us.objects.counties).features)
    .enter()
    .append('path')
    .attr('class', 'county')
    .attr('fill', (d) => {
    const fipsIndex = education.findIndex(e => e.fips === d.id);
    if (fipsIndex !== -1) {
      return educationColor(educationArray[fipsIndex])
    } else { return educationColor(0)}
  })
  .attr('d', border)
  .attr('data-fips', (d) => d.id)
  .attr('data-education', (d) => {
    const fipsIndex = education.findIndex(e => e.fips === d.id);
    
    if (fipsIndex === -1) {
      return `Cannot find data for ${d.id}`
    } else {
      return bachelorsPercent(fipsIndex)
    }
  })
  .on('mousemove', (event, d) => {
    //Tooltip Event handler
    const [xTooltip, yTooltip] = d3.pointer(event);
    const selected = d3.select(event.target);
    const fipsIndex = education.findIndex(e => e.fips === parseFloat(selected.attr('data-fips')));
    
    console.log(education[fipsIndex].area_name.length)
   
    selected.raise();
    
    selected.transition().duration(200)
      
    

    tooltip.raise();

    tooltip.selectAll('rect').remove();

    tooltip.selectAll('text').remove();

    tooltip
      .transition()
      .duration(200)
      .style('opacity', 0.9)
      .attr('data-year', d.id)
      .attr('data-education', selected.attr('data-education'))
      tooltip.append('rect')
        .attr('style', `outline: thin solid black`)
        .attr('fill', () => educationColor((educationArray[fipsIndex]/2)))
        .attr('height', '60px')
        .attr('width', 120 + (5 * education[fipsIndex].area_name.length))
        .attr('x', xTooltip + 35)
        .attr('y', yTooltip - 20);

        tooltip.append('text')
          .text(`${education[fipsIndex].area_name}, ${education[fipsIndex].state}`)
          .attr('x', xTooltip + 45)
          .attr('y', yTooltip );

        tooltip.append('text')
          .text(`With Bachelors: ${selected.attr('data-education')}%`)
          .attr('x', xTooltip + 45)
          .attr('y', yTooltip + 25);

        
      }
    )
    .on('mouseout', () => {
    tooltip.transition().duration(200).style('opacity', 0)
    d3.selectAll('county').transition().duration(200)
      
    tooltip.lower();
    
    
    
    })

  svg.append("path")
  .attr("fill", "none")
  .attr("stroke", "black")
  .attr("stroke-linejoin", "round")
  .attr("d", border(topojson.mesh(us, us.objects.states, (a, b) => a !== b)));
//create legend on side
  const legend = svg
      .append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${50 + width - marginLeft}, ${height / 2})`)
      
  

  const xAxisLegend = d3.axisBottom(legendScale).tickSize(10).tickFormat(d => `${d * 100}%`);
  
  //Add Text, axis, and rectangles

  legend.append('g').call(xAxisLegend).attr('transform', `translate(50, 70)`);
  
  legend.append('text')
    .text('% of Population with Bachelors or higher')
    .attr('transform', 'translate(30, 125)')
    .style('font-weight', '900')

  legend.selectAll('rect')
  .data(legendAlign)
  .enter()
  .append('rect')
  .attr("height", 50)
  .attr("width", 47)
  .attr('y', 18)
  .attr('x', (_, i) => legendScale(legendAlign[i]))
  .attr("fill", (d) => d3.interpolateBlues(d))
  .attr('style', 'outline: 2px solid black')
  .attr('transform', `translate(52, 0)`);

  
}
if (document.readyState !== 'loading') {
  formatData(stateData, eduData, employedData);
} else { document.addEventListener("DOMContentLoaded", () => formatData()) }
