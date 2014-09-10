//Tutoriel D3 - Force Layout - Fit text

var dataset = {
		dataset_nodes: [
                { id : 0, rayon: 70, name: "Tutoriel D3JS", select: 0 },
                { id : 1, rayon: 50, name: "1-Force layout", select: 0 },
                { id : 2, rayon: 40, name: "2-Drag", select: 0 },
                { id : 3, rayon: 40, name: "3-Text", select: 0 },
                { id : 4, rayon: 40, name: "4-Fit", select: 1 },
        ],
        dataset_links: [
                { source: 1, target: 2 },
                { source: 1, target: 3 },
                { source: 3, target: 4 },
        ]
};

var svg = d3.select("#chart")
			.append("svg")
			.attr("width", 300)
			.attr("height", 300);

var force = d3.layout.force()
	                 .nodes(dataset.dataset_nodes)
	                 .links(dataset.dataset_links)
	                 .size([300, 300])
	                 .charge([-1000])
	                 .linkDistance([200])

var links = svg.selectAll("line")
			.data(dataset.dataset_links)
			.enter()
			.append("line")
			.style("stroke", "steelblue")
			.style("stroke-width", 3);

var nodes = svg.selectAll("circle")
        .data(dataset.dataset_nodes)
        .enter()
        .append("g") 
        .attr("class", "node")
		.call(force.drag);

nodes.append("circle")
		.attr("r", function(d) { return d.rayon })
        .style("fill", function(d) { return d.select ? "yellow" : "white" })
        .style("stroke", "steelblue")
		.style("stroke-width", 3)

nodes.append("text")
		.attr("text-anchor", "middle")
		.style("font-size", "24px")
		.style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif;")
		.style("fill", "steelblue")
		.text(function(d) { return d.name; })
		.style("font-size", function(d) { return getTextSize(this, d.rayon) })       		// <-- New!
	    //Recentre un peu vers le bas
	    .attr("dy", ".35em")

force.start();

force.on("tick", function(d) {return tick()} )

function tick() 
{
	links.attr("x1", function(d) { return d.source.x; })
	     .attr("y1", function(d) { return d.source.y; })
	     .attr("x2", function(d) { return d.target.x; })
	     .attr("y2", function(d) { return d.target.y; });
	
	nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
}

function getTextSize(object,r)        		// <-- New!
{
	var textlength = object.getComputedTextLength();
	var fontsize = Math.min(2 * r, (2 * r - 8) / textlength * 24) + "px";
	return fontsize ; 
}
