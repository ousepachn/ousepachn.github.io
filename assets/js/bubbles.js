(function(){
	var width=1250,
	height = 1300;

	var svg = d3.select("#chart")
	.append("svg")
	// .attr("height",height)
	// .attr("width",width)
	.attr("viewBox", "0 0 "+width+" "+height)
  	.attr("preserveAspectRatio", "xMinYMin meet")
	.append("g")
	.attr("transform","translate(" + width/2 + "," + height/2 + ")")
	

	d3.selection.prototype.moveToBack = function() {  
        return this.each(function() { 
            var firstChild = this.parentNode.firstChild; 
            if (firstChild) { 
                this.parentNode.insertBefore(this, firstChild); 
            } 
        });
    };


	d3.queue()
	.defer(d3.csv,"/assets/data/architect.csv")
	.await(ready)

	var div = d3.select("body").append("div")
		.attr("class","tooltip")
		.style("opacity",0)

	var e_box = d3.select("body").append("div")
		.attr("class","e_box")
		.style("opacity",0)

	var lines=[ ["25 Floors",height *2/5],["50 Floors",height *1/7],["75 Floors", - height *1/7],["Skywards", - height *2/5]]
	var gyan=["<strong>Architect of Chicago</strong></br>" 
					+"Bubbles represent architects who've</br>" 
					+"built the Chicago Skyline.  From 1990 to 2023,<br/>"
					+"these 100+ architects have designed over<br/>"
					+"500 buildings for the city.<br/>"
					+"<i>Click on a bubble to view Architect's work</i>",
				"<strong>The Impossible Builders</strong></br>" 
					+"Designed to be the headliners</br>" 
					+"of the Chicago Skyline.  <br/>"
					+"Sample buildings include the <i>Willis Tower, Aqua</i><br/>"
					+"and <i>Tribune East, Vista Towers</i> (Upcoming)."
					+"<abc style=font-size:70%;><br/>Click on a bubble to view Architect's work</abc>",
				"<strong>The Tall and Beautiful</strong></br>" 
					+"Architectural marvels so complex</br>" 
					+"the engineeering is almost magic.<br/>"
					+"Sample buildings include <i>150 North Riverside</i><br/>"
					+"<i>Marina City</i> and <i>300 North LaSalle</i>."
					+"<abc style=font-size:70%;><br/>Click on a bubble to view Architect's work</abc>",
				"<strong>Monuments in Stone</strong></br>" 
					+"Each building a piece of history,</br>" 
					+"pushing the edge of engineering in<br/>"
					+"respective times.<br/>"
					+"Sample buildings include the <i>Wrigley building</i><br/>"
					+"and the <i>Carbide & Carbon</i> building."
					+"<abc style=font-size:70%;><br/>Click on a bubble to view Architect's work</abc>",
				"<strong>Everyday masterpieces</strong></br>" 
					+"Structures not known for their</br>" 
					+"height, but each cruicial to <br/>"
					+"the history of the city.<br/>"
					+"Sample buildings include the <i>University Club</i><br/>"
					+"and the <i>U.S Post Office</i> building."
					+"<abc style=font-size:70%;><br/>Click on a bubble to view Architect's work</abc>"
	]



	function ready(error,datapoints) {

	function dragstarted() {
		  if (!d3.event.active) simulation.alphaTarget(1).restart();
		  d3.event.subject.fx = d3.event.subject.x;
		  d3.event.subject.fy = d3.event.subject.y;
		}
		
	function dragged() {
		  d3.event.subject.fx = d3.event.x;
		  d3.event.subject.fy = d3.event.y;
		}
		
	function dragended() {
		  if (!d3.event.active) simulation.alphaTarget(0);
		  d3.event.subject.fx = null;
		  d3.event.subject.fy = null;
		}
	function dragsubject() {
    return simulation.find(d3.event.x, d3.event.y);
  		}		

		var flg_split=0;
		var pg_title=svg.append("text")
			.attr("class","pg_title")
			.attr("y",-1*height/2 +50)
			.attr("text-anchor","middle")
			.text("Architects of Second City")


    

		var forceySplit=d3.forceY(
			function (d) {
				// console.log(d.f_max)
				if(d.f_max<25){
					return 1*height*2/5;
				}
				else if(d.f_max<50){
					return 1*height*1/7;
				}
				else if(d.f_max<75){
					return -1 *height*1/7;
				}
				else return  -1 *height*2/5;
			}).strength(0.05)
		var forcexSplit=d3.forceX().strength(0.01)

		var forcexCombine=d3.forceX().strength(0.03)
		var forceyCombine=d3.forceY().strength(0.03)
	
		var simulation =d3.forceSimulation()
		.force("x",forcexCombine)
		.force("y",forceyCombine)
		.force("collide",d3.forceCollide(function(d){
			return radiusScale(d.buildings)+1;
		}))

		var colorScale=d3.scaleSequential(d3.interpolateReds)
    	.domain([-200, 800])


		var radiusScale = d3.scaleSqrt()
			.domain([0,d3.max(datapoints,function(d){return d.buildings;})])
			.range([10,32])
		
		d3.select("#chart").on("click",function(){
			console.log("hello box")
		})

		var circles = svg.selectAll(".architect")
		.data(datapoints)
		.enter().append("circle")
		.attr("class","architect")
		.attr("r",function(d){
			return radiusScale(d.buildings)
			})
		.attr("fill",function(d){
			

			return colorScale((d.year+1)*2 );
		})

		.on("click",function(d){
			console.log(d);
			d3.event.stopPropagation();}
			)
		.on("mouseover",function(d){
			d3.select(this).transition()
				.duration(200)
				.attr("fill","orange");
			div.transition()
				.duration(200)
				.style("opacity",0.9);
			div.html("<strong style=font-size:150%;>" + d.architect +"</strong><br/> Buildings Designed: " +d.buildings+"<br/> Last Building Yr: " +d.max_c)
				.style("left",(d3.event.pageX)+"px")
				.style("top",(d3.event.pageY )+"px");

			e_box.transition()
				.duration(200)
				.style("opacity",0.9);
			e_box.html(function()
				{
				if(flg_split===0)
					{
					return gyan[0];
					}
				else 
					{
					if (d.f_max>75)
						{
							return gyan[1];
						}
						else if (d.f_max>50)
						{
							return gyan[2];
						}
						else if (d.f_max>25)
						{
							return gyan[3];
						}
						
						else return gyan[4];
					}

				}
			)
				.style("top",function(){
					// console.log(flg_split)
					if (flg_split===1) {
						// console.log(d.f_max);
						if (d.f_max>75){
								return (40 )+"px";
							}
						else if (d.f_max>50){
								return (40 + height*2/7)+"px";
							}
						else if (d.f_max>25){
								return (55 + height*4/7)+"px";
							}
						
						else return (55 + height*6/7)+"px";
						}
					else return height/2 +"px"

						})
				.style("right","0");
				})
		.on("mousemove", function() {
          return div.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
          	})
		
		.on("mouseout",function(d){
			d3.select(this).transition()
				.duration(500)
				.attr("fill",function(d){return colorScale(d.year +1)});
			div.transition()
			.duration(500)
			.style("opacity",0);
			e_box.transition()
			.duration(500)
			.style("opacity",0);
			})

		.call(
			 d3.drag()
        				
        				.subject(dragsubject)
        				.on("start", dragstarted)
        				.on("drag", dragged)
        				.on("end", dragended)
        	
    		);


		d3.select("#split").on('click', function(){
			console.log("split stuff")
			flg_split=1;
			console.log(flg_split)
			simulation
				.force("x",forcexSplit)
			 	.force("y",forceySplit)
				.alphaTarget(0.9)
				.restart()
			setTimeout(function(){simulation.alphaTarget(0);},1500);


			var ht_label=svg.selectAll(".ht_lbl")
				.data(lines)
				.enter().append("text")
				.attr("class","ht_lbl")
				.attr("x",-1*width/2.5)
				.attr("y",function(d){return d[1]-5;})
				.text(function(d){return d[0];})
		        .attr("fill", "silver");

			var ln = svg.selectAll(".lines")
			.data(lines)
			.enter().append("line")
			.attr("class","lines")
			.attr("x1",-1*width/2.5)
			.attr("x2",width/3)
			.attr("y1",function(d){return d[1];})
			.attr("y2",function(d){return d[1];})
			.style("stroke-width","2px")
			.style("stroke","silver")
			ln.moveToBack()
		})

		d3.select("#combine").on('click', function(){
			flg_split=0;
			console.log("combine stuff")
			svg.selectAll(".lines").remove()
			svg
			.selectAll(".ht_lbl").remove()
			simulation
				.force("x",forcexCombine)
				.force("y",forceyCombine)
				.alphaTarget(0.9)
				.restart()
			setTimeout(function(){simulation.alphaTarget(0);},1000);
		
		})
		simulation.nodes(datapoints)
			.alphaTarget(0)
			.on('tick',ticked) 


		function ticked() {
			circles
				.attr ("cx",function(d){
					return d.x
				})
				.attr("cy",function(d){
					return d.y 
				})

		}
	

	}




})();
