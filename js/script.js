var margin = {top: 20, right: 80, bottom: 30, left: 50},
    width = $(".chart").width()  - margin.left - margin.right,
    height = 800  - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y%m%d").parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.hpi); });

var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("js/hpi.csv", function(error, data) {
  color.domain(d3.keys(data[7]).filter(function(key) { return key !== "period"; }));

console.log(data);

 data.forEach(function(d) {
    d.period = parseDate(d.period);
  });

  var cities = color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d.period, hpi: +d[name]};
      })
    };
  });

  x.domain(d3.extent(data, function(d) { return d.period; }));

  y.domain([
    d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.hpi; }); }),
    d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.hpi; }); })
  ]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("HPI");

  var city = svg.selectAll(".city")
      .data(cities)
    .enter().append("g")
      .attr("class", "city");

  city.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) { return color(d.name); });

  city.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.hpi) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });

      svg.selectAll(".dot")
  .data(data)
  .enter()
  .append("circle")
  .attr("cx", function(d){
    return x(d.period);
  })

.attr("cy", function(d){
    return y(d.Columbia);
  })

.attr("r", 3)
.on("mouseover",function(d){
  var dispDate = moment(d.period).format("MMM, YYYY");
  $(".tt").html(
"<div class='date'>"+dispDate+"</div>"+
"<div class='val'>"+"HPI:"+d.Columbia+"</div>"

    );
  $(".tt").show();
})
.on("mouseout", function(d){
  $(".tt").hide();
})

.on("mousemove", function(d){
  var pos = d3.mouse(this);

  var left = pos[0] + margin.left+ 15 - $(".tt").width() -10;
  var top = pos[1] + margin.top - $(".tt").height() - 10;

$(".tt").css({
  "left" : left + "px",  
  "top" : top + "px"
})

})



});