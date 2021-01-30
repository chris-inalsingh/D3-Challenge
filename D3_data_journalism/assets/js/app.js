var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top:100,
    right: 100,
    bottom: 60,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  //Import data
d3.csv("data.csv").then(function(healthData){
    //Parse data
    healthData.forEach(function(data){
        data.poverty = +data.poverty;
        data.healthcare= +data.healthcare;
        console.log(data.poverty);
        console.log(data.healthcare);
    });
    //scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(healthData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(healthData, d => d.healthcare)+2])
      .range([height, 0]);
    //create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    //append axes to the chart
    chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    chartGroup.append("g")
    .call(leftAxis);
    //create circles
   chartGroup.selectAll("circle")
    .data(healthData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 20)
    .attr("fill", "cyan")
    .attr("opacity", ".7");

    //create text
    var textGroup = chartGroup.selectAll()
    .data(healthData)
        .enter()
        .append('text')
        .attr("x", d => xLinearScale(d.poverty) - 5)
        .attr("y", d => yLinearScale(d.healthcare) + 3)
        .attr("fill", "white")
        .attr("font-size", "8")
        .text(d => d.abbr);
    
    //tool tip
    var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .attr("background-color", "black")
    .html(function(d) {
      return (`${d.state}<br>In Poverty (%): ${d.poverty}<br>Lacks Healthcare (%): ${d.healthcare}`);
    });
    //create toop tip in chart
    chartGroup.call(toolTip);

    textGroup.on("click", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });

    // Create axes labels
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left +60 )
    .attr("x", 0 - (height / 1.5))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .attr("font-weight", 700)
    .text("Lacks Healthcare (%)");
  
    chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + 30})`)
    .attr("class", "axisText")
    .attr("font-weight", 700)
    .text("In Poverty (%)");
    }).catch(function(error) {
      console.log(error);
});