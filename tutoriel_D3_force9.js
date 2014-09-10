//Tutoriel D3 - Force Layout - Neighbour

var dataset = {
		dataset_nodes: [
                { "id" : 0, "rayon": 60, "name": "Tutoriel D3JS", "select": 1, "url":"github.com/fluidlog"},
                { "id" : 1, "rayon": 50, "name": "1-Force layout", "select": 0, "url":"github.com/fluidlog"},
                { "id" : 2, "rayon": 40, "name": "2-Drag", "select": 0, "url":"github.com/fluidlog"},
                { "id" : 3, "rayon": 40, "name": "3-Text", "select": 0, "url":"github.com/fluidlog"},
                { "id" : 4, "rayon": 40, "name": "4-Fit", "select": 0, "url":"github.com/fluidlog"},
                { "id" : 5, "rayon": 40, "name": "5-Foreign Objects", "select": 0, "url":"github.com/fluidlog"},
                { "id" : 6, "rayon": 40, "name": "6-Static", "select": 0, "url":"github.com/fluidlog"},
                { "id" : 7, "rayon": 40, "name": "7-Static Drag", "select": 0, "url":"github.com/fluidlog"},
                { "id" : 8, "rayon": 40, "name": "8-Hover", "select": 0, "url":"github.com/fluidlog"},
                { "id" : 9, "rayon": 40, "name": "9-Neighbour", "select": 0, "url":"github.com/fluidlog"},
        ],
        dataset_links: [
                { "source": 1, "target": 2 },
                { "source": 1, "target": 3 },
                { "source": 3, "target": 4 },
                { "source": 3, "target": 5 },
                { "source": 1, "target": 6 },
                { "source": 6, "target": 7 },
                { "source": 1, "target": 8 },
                { "source": 1, "target": 9 },
        ]
};

var n = 500,
	nodes,
	links;

var svg = d3.select("#chart")
			.append("svg")
			.attr("width", 500)
			.attr("height", 500);

var force = d3.layout.force()
	                 .nodes(dataset.dataset_nodes)
	                 .links(dataset.dataset_links)
	                 .size([500, 500])
	                 .charge([-1000])
	                 .linkDistance([120])
var node_drag = d3.behavior.drag()
					.on("dragstart", dragstart)
					.on("drag", dragmove)
					.on("dragend", dragend);

force.start();
for (var i = n * n; i > 0; --i) force.tick();
force.stop();

links = svg.selectAll("line")
			.data(dataset.dataset_links)
			.enter()
			.append("line")
			.style("stroke", "steelblue")
			.style("stroke-width", 3)
			.attr("x1", function(d) { return d.source.x; })
			.attr("y1", function(d) { return d.source.y; })
			.attr("x2", function(d) { return d.target.x; })
			.attr("y2", function(d) { return d.target.y; });

nodes = svg.selectAll("circle")
		.attr("class", "nodecircle")
        .data(dataset.dataset_nodes)
        .enter()
        .append("g") 
        .attr("class", "node")
		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
		.call(node_drag);

/* Cercle qui apparait sur le hover */
nodes.append("circle")
		.attr("r", 0)
	    .attr("class", "CircleOptions")
		.style("fill", "transparent")
		.style("stroke", "steelblue")
		.style("stroke-opacity", ".5")
		.style("stroke-width", "15")
		.style("stroke-dasharray", "10,5")

		/* Option de déplacement */
		nodes.append("circle")
				.attr("cx", function(d) { return -d.rayon-5; })
				.attr("cy", function(d) { return -d.rayon-5; })
				.attr("r", 0)
			    .attr("class", "CircleF")
				.style("stroke", "steelblue")
				.attr("fill", "white")
				.style("stroke-opacity", ".5")
				.style("stroke-width", "2")

		nodes.append("svg:image")
	    		.attr("class", "ImageF")
				.attr('x', function(d) { return -d.rayon-15; })
				.attr('y', function(d) { return -d.rayon-15; })
				.attr('width', 20)
				.attr('height', 20)
				.style("visibility", "hidden")
				.attr("xlink:href","http://fluidlog.com/img/move_64.png")
				.style("cursor", "move")

		/* Option de lien */
		nodes.append("circle")
				.attr("cx", function(d) { return d.rayon+5; })
				.attr("cy", function(d) { return -d.rayon-5; })
				.attr("r", 0)
			    .attr("class", "CircleL")
				.style("stroke-opacity", ".5")
				.style("stroke", "steelblue")
				.attr("fill", "white")
				.style("fill-opacity", "1")
				.style("stroke-width", "2")

		nodes.append("svg:image")
				.on("click", openLink)
	    		.attr("class", "ImageL")
				.attr('x', function(d) { return d.rayon-5; })
				.attr('y', function(d) { return -d.rayon-15; })
				.attr('width', 20)
				.attr('height', 20)
				.style("visibility", "hidden")
				.style("cursor", "pointer")
				.attr("xlink:href","http://fluidlog.com/img/arrow_full_upperright_64.png")
				.append("title").text(function(d) { return d.url; })

		nodes.append("circle")
				.attr("class", "nodecircle")
				.attr("r", function(d) { return d.rayon })
		        .style("fill", function(d) { return d.select ? "yellow" : "white" })
		        .style("stroke", "steelblue")
				.style("stroke-width", 3)
				.on("click",click)
		
var fo = nodes.append("foreignObject")
			.style("pointer-events", "none") //Ne prend pas en compte le click sur le foreign object
			.attr("id", "fo")
			.attr("width", function(d) { return d.rayon*2; })
			.attr("height", function(d) { return d.rayon*2; })

fo.append("xhtml:body")
	.style("text-align","center")
	.append("div")
	.attr("class", "fotext")
	.style("margin", "0px auto")
	.style("font", "14px 'Helvetica Neue'")
	.style("overflow","auto")
	.html(function(d) { return d.name })

fo.attr("transform", function(d) { return translateInMiddle(this)} )

nodes.on("mouseover",function(d)
{
				//New!
				d3.select(this).select('.nodecircle')
							.style("opacity", fade(.2,"steelblue"))

				d3.select(this).select('.CircleOptions')
								.transition()
								.duration(300)
								.attr("r", function(d) { return d.rayon + 20; })

				d3.select(this).select('.CircleF')
								.transition()
								.duration(300)
								.attr("r", 15)

				d3.select(this).select('.ImageF')
								.transition()
								.duration(300)
								.style("visibility", "visible")

				d3.select(this).select('.ImageL')
								.transition()
								.duration(300)
								.style("visibility", "visible")

				d3.select(this).select('.CircleL')
								.transition()
								.duration(300)
								.attr("r", 15)
});
			 
nodes.on("mouseout", function(d)
{
				//New!
				d3.select(this).select('.nodecircle')
								.style("opacity", fade(1,"steelblue"))

				d3.select(this).select('.CircleOptions')
								.transition()
								.duration(300)
								.attr("r", 0)

				d3.select(this).select('.CircleF')
								.transition()
								.duration(300)
								.attr("r", 0)

				d3.select(this).select('.ImageF')
								.transition()
								.duration(300)
								.style("visibility", "hidden")

				d3.select(this).select('.ImageL')
								.transition()
								.duration(300)
								.style("visibility", "hidden")

				d3.select(this).select('.CircleL')
								.transition()
								.duration(300)
								.attr("r", 0)
});

force.on("tick", tick);

function tick() {
	  links.attr("x1", function(d) { return d.source.x; })
	       .attr("y1", function(d) { return d.source.y; })
	       .attr("x2", function(d) { return d.target.x; })
	       .attr("y2", function(d) { return d.target.y; });

	  nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

var linkedByIndex = {};
dataset.dataset_links.forEach(function(d) {
    linkedByIndex[d.source.index + "," + d.target.index] = 1;
});

function isConnected(a, b) {
    return linkedByIndex[a.index + "," + b.index] || linkedByIndex[b.index + "," + a.index] || a.index == b.index;
}

function fade(opacity,color) 
{
    return function(d) 
    {
    	nodes.select(".nodecircle").style("opacity", function(o) 
				{
					return isConnected(d, o) ? 1 : opacity;
				})
		
//		.style("stroke", function(o) 
//				{
//					return isConnected(d, o) ? color : "#DDD";
//				});

		links.style("stroke-opacity", function(o) {
            return o.source === d || o.target === d ? 1 : opacity;
        })
        
        .style("stroke", function(o) {
            return o.source === d || o.target === d ? color : color ;
        });
    }
}

function openLink(d) 
{
	window.open("//"+d.url)
}

function getFontSize(text,r)
{
	var fontsize = r/2 + "px";
	return fontsize ; 
}

function translateInMiddle(object) 
{ 
	bbox = object.getBBox();
	return "translate(" + [ -bbox.width/2, -bbox.height/8 ] + ")";
}

function click(d, i)
{ 
	if (d3.event.defaultPrevented) return;
	d3.select(this).classed("fixed", d.fixed = false)
					.style("stroke-width", 3);
}

function dragstart(d, i) {
	force.stop();
}

function dragmove(d, i) {
	d.px += d3.event.dx;
	d.py += d3.event.dy;
	d.x += d3.event.dx;
	d.y += d3.event.dy; 
	tick(); // this is the key to make it work together with updating both px,py,x,y on d !
}

function dragend(d, i) {
	d3.select(this).classed("fixed", d.fixed = true)
					.select(".nodecircle").style("stroke-width", 5);
	tick();
	force.resume();
}
