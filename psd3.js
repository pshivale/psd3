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
            return d.data.value;
        },
        tooltip: function(d) {
            if (_this.config.value !== undefined) {
                return d[_this.config.value];
            } else {
                return d.value;
            }

        },
        transition: "linear",
        transitionDuration: 1000,
        donutRadius: 0,
        gradient: false,
        colors: d3.scale.category20(),
        labelColor: "black",
        drilldownTransition: "linear",
        drilldownTransitionDuration: 0,
        stroke: "white",
        strokeWidth: 2,
        highlightColor: "orange"
    };
    /*console.log("before defaults");
    for(var property in config){
        console.log(property);
    }*/
    for (var property in this.defaults) {
        if (this.defaults.hasOwnProperty(property)) {
            if (!config.hasOwnProperty(property)) {
                config[property] = this.defaults[property];
            }
        }
    }
    /*console.log("after defaults");
    for(var property in config){
        console.log(property);
    }*/
};

var psd3 = psd3 || {};

psd3.Pie = function(config) {
    psd3.Graph.call(this, config);
    this.zoomStack = [];
    var pos = "top";
    if (this.config.heading !== undefined && this.config.heading.pos !== undefined) {
        pos = this.config.heading.pos;
    }
    if (pos == "top") {
        this.setHeading();
    }
    this.drawPie(config.data);
    if (pos == "bottom") {
        this.setHeading();
    }
};

psd3.Pie.prototype = Object.create(psd3.Graph.prototype);

psd3.Pie.prototype.constructor = psd3.Pie;

psd3.Pie.prototype.findMaxDepth = function(dataset) {
    if (dataset === null || dataset === undefined || dataset.length < 1) {
        return 0;
    }
    var currentLevel;
    var maxOfInner = 0;
    for (var i = 0; i < dataset.length; i++) {
        var maxInnerLevel = this.findMaxDepth(dataset[i][this.config.inner]);
        if (maxOfInner < maxInnerLevel) {
            maxOfInner = maxInnerLevel;
        }
    }
    currentLevel = 1 + maxOfInner;
    return currentLevel;
};

psd3.Pie.prototype.setHeading = function() {
    if (this.config.heading !== undefined) {
        d3.select("#" + this.config.containerId)
            .append("div")
            .style("text-align", "center")
            .style("width", "" + this.config.width + "px")
            .style("padding-top", "20px")
            .style("padding-bottom", "20px")
            .append("strong")
            .text(this.config.heading.text);
    }
};

psd3.Pie.prototype.mouseover = function(d) {
    d3.select("#" + _this.tooltipId)
        .style("left", (d3.event.clientX + window.scrollX) + "px")
        .style("top", (d3.event.clientY + window.scrollY) + "px")
        .select("#value")
        .html(_this.config.tooltip(d.data, _this.config.label));
    d3.select("#" + _this.tooltipId).classed("psd3Hidden", false);
    d3.select(d.path)
        .style("fill", _this.config.highlightColor);
};
psd3.Pie.prototype.mouseout = function(d) {
    d3.select("#" + _this.tooltipId).classed("psd3Hidden", true);
    d3.select(d.path)
        .style("fill", d.fill);
};

psd3.Pie.prototype.drawPie = function(dataset) {
    if (dataset === null || dataset === undefined || dataset.length < 1) {
        return;
    }
    _this = this;
    _this.arcIndex = 0;
    var svg = d3.select("#" + _this.config.containerId)
        .append("svg")
        .attr("id", _this.config.containerId + "_svg")
        .attr("width", _this.config.width)
        .attr("height", _this.config.height);
    _this.tooltipId = _this.config.containerId + "_tooltip";
    var tooltipDiv = d3.select("#" + _this.config.containerId).append("div")
        .attr("id", _this.tooltipId)
        .attr("class", "psd3Hidden psd3Tooltip");
    tooltipDiv.append("p")
        .append("span")
        .attr("id", "value")
        .text("100%");

    // to contain pie cirlce
    var radius;
    if (_this.config.width > _this.config.height) {
        radius = _this.config.width / 2;
    } else {
        radius = _this.config.height / 2;
    }
    var innerRadius = _this.config.donutRadius;
    var maxDepth = _this.findMaxDepth(dataset);
    //console.log("maxDepth = " + maxDepth);
    var outerRadius = innerRadius + (radius - innerRadius) / maxDepth;
    var originalOuterRadius = outerRadius;
    var radiusDelta = outerRadius - innerRadius;
    _this.draw(svg, radius, dataset, dataset, dataset.length, innerRadius, outerRadius, radiusDelta, 0, 360 * 22 / 7 / 180, [0, 0]);
};


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
    return d.data[_this.config.value];
};

psd3.Pie.prototype.draw = function(svg, totalRadius, dataset, originalDataset, originalDatasetLength, innerRadius, outerRadius, radiusDelta, startAngle, endAngle, parentCentroid) {
    _this = this;
    //console.log("**** draw ****");
    //console.log("dataset = " + dataset);
    if (dataset === null || dataset === undefined || dataset.length < 1) {
        return;
    }
    //console.log("parentCentroid = " + parentCentroid);
    // console.log("innerRadius = " + innerRadius);
    // console.log("outerRadius = " + outerRadius);
    // console.log("startAngle = " + startAngle);
    // console.log("endAngle = " + endAngle);

    psd3.Pie.prototype.textText = function(d) {
        return _this.config.label(d);
    };

    var pie = d3.layout.pie();
    pie.sort(null);
    pie.value(function(d) {
        //console.log("d.value = " + d.value);
        return d[_this.config.value];
    });
    pie.startAngle(startAngle)
        .endAngle(endAngle);

    var values = [];
    for (var i = 0; i < dataset.length; i++) {
        values.push(dataset[i][_this.config.value]);
    }
    //console.log(values);

    var dblclick = function(d) {
        _this.reDrawPie(d, originalDataset);
    };

    var arc = d3.svg.arc().innerRadius(innerRadius)
        .outerRadius(outerRadius);
    //Set up groups
    _this.arcIndex = _this.arcIndex + 1;

    var clazz = "arc" + _this.arcIndex;

    var storeMetadataWithArc = function(d) {
        d.path = this;
        d.fill = this.fill;
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

    var gradient = svg.append("svg:defs")
        .append("svg:linearGradient")
        .attr("id", "gradient_" + _this.arcIndex)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

    var startColor, endColor;
    if (_this.config.gradient) {
        var index = 2 * _this.arcIndex;
        var endIndex = index + 1;
        //console.log("arcindex = " + _this.arcIndex + "(" + index + ", " + endIndex);
        startColor = _this.config.colors(index);
        endColor = _this.config.colors(endIndex);
    } else {
        startColor = endColor = _this.config.colors(this.arcIndex);
    }
    //console.log("color = " + startColor + ", " + endColor);
    gradient.append("svg:stop")
        .attr("offset", "0%")
        .attr("stop-color", startColor)
        .attr("stop-opacity", 1);

    gradient.append("svg:stop")
        .attr("offset", "100%")
        .attr("stop-color", endColor)
        .attr("stop-opacity", 1);

    //Draw arc paths
    var paths = arcs.append("path")
        //.attr("fill", color(_this.arcIndex));
        .attr("fill", "url(#gradient_" + _this.arcIndex + ")")
        .style("stroke", _this.config.stroke)
        .style("stroke-width", _this.config.strokeWidth);

    paths.on("mouseover", _this.mouseover);

    paths.on("mouseout", _this.mouseout);

    paths.each(storeMetadataWithArc);

    paths.transition()
        .duration(_this.config.transitionDuration)
        .delay(_this.config.transitionDuration * (_this.arcIndex - 1))
        .ease(_this.config.transition)
        .attrTween("d", _this.customArcTween);

    //paths.each(storeMetadataWithArc);

    //Labels
    var texts = arcs.append("text")
        .attr("x", function() {
            return parentCentroid[0];
        })
        .attr("y", function() {
            return parentCentroid[1];
        })
        .transition()
        .ease(_this.config.transition)
        .duration(_this.config.transitionDuration)
        .delay(_this.config.transitionDuration * (_this.arcIndex - 1))
        .attr("transform", function(d) {
            var a = [];
            a[0] = arc.centroid(d)[0] - parentCentroid[0];
            a[1] = arc.centroid(d)[1] - parentCentroid[1];
            return "translate(" + a + ")";
        })
        .attr("text-anchor", "middle")
        .text(_this.textText)
        .style("fill", _this.config.labelColor)
        .attr("title", _this.textTitle);



    //console.log("paths.data() = " + paths.data());
    for (var j = 0; j < dataset.length; j++) {
        //console.log("dataset[j] = " + dataset[j]);
        //console.log("paths.data()[j] = " + paths.data()[j]);
        if (dataset[j][_this.config.inner] !== undefined) {
            _this.draw(svg, totalRadius, dataset[j][_this.config.inner], originalDataset, originalDatasetLength, innerRadius + radiusDelta, outerRadius + radiusDelta, radiusDelta, paths.data()[j].startAngle, paths.data()[j].endAngle, arc.centroid(paths.data()[j]));
        }
    }


};

psd3.Pie.prototype.reDrawPie = function(d, ds) {
    var tmp = [];
    d3.select("#" + _this.tooltipId).remove();
    d3.select("#" + _this.config.containerId + "_svg") //.remove();
        .transition()
        .ease(_this.config.drilldownTransition)
        .duration(_this.config.drilldownTransitionDuration)
        .style("height", 0)
        .remove()
        .each("end", function() {
            if (d.length == 1) {
                tmp = _this.zoomStack.pop();
            } else {
                tmp.push(d.data);
                _this.zoomStack.push(ds);
            }
            _this.drawPie(tmp);
        });
};
