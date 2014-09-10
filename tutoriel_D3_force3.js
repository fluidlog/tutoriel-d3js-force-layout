var dataset = {
		dataset_nodes: [
                { id : "0", name: "D3JS" },
                { id : "1", name: "Tutoriel" },
                { id : "2", name: "Drag" },
                { id : "3", name: "Text" },
        ],
        dataset_links: [
                { source: 0, target: 1 },
                { source: 0, target: 2 },
                { source: 0, target: 3 },
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
	                 .charge([-500])
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
        .append("g")        		// <-- New!
        .attr("class", "node")      // <-- New!
		.call(force.drag);

nodes.append("circle")
		.attr("r", 20)
        .style("fill", "white")
        .style("stroke", "steelblue")
		.style("stroke-width", 3)

nodes.append("text")
		.attr("text-anchor", "middle")
		.style("font-size", "24px")
		.style("font-family", "Helvetica Neue, Helvetica, Arial, sans-serif;")
		.style("fill", "steelblue")
		.text(function(d) { return d.name; });

force.start();

force.on("tick", function(d) {return tick()} )

function tick() 
{
	links.attr("x1", function(d) { return d.source.x; })
	     .attr("y1", function(d) { return d.source.y; })
	     .attr("x2", function(d) { return d.target.x; })
	     .attr("y2", function(d) { return d.target.y; });
	
	nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
//	nodes.attr("cx", function(d) { return d.x; })
//    	 .attr("cy", function(d) { return d.y; });
}

