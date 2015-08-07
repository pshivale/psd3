/**
 * 
 */
var psd3 = psd3 || {};

psd3.Pie = function(config) {
    psd3.Graph.call(this, config);
    this.zoomStack = new Array();
    var pos = "top";
    if(this.config.heading !== undefined && this.config.heading.pos !== undefined){
        pos = this.config.heading.pos;
    }
    if(pos=="top"){
        this.setHeading();    
    }
    this.drawPie(config.data);
    if(pos=="bottom"){
        this.setHeading();    
    }
}

psd3.Pie.prototype = Object.create(psd3.Graph.prototype);

psd3.Pie.prototype.constructor = psd3.Pie;

psd3.Pie.prototype.setHeading = function(){
    if(this.config.heading !== undefined){
        d3.select("#"+this.config.containerId)
            .append("div")
            .style("text-align","center")
            .style("width", ""+this.config.width+"px")
            .style("padding-top","20px")
            .style("padding-bottom","20px")
            .append("strong")
            .text(this.config.heading.text);
    }
}

psd3.Pie.prototype.getDepth = function(dset) {
    //console.log("ds = " + ds);
    var ds = dset[0];
    var depth = 0;
    while (ds != null || ds !== undefined) {
        //console.log("ds.inner = " + ds.inner);
        //console.log("depth = " + depth);
        ds = ds.inner[0];
        //console.log("ds = " + ds);
        depth++;
    }
    //console.log("depth = " + depth);
    return depth;
}

psd3.Pie.prototype.setDataSet = function(dset, depthneeded, currentDepth, ds) {
    if (dset === null || dset === undefined) return ds;
    if (depthneeded === currentDepth) {
        for (var i = 0; i < dset.length; i++) {
            //console.log("ds = " + ds);
            ds.push(dset[i]);
        }
        return ds;
    } else {
        for (var i = 0; i < dset.length; i++) {
            ds = this.setDataSet(dset[i].inner, depthneeded, currentDepth + 1, ds);
        }
        return ds;
    }
}
psd3.Pie.prototype.drawPie = function(dataset) {
    var object = this;
    var width, height, transitionDuration, value, label, tooltip, donutRadius;
    if (config.width !== undefined) {
        width = config.width;
    } else {
        width = this.defaults.width;
    }
    if (config.height !== undefined) {
        height = config.height;
    } else {
        height = this.defaults.height;
    }
    if (config.transitionDuration !== undefined) {
        transitionDuration = config.transitionDuration;
    } else {
        transitionDuration = this.defaults.transitionDuration;
    }
    if (config.value !== undefined) {
        value = config.value;
    } else {
        value = this.defaults.value;
    }
    if (config.label !== undefined) {
        label = config.label;
    } else {
        label = this.defaults.label;
    }
    if (config.tooltip !== undefined) {
        tooltip = config.tooltip;
    } else {
        tooltip = this.defaults.tooltip;
    }
    if (config.donutRadius !== undefined) {
        donutRadius = config.donutRadius;
    } else {
        donutRadius = this.defaults.donutRadius;
    }

    var arcsArray = [];
    //Easy colors accessible via a 10-step ordinal scale
    var color = d3.scale.category20();
    var tooltipId = object.config.containerId+"_tooltip";
    //Create SVG element
    var svg = d3.select("#"+object.config.containerId)
        .append("svg")
        .attr("id", object.config.containerId+"_svg")
        .attr("width", width)
        .attr("height", height);
    var tooltipDiv = d3.select("#"+object.config.containerId).append("div")
        .attr("id", tooltipId)
        .attr("class", "psd3Hidden psd3Tooltip");
    tooltipDiv.append("p")
        .append("span")
        .attr("id", "value")
        .text("100%");

    var pie = d3.layout.pie();
    pie.value(function(d) {
        return d[value];
    });
    pie.sort(null);

    var outerRadius = width / 2;
    var innerRadius = 0;
    var depth = this.getDepth(dataset);

    var prevDsLength = 0;
    for (var i = depth; i >= 1; i--) {
        var outRad = outerRadius / 3 * i;
        var inRad = outRad - outerRadius / 3;
        //console.log("outRad = " + outRad);
        var arc = d3.svg.arc().innerRadius(inRad)
            .outerRadius(outRad);
        //Set up groups
        var clazz = "arc" + i;
        var result = [];
        var ds = this.setDataSet(dataset, i, 1, result);
        //console.log("ds* = " + ds);
        var arcs = svg.selectAll("g." + clazz)
            .data(pie(ds))
            .enter()
            .append("g")
            .attr("class", "arc " + clazz)
            .attr("transform",
                "translate(" + outerRadius + "," + outerRadius + ")")
            .on("dblclick", function(d) {
                object.reDrawPie(d, ds);
            });;

        //Draw arc paths
        paths = arcs.append("path").attr("fill", function(d, i) {
            return color(i + prevDsLength);
        });

        paths.on("mouseover", function(d) {
            d3.select("#"+tooltipId)
                .style("left", d3.event.clientX + "px")
                .style("top", d3.event.clientY + "px")
                .select("#value")
                .html(tooltip(d.data, label));
            d3.select("#" + tooltipId).classed("psd3Hidden", false);
        });

        paths.on("mouseout", function() {
            d3.select("#" + tooltipId).classed("psd3Hidden", true);
        })

        paths.each(function(d) {
            d.arc = arc;
            d.length = ds.length;
            d.parentDs = ds;
        });

        paths
            .transition()
            .duration(transitionDuration)
            .ease("linear")
            .attrTween("d", function(d) {
                var start = {
                    startAngle: 0,
                    endAngle: 0
                };
                var interpolate = d3.interpolate(start, d);
                return function(t) {
                    return d.arc(interpolate(t));
                };
            });
        prevDsLength += ds.length;

        arcsArray[i] = arcs;
    }

    for (var i = 1; i <= depth; i++) {
        //Labels
        arcsArray[i].append("text")
            .transition()
            .ease("linear")
            .duration(transitionDuration)
            .delay(transitionDuration)
            .attr("transform", function(d) {
                return "translate(" + d.arc.centroid(d) + ")";
            }).attr("text-anchor", "middle")
            .text(function(d) {
                return label(d.data);
            })
            .attr("title", function(d) {
                return d.data[value];
            });
    }

}

psd3.Pie.prototype.reDrawPie = function(d, ds) {
    var tmp = [];
    d3.select("#"+this.config.containerId+"_svg").remove();
    d3.select("#"+this.config.containerId+"_tooltip").remove();
    if (d.length == 1) {
        tmp = this.zoomStack.pop();
    } else {
        tmp.push(d.data);
        this.zoomStack.push(ds);
    }
    this.drawPie(tmp);
}