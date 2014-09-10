//Tutoriel D3 - Force Layout - Foreign objects

var dataset = {
		dataset_nodes: [
                { id : 0, rayon: 50, name: "Tutoriel D3JS", select: 0 },
                { id : 1, rayon: 40, name: "1-Force layout", select: 0 },
                { id : 2, rayon: 30, name: "2-Drag", select: 0 },
                { id : 3, rayon: 30, name: "3-Text", select: 0 },
                { id : 4, rayon: 30, name: "4-Fit", select: 0 },
                { id : 5, rayon: 40, name: "5-Foreign Objects", select: 1 },
        ],
        dataset_links: [
                { source: 1, target: 2 },
                { source: 1, target: 3 },
                { source: 3, target: 4 },
                { source: 3, target: 5 },
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
	                 .start();

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

//Création d'un foreinObject SVG
var fo = nodes.append("foreignObject")
			.attr("id", "fo")
			.attr("width", function(d) { return d.rayon*2; })
			.attr("height", function(d) { return d.rayon*2; })

fo.append("xhtml:body")
	.style("text-align","center")
	.append("div")
	.attr("class", "fotext")
	.style("margin", "0px auto")
	.style("font", "14px 'Helvetica Neue'")
	.style("border","1px dotted #A00")
	.style("overflow","auto")
	.html(function(d) { return d.name })

//Translation du foreign object au milieu du cercle
fo.attr("transform", function(d) { return translateInMiddle(this)} )

force.on("tick", function()
{
	links.attr("x1", function(d) { return d.source.x; })
	     .attr("y1", function(d) { return d.source.y; })
	     .attr("x2", function(d) { return d.target.x; })
	     .attr("y2", function(d) { return d.target.y; });
	
	nodes.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
})


function getFontSize(text,r) // <-- New!
{
	var fontsize = r/2 + "px";
	return fontsize ; 
}

function translateInMiddle(object) 
{ 
	bbox = object.getBBox();
	return "translate(" + [ -bbox.width/2, -bbox.height/8 ] + ")";
}

