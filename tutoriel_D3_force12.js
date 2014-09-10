//Tutoriel D3 - Force Layout - Pan/Zoom

var dataset = {
		dataset_nodes: [
                { id:0, name: "Idea 1", rayon:50, type:"I" },
                { id:1, name: "Idea 2", rayon:50, type:"I" },
                { id:2, name: "Idea 3", rayon:50, type:"I" },
                { id:3, name: "Idea 4", rayon:50, type:"I" },
                { id:4, name: "Projet 1", rayon:50, type:"P" },
                { id:5, name: "Projet 2", rayon:50, type:"P" },
                { id:6, name: "Projet 3", rayon:50, type:"P" },
                { id:7, name: "Actor 1", rayon:50, type:"A" },
                { id:8, name: "Actor 2", rayon:50, type:"A" },
                { id:9, name: "Actor 3", rayon:50, type:"A" },
                { id:10, name: "Actor 4", rayon:50, type:"A" },
                { id:11, name: "Actor 5", rayon:50, type:"A" },
                { id:12, name: "Ressource 1", rayon:50, type:"R" },
                { id:13, name: "Ressource 2", rayon:50, type:"R" },
                { id:14, name: "Ressource 3", rayon:50, type:"R" },
        ],
        dataset_links: [
                { source: 0, target: 7 },
                { source: 0, target: 8 },
                { source: 0, target: 4 },
                { source: 0, target: 5 },
                { source: 1, target: 10 },
                { source: 1, target: 11 },
                { source: 2, target: 4 },
                { source: 3, target: 11 },
                { source: 4, target: 7 },
                { source: 4, target: 8 },
                { source: 4, target: 12 },
                { source: 4, target: 13 },
                { source: 5, target: 10 },
                { source: 5, target: 11 },
                { source: 5, target: 14 },
                { source: 6, target: 3 },
                { source: 6, target: 7 },
                { source: 6, target: 9 },
        ]
};

var n = 500,
	nodes,
	links;

var svg = d3.select("#chart")
			.append("svg")
			.attr("width", 800)
			.attr("height", 800);

var force = d3.layout.force()
	                 .nodes(dataset.dataset_nodes)
	                 .links(dataset.dataset_links)
	                 .size([800, 800])
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

nodes = svg.selectAll("g.node")
        .data(dataset.dataset_nodes)
        .enter()
        .append("g") 
        .attr("class", "node")
		.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
		.call(node_drag);

nodes.append("rect")
		.attr("x", -50)
		.attr("y", -22)
		.attr("width", 100)
		.attr("height", 50)
		.attr("rx", 15) //Gère les bords arrondis
		.attr("ry", 15) //Gère les bords arrondis
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
	.style("color","steelblue")
	.html(function(d) { return d.name })

fo.attr("transform", function(d) { return translateInMiddle(this)} )

force.on("tick", tick);

function tick() {
	  links.attr("x1", function(d) { return d.source.x; })
	       .attr("y1", function(d) { return d.source.y; })
	       .attr("x2", function(d) { return d.target.x; })
	       .attr("y2", function(d) { return d.target.y; });

	  nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
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
