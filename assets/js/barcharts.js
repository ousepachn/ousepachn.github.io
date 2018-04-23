var svg = d3.select("body").select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]),
    color=d3.scaleLinear().range(['green', 'orange'])
                          ;

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
d3.csv("/assets/data/freq.csv", function(d) {
  d.frequency = +d.frequency;
  d.year=+d.year;
  console.log(d.year,d.frequency)
  return d;
}, function(error, data) {
  if (error) throw error;

  color.domain([d3.min(data,function(d) { return d.year; }),d3.max(data,function(d) { return d.year; })]);
  // console.log(data.map(function(d) { return d.year; }))
  x.domain(data.map(function(d) { return d.year; }));
  y.domain([0, d3.max(data, function(d) { return d.frequency; })]);



  g.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")  
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

  g.append("g")
      .attr("class", "axis axis--y")
      .call(d3.axisLeft(y).ticks(10))
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Frequency");

  g.selectAll(".bar")
    .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.year); })
      .attr("y", height-10)
      .attr("width", x.bandwidth())
      .attr("height",10)
      .attr("fill",function(d){return color(d.year)});
  
  g.selectAll(".bar").transition()
    .duration(500)
    .delay(function(d,i){console.log(i);return 50* i;})
    .attr("height",function(d) { return height - y(d.frequency); })
    .attr("y", function(d) { return y(d.frequency); })
});