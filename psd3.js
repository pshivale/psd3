/**
 * 
 */
 var psd3 = psd3 || {};
psd3.Graph = function(config) {
    var _this = this;
    this.config = config;
    this.defaults = {
        width: 400,
        height: 400,
        value: "value",
        inner: "inner",
        label: function(d) {
            return d.label;
        },
        tooltip: function(d) {
            if (_this.config.value !== undefined) {
                return d[_this.config.value];
            } else {
                return d.value;
            }

        },
        transitionDuration: 1000,
        donutRadius: 0
    };
    /*console.log("before defaults");
    for(var property in config){
        console.log(property);
    }*/
    for(var property in this.defaults){
        if(this.defaults.hasOwnProperty(property)){
            if(!config.hasOwnProperty(property)){
                config[property] = this.defaults[property];
            }
        }
    }
    /*console.log("after defaults");
    for(var property in config){
        console.log(property);
    }*/
};
/**
 * 
 */
var psd3 = psd3 || {};

psd3.Pie = function(config) {
    psd3.Graph.call(this, config);
    this.zoomStack = [];
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
};

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
};

psd3.Pie.prototype.getDepth = function(dset) {
    //console.log("ds = " + ds);
    var ds = dset[0];
    var depth = 1;
    while (ds !== null && ds !== undefined && ds[this.config.inner] !== undefined && ds[this.config.inner].length > 0) {
        //console.log("ds[this.config.inner] = " + ds[this.config.inner]);
        //console.log("depth = " + depth);
        ds = ds[this.config.inner][0];
        //console.log("ds = " + ds);
        depth++;
    }
    //console.log("depth = " + depth);
    return depth;
};

psd3.Pie.prototype.setDataSet = function(dset, depthneeded, currentDepth, ds) {
    if (dset === null || dset === undefined) return ds;
    if (depthneeded === currentDepth) {
        for (var i = 0; i < dset.length; i++) {
            //console.log("ds = " + ds);
            ds.push(dset[i]);
        }
        return ds;
    } else {
        for (var j = 0; j < dset.length; j++) {
            ds = this.setDataSet(dset[j][this.config.inner], depthneeded, currentDepth + 1, ds);
        }
        return ds;
    }
};

psd3.Pie.prototype.drawPie = function(dataset) {
    var object = this;
    var arcsArray = [];
    //Easy colors accessible via a 10-step ordinal scale
    var color = d3.scale.category20();
    var tooltipId = object.config.containerId+"_tooltip";
    //Create SVG element
    var svg = d3.select("#"+object.config.containerId)
        .append("svg")
        .attr("id", object.config.containerId+"_svg")
        .attr("width", object.config.width)
        .attr("height", object.config.height);
    var tooltipDiv = d3.select("#"+object.config.containerId).append("div")
        .attr("id", tooltipId)
        .attr("class", "psd3Hidden psd3Tooltip");
    tooltipDiv.append("p")
        .append("span")
        .attr("id", "value")
        .text("100%");

    var pie = d3.layout.pie();
    pie.value(function(d) {
        return d[object.config.value];
    });
    pie.sort(null);

    var outerRadius = object.config.width / 2;
    var depth = this.getDepth(dataset);

    var prevDsLength = 0;
    var dblclick = function(d) {
        object.reDrawPie(d, ds);
    };
    var arcfill = function(d, i) {
        return color(i + prevDsLength);
    };
    var mouseover = function(d) {
        d3.select("#"+tooltipId)
            .style("left", d3.event.clientX + "px")
            .style("top", d3.event.clientY + "px")
            .select("#value")
            .html(object.config.tooltip(d.data, object.config.label));
        d3.select("#" + tooltipId).classed("psd3Hidden", false);
    };
    var mouseout = function() {
        d3.select("#" + tooltipId).classed("psd3Hidden", true);
    };
    var storeMetadataWithArc = function(d) {
        d.arc = arc;
        d.length = ds.length;
        d.parentDs = ds;
    };
    var customArcTween = function(d) {
        var start = {
            startAngle: 0,
            endAngle: 0
        };
        var interpolate = d3.interpolate(start, d);
        return function(t) {
            return d.arc(interpolate(t));
        };
    };
    for (var i = depth; i >= 1; i--) {
        //console.log("i = " + i);
        var outRad = object.config.donutRadius + (((outerRadius-object.config.donutRadius) / depth) * i);
        //console.log("outRad = " + outRad);
        var inRad = outRad - outerRadius / depth;
        //console.log("inRad = " + inRad);
        if(i==1){
            inRad = object.config.donutRadius;
        }
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
            .on("dblclick", dblclick);

        //Draw arc paths
        paths = arcs.append("path").attr("fill", arcfill);

        paths.on("mouseover", mouseover);

        paths.on("mouseout", mouseout);

        paths.each(storeMetadataWithArc);

        paths
            .transition()
            .duration(object.config.transitionDuration)
            .ease("linear")
            .attrTween("d", customArcTween);
        prevDsLength += ds.length;

        arcsArray[i] = arcs;
    }

    var textTransform = function(d) {
        return "translate(" + d.arc.centroid(d) + ")";
    };
    var textText = function(d) {
        return object.config.label(d.data);
    };
    var textTitle = function(d) {
        return d.data[object.config.value];
    };
    for (var k = 1; k <= depth; k++) {
        //Labels
        arcsArray[k].append("text")
            .transition()
            .ease("linear")
            .duration(object.config.transitionDuration)
            .delay(object.config.transitionDuration)
            .attr("transform", textTransform)
            .attr("text-anchor", "middle")
            .text(textText)
            .attr("title", textTitle);
    }

};

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
};