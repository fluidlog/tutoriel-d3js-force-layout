var dataset = {
		dataset_nodes: [
                { name: "D3JS" },
                { name: "Tutoriel" },
        ],
        dataset_links: [
                { source: 0, target: 1 },
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
	                 .linkDistance([100])

var links = svg.selectAll("line")
		        .data(dataset.dataset_links)
		        .enter()
		        .append("line")
		        .style("stroke", "steelblue")
		        .style("stroke-width", 3);

var nodes = svg.selectAll("circle")
        .data(dataset.dataset_nodes)
        .enter()
        .append("circle")
        .attr("r", 20)
        .style("fill", "white")
        .style("stroke", "steelblue")
		.style("stroke-width", 3);

force.start();

force.on("tick", tick());

function tick() 
{
	links.attr("x1", function(d) { return d.source.x; })
	     .attr("y1", function(d) { return d.source.y; })
	     .attr("x2", function(d) { return d.target.x; })
	     .attr("y2", function(d) { return d.target.y; });
	
	nodes.attr("cx", function(d) { return d.x; })
	     .attr("cy", function(d) { return d.y; });	
}

