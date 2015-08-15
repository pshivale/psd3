drawPie = function(){
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
                                        value: 17
                                    },
                                    {
                                        value: 18
                                    }
                                ]
                            }
                        ]
                    }
                ];
    var svg = d3.select("#"+"chartContainer")
        .append("svg")
        .attr("id", "chartContainer"+"_svg")
        .attr("width", 600)
        .attr("height", 600);
    var color = d3.scale.category20();
    draw(svg, color, 0, 300, dataset, 0, 50, 0, 360*22/7/180);
}

var storeMetadataWithArc = function(d) {
        d.arc = arc;
        d.length = ds.length;
        d.parentDs = ds;
    };

draw = function(svg, color, colorIndex, totalRadius, dataset, innerRadius, outerRadius, startAngle, endAngle) {
    if(dataset === null || dataset ===undefined){
        return;
    }
    console.log("dataset = " + dataset);
    console.log("innerRadius = " + innerRadius);
    console.log("outerRadius = " + outerRadius);
    console.log("colorIndex = " + colorIndex);
    console.log("startAngle = " + startAngle);
    console.log("endAngle = " + endAngle);

    var pie = d3.layout.pie();
    pie.value(function(d) {
        console.log("d.value = " + d.value);
        return d.value;
    });
    pie.startAngle(startAngle)
        .endAngle(endAngle);
    
    var values = [];
    for(var i=0; i<dataset.length; i++){
        values.push(dataset[i].value);
    }
    console.log(values);

    var arc = d3.svg.arc().innerRadius(innerRadius)
            .outerRadius(outerRadius);
    //Set up groups
    var clazz = "arc" + colorIndex;
    var result = [];

    var arcs = svg.selectAll("g." + clazz)
        .data(pie(dataset))
        .enter()
        .append("g")
        .attr("class", "arc " + clazz)
        .attr("transform",
                "translate(" + (totalRadius) + "," + (totalRadius) + ")");

    //Draw arc paths
    paths = arcs.append("path")
                .attr("d", arc)
                .attr("fill", color(colorIndex));

    //paths.each(storeMetadataWithArc);


    for(var j=0; j< dataset.length; j++){
        console.log("paths.data()[j] = " + paths.data()[j]);
        if(paths.data()[j] !== undefined){
            draw(svg, color, ++colorIndex, totalRadius, dataset[j].inner, innerRadius+50, outerRadius+50, paths.data()[j].startAngle, paths.data()[j].endAngle);    
        }

    }


};
