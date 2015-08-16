
var psd3 = psd3 || {};

var arcIndex = 0;

psd3.Pie = function(config){
    psd3.Graph.call(this, config);
    this.zoomStack = [];
    this.drawPie(config.data);
}

psd3.Pie.prototype = Object.create(psd3.Graph.prototype);

psd3.Pie.prototype.constructor = psd3.Pie;

psd3.Pie.prototype.findMaxDepth = function(dataset){
    if(dataset === null || dataset === undefined){
        return 0;
    }
    var currentLevel;
    var maxOfInner=0;
    for(var i=0;i<dataset.length;i++){
        var maxInnerLevel = this.findMaxDepth(dataset[i].inner);
        if(maxOfInner<maxInnerLevel){
            maxOfInner = maxInnerLevel;
        }
    }
    currentLevel = 1 + maxOfInner;
    return currentLevel;
}

psd3.Pie.prototype.mouseover = function(d) {
        d3.select("#"+_this.tooltipId)
            .style("left", d3.event.clientX + "px")
            .style("top", d3.event.clientY + "px")
            .select("#value")
            .html(_this.config.tooltip(d.data, _this.config.label));
        d3.select("#" + _this.tooltipId).classed("psd3Hidden", false);
    };
psd3.Pie.prototype.mouseout = function() {
        d3.select("#" + _this.tooltipId).classed("psd3Hidden", true);
    };

psd3.Pie.prototype.drawPie = function(dataset){
    _this = this;
    arcIndex = 0;
    var width = 400;
    var height = 400;
    var svg = d3.select("#"+_this.config.containerId)
        .append("svg")
        .attr("id", _this.config.containerId+"_svg")
        .attr("width", width)
        .attr("height", height)
        .style("background-color", "#eee");
    _this.tooltipId = _this.config.containerId+"_tooltip";
    var tooltipDiv = d3.select("#"+_this.config.containerId).append("div")
        .attr("id", _this.tooltipId)
        .attr("class", "psd3Hidden psd3Tooltip");
    tooltipDiv.append("p")
        .append("span")
        .attr("id", "value")
        .text("100%");
    // to contain pie cirlce
    var radius;
    if(width>height){
        radius = width/2;
    }else{
        radius = height/2;
    }
    var innerRadius = 50;
    var depth = _this.findMaxDepth(dataset);
    var outerRadius = innerRadius + (radius-innerRadius)/depth;
    var color = d3.scale.category20();
    var originalOuterRadius = outerRadius;
    var radiusDelta = outerRadius - innerRadius;
    _this.draw(svg, color, 0, radius, dataset, dataset, dataset.length, innerRadius, outerRadius, radiusDelta, 0, 360*22/7/180,[0,0]);
}


psd3.Pie.prototype.customArcTween = function(d) {
    var start = {
        startAngle: d.startAngle,
        endAngle: d.startAngle
    };
    var interpolate = d3.interpolate(start, d);
    return function(t) {
        return d.arc(interpolate(t));
    };
};

psd3.Pie.prototype.textTransform = function(d) {
    return "translate(" + d.arc.centroid(d) + ")";
};

psd3.Pie.prototype.textTitle = function(d) {
    return d.value;
};

psd3.Pie.prototype.draw = function(svg, color, colorIndex, totalRadius, dataset, originalDataset, originalDatasetLength, innerRadius, outerRadius, radiusDelta, startAngle, endAngle, parentCentroid) {
    _this = this;
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

    psd3.Pie.prototype.textText = function(d) {
        return _this.config.label(d);
    };

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
        _this.reDrawPie(d, originalDataset);
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

    paths.on("mouseover", _this.mouseover);

    paths.on("mouseout", _this.mouseout);

    paths.each(storeMetadataWithArc);

    paths.transition()
        .duration(1000)
        .delay(1000*(arcIndex-1))
        .ease("linear")
        .attrTween("d", _this.customArcTween);

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
        .text(_this.textText)
        .attr("title", _this.textTitle);
        
    
        
    console.log("paths.data() = " + paths.data());
    for(var j=0; j< dataset.length; j++){
        console.log("dataset[j] = " + dataset[j]);
        //console.log("paths.data()[j] = " + paths.data()[j]);
        if(dataset[j].inner !== undefined){
            _this.draw(svg, color, ++colorIndex, totalRadius, dataset[j].inner, originalDataset, originalDatasetLength, innerRadius+radiusDelta, outerRadius+radiusDelta, radiusDelta, paths.data()[j].startAngle, paths.data()[j].endAngle, arc.centroid(paths.data()[j]));
        }
    }


};



psd3.Pie.prototype.reDrawPie = function(d, ds) {
    var tmp = [];
    d3.select("#"+_this.config.containerId+"_svg").remove();
    //d3.select("#"+this.config.containerId+"_tooltip").remove();
    if (d.length == 1) {
        tmp = _this.zoomStack.pop();
    } else {
        tmp.push(d.data);
        _this.zoomStack.push(ds);
    }
    _this.drawPie(tmp);
};