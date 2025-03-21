import * as d3 from 'd3';

const data = [];

/*async function getData() {
  const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Uh-Oh this error happened: ${response.status}`);
    }

    const json = await response.json();
    console.log(json);
  } catch (error) {
    console.log("uh-oh", error.message)
  };
  return 
}*/


document.addEventListener ("DOMContentLoaded", () => {
    
    
    
    const [isSvgAppended, setIsSvgAppended] = useState(false);

    
    
  
    
    
      if (gotData && !isSvgAppended) {
        
        const gdpData = data.data.map((e) => e[1]); 
        const yearsData = data.data.map((e) => new Date(e[0]))
        const dateMap = yearsData.map((e) => [Number.parseInt(e[0]), Number.parseInt(e[1])])
        
        // Set Month To 1-4 based on value and grab unique years

        dateMap.forEach(element => {
          if (element[1] === 1) { 
            element[1] = 1 
          } else if (element[1] === 4) { 
              element[1] = 2 
          } else if (element[1] === 7) { 
              element[1] = 3 
          } else if (element[1] === 10) { 
              element[1] = 4 
          }

        });

        const w = 1000;
        const h = 500;
        const dataWidth = w / 275;
        const scale = 3;

        const padding = 50;
       
        var xMax = new Date(d3.max(yearsData));
        xMax.setMonth(xMax.getMonth() + 3);
        

        const xScale = d3.scaleTime()
        .domain([d3.min(yearsData), xMax])
        .range([padding, w - padding])
        

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(gdpData)])
            .range([h - padding, padding]);
        
          // Making data Array to sort years
        
        const xAxis = d3.axisBottom(xScale);

        const yAxis = d3.axisLeft(yScale);

        const svg = d3.select('#data-wrapper')
        .append('svg')
        .attr('width', w)
        .attr('height', h)
        .style('background-color', 'red');

        svg.selectAll('rect')
            .data(data.data)
            .enter()
            .append('rect')
            .attr('x', (d, i) => xScale(yearsData[i]))
            .attr('y', (d) => yScale(d[1]))
            .attr('width', dataWidth)
            .attr('height', (d) => h - padding - yScale(d[1]))
            .attr('data-date', (d, i) => data.data[i][0])
            .attr('data-gdp', (d, i) => data.data[i][1])
            .attr('fill', 'navy')
            .attr('class', 'bar')
            
        svg.append("g")
            .attr('transform', 'translate(0, ' + (h - padding) + ')')
            .call(xAxis)
            .attr('id', 'x-axis');

        svg.append('g')
            .attr('transform', `translate(${padding}, 0)`)
            .call(yAxis)
            .attr('id', 'y-axis');
        
        svg.selectAll('line')
          .attr('class', 'tick')

       setIsSvgAppended(true);
    }
  
      
    


  
})
