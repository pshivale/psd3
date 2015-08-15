var arcIndex = 0;

var pie = function(){
    var dataset = [
                    {
                        value: 25,
                        inner: 
                        [
                            {
                                value: 10,
                                inner: 
                                [
                                    {
                                        value: 3
                                    },
                                    {
                                        value: 7
                                    }
                                   ]
                            },
                            {
                                value: 15
                            }
                        ]
                    },
                    {
                        value: 50,
                        inner:
                        [
                            {
                                value: 15
                            },
                            {
                                value: 35,
                                inner:
                                [
                                    {
                                        value: 5
                                    },
                                    {
                                        value: 30,
                                        inner:
                                        [
                                            {
                                                value:10
                                            },
                                            {
                                                value: 20
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ];
    drawPie(dataset);
}
var drawPie = function(dataset){
    arcIndex = 0;
    var svg = d3.select("#"+"chartContainer")
        .append("svg")
        .attr("id", "chartContainer"+"_svg")
        .attr("width", 600)
        .attr("height", 600);
    var color = d3.scale.category20();
    draw(svg, color, 0, 300, dataset, dataset, dataset.length, 0, 50, 0, 360*22/7/180,[0,0]);
}


var customArcTween = function(d) {
    var start = {
        startAngle: d.startAngle,
        endAngle: d.startAngle
    };
    var interpolate = d3.interpolate(start, d);
    return function(t) {
        return d.arc(interpolate(t));
    };
};

var textTransform = function(d) {
    return "translate(" + d.arc.centroid(d) + ")";
};
var textText = function(d) {
    return d.value;
};
var textTitle = function(d) {
    return d.value;
};

var draw = function(svg, color, colorIndex, totalRadius, dataset, originalDataset, originalDatasetLength, innerRadius, outerRadius, startAngle, endAngle, parentCentroid) {
    console.log("**** draw ****");
    console.log("dataset = " + dataset);
    if(dataset === null || dataset ===undefined){
        return;
    }
    console.log("parentCentroid = " + parentCentroid);
    // console.log("innerRadius = " + innerRadius);
    // console.log("outerRadius = " + outerRadius);
    console.log("colorIndex = " + colorIndex);
    // console.log("startAngle = " + startAngle);
    // console.log("endAngle = " + endAngle);

    var pie = d3.layout.pie();
    pie.value(function(d) {
        //console.log("d.value = " + d.value);
        return d.value;
    });
    pie.startAngle(startAngle)
        .endAngle(endAngle);
    
    var values = [];
    for(var i=0; i<dataset.length; i++){
        values.push(dataset[i].value);
        if(dataset[i].value===35){
            console.log("breakss now");
        }
    }
    console.log(values);

    var dblclick = function(d) {
        reDrawPie(d, originalDataset);
    };

    var arc = d3.svg.arc().innerRadius(innerRadius)
            .outerRadius(outerRadius);
    //Set up groups
    var clazz = "arc" + arcIndex++;

    var storeMetadataWithArc = function(d) {
        d.arc = arc;
        d.length = dataset.length;
    };

    var arcs = svg.selectAll("g." + clazz)
        .data(pie(dataset))
        .enter()
        .append("g")
        .attr("class", "arc " + clazz)
        .attr("transform",
                "translate(" + (totalRadius) + "," + (totalRadius) + ")")
        .on("dblclick", dblclick);

    //Draw arc paths
    var paths = arcs.append("path")
                .attr("fill", color(arcIndex));

    paths.each(storeMetadataWithArc);

    paths.transition()
        .duration(1000)
        .delay(1000*(arcIndex-1))
        .ease("linear")
        .attrTween("d", customArcTween);

    //paths.each(storeMetadataWithArc);

        //Labels
    var texts = arcs.append("text")
        .attr("x", function(){
            return parentCentroid[0];
        })
        .attr("y", function(){
            return parentCentroid[1];
        })
        .transition()
        .ease("linear")
        .duration(1000)
        .delay(1000*(arcIndex-1))
        .attr("transform", function(d){
            var a = [];
            a[0] = arc.centroid(d)[0] - parentCentroid[0];
            a[1] = arc.centroid(d)[1] - parentCentroid[1];
            return "translate(" + a + ")";
        })
        .attr("text-anchor", "middle")
        .text(textText)
        .attr("title", textTitle);
        
    
        
    console.log("paths.data() = " + paths.data());
    for(var j=0; j< dataset.length; j++){
        console.log("dataset[j] = " + dataset[j]);
        //console.log("paths.data()[j] = " + paths.data()[j]);
        if(dataset[j].inner !== undefined){
            draw(svg, color, ++colorIndex, totalRadius, dataset[j].inner, originalDataset, originalDatasetLength, innerRadius+50, outerRadius+50, paths.data()[j].startAngle, paths.data()[j].endAngle, arc.centroid(paths.data()[j]));
        }
    }


};

var zoomStack = [];

var reDrawPie = function(d, ds) {
    var tmp = [];
    d3.select("#"+"chartContainer"+"_svg").remove();
    //d3.select("#"+this.config.containerId+"_tooltip").remove();
    if (d.length == 1) {
        tmp = zoomStack.pop();
    } else {
        tmp.push(d.data);
        zoomStack.push(ds);
    }
    drawPie(tmp);
};