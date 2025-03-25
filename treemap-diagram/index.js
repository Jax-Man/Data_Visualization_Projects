import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const data = await d3.json('https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json');
function formatData() {
  
  // Declare the chart dimensions and margins.
  const width = 1000;
  const height = 600;
  const dataWidth = width / 38;
  const marginTop = 80;
  const marginRight = 160;
  const marginBottom = 30;
  const marginLeft = 160;
  
  // Variable attributes
  
  const categoryArray = data.children.map(e => e.name);
  const categoryNumConverter = d3.scaleBand(categoryArray, [0,1])
  
  // Make Color Scales for elements
  function categoryColor(category) {
    
    const categoryNum = categoryNumConverter(category);
    const categoryColor = d3.interpolateWarm(categoryNum);
    return categoryColor;
  }
  
  //Format Treemap Data
  const root = d3.hierarchy(data)
    .eachBefore(d => d.data.id = (d.parent ? d.parent.data.id + '.' : '') + d.data.name)
    .sum(d => d.value)
    .sort((a, b) => b.height - a.height || b.value - a.value)
  
  const treemap = d3.treemap().size([width, height + marginTop + marginBottom]).paddingInner(1).paddingOuter(0);
  treemap(root);
  


  // Create the SVG container.
  const svg = d3.select("#graph-wrapper").append("svg")
      .attr("width", width + marginLeft + marginRight)
      .attr("height", height + marginTop + marginBottom);
      
  //Make G cells for data
  const cell = svg.selectAll('g')
    .data(root.leaves())
    .enter()
    .append('g')
    .attr('class', d => `${d.parent.data.name.replace(/\s+/g, '-')}`)
    .attr('transform', d => `translate( ${d.x0}, ${d.y0})`);
  
  cell.append('rect')
    .attr('class', 'tile')
    .attr('id', d => d.data.id)
    .attr('data-name', d => d.data.name)
    .attr('data-category', d => d.data.category)
    .attr('data-value', d => d.data.value)
    .attr('fill', d => categoryColor(d.data.category))
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0);
  
    console.log(root.leaves())

  cell.append('text')
    .selectAll('tspan')
    .data(function (d) {
      
      const width = d.x1 - d.x0;
      const name = d.data.name;
      const shortenedName = `${name.slice(0, 10)}...`;

      if (width < 200) {
      return shortenedName.split(/\s/g)
      } else {
        return name.split(/(?=[A-Z][^A-Z])/g)
      }
    }
    )
    .enter()
    .append('tspan')
    .attr('x', 5)
    .attr('y', (d, i) => 13 + i * 15)
    .text(d => d)
    .style('user-select', 'none')
  //create legend on side
  
  const legend = svg
      .append('g')
      .attr('id', 'legend')
      .attr('transform', `translate(${width + (marginLeft / 3)}, ${marginBottom + 15})`);    
      

      legend.selectAll('rect')
        .data(categoryArray)
        .enter()
        .append('rect')
        .attr('class', 'legend-item')
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', d => categoryColor(d))
        .attr('x', 0)
        .attr('y', (_, i) => i * 35);
      
      legend.selectAll('text')
        .data(categoryArray)
        .enter()
        .append('text')
        .text(d => d)
        .attr('x', 30)
        .attr('y', (_, i) => (i * 35) + 15)
        
      legend.append('text').text('Categories')
      .attr('x', 0)
      .attr('y', -10)
      .style('font-size', '2rem')
      .style('text-decoration', 'underline')
      .style('font-weight', 'bolder')
  //make identifiers

  //create tooltip on hover
  const tooltip = d3.select('body')
      .append('div')
      .attr('id', 'tooltip')
      .attr('class', 'overlay')
      .style('opacity', 0)
      .style('position', 'absolute');

//function on mousemove
  svg.selectAll('.tile').on('mousemove', (event, d) => {
    //Conditional Placing of tooltip
    const xTooltip = event.pageX;
    const yTooltip = event.pageY;
    //Values for color

    const colorIndex = categoryArray.indexOf(d.data.category);
    // Adjust the saturation of the colors
      const color1 = d3.hsl(categoryColor(d.data.category)).brighter(1).toString();
      const color2 = d3.hsl(categoryColor(categoryArray[categoryArray.length - colorIndex - 1])).brighter(1).toString();
      
    //Function to format 
    //the value into money for readability
    function moneyFormat(x) {
      return '$' + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  
    console.log(d)
    tooltip.raise();

    tooltip
      .transition()
      .duration(50)
      .style('opacity', 0.9)
      .attr('data-value', d.data.value)
      .style('left', `${xTooltip + 35}px`)
      .style('top', `${yTooltip - 20}px`)
      .style('background', `linear-gradient(0.33turn, ${color1}, ${color2})`)
      .style('border', `3px solid ${categoryColor(d.data.category)}`)
      .style('padding', '5px');

      tooltip.html(`
        <strong>${d.data.name}</strong><br>
        Category: ${d.data.category}<br>
        Value: ${moneyFormat(d.data.value)}
      `);
        
      }
    )
    .on('mouseout', () => {
    tooltip.transition().duration(100).style('opacity', 0)
    d3.selectAll('.tile').transition().duration(200)
      
    tooltip.lower();
    
    
    
    })
}
if (document.readyState !== 'loading') {
  formatData();
} else { document.addEventListener("DOMContentLoaded", () => formatData()) }
