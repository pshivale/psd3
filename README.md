## psd3 - Javascript multi-level pie chart library based on d3.js

Javascript pie chart library based on d3.js that supports multi-level pie charts, donut charts and sunburst charts.

### Demos

http://pshivale.github.io/psd3/

### Dependencies

psd3 should work with the latest [d3.js](http://d3js.org/) version 3.5.3 and later.

## Usage

### Sample HTML
```html
<!doctype html>
<html>
<head>
	<!-- include d3.js dependancy -->
	<script type="text/javascript" src="d3.js"></script>
	
	<!-- include psd3 dependancies -->
    <link rel="stylesheet" type="text/css" href="psd3.css"/>
    <script type="text/javascript" src="psd3.js"></script>
</head>
<body>
	<!-- Container for the chart -->
	<div id="chartContainer"></div>

	<script type="text/javascript">
	  	// Create config 
	  	var config = {
	  		containerId: "chartContainer",
	  		data: [{
	  		    value: 25,
	  		    label: "Maharashtra",
	  		    inner: [{
	  		        value: 15,
	  		        label: "Pune"
	  		    }, {
	  		        value: 10,
	  		        label: "Mumbai"
	  		    }]
	  		}, {
	  		    value: 50,
	  		    label: "Gujarat",
	  		    inner: [{
	  		        value: 20,
	  		        label: "Surat"
	  		    }, {
	  		        value: 30,
	  		        label: "Rajkot"
	  		    }]
	  		}],
	  	};
	  
		// Draw chart
		var samplePie = new psd3.Pie(config);
	</script>

</body>
</html>
```
### Config Options
```javascript
{
	// id of the container element in which graph will be placed
    containerId: "chartContainer",
    
    // width of the container
    // default is 400
	width: 500,
	
	// height of the container
	// default is 400
	height: 500,
	
	// data for plotting the graph
	data: sampleData,
	
	// heading of the graph
	heading: {
		// text of the heading
	    text: "Medical Colleges in India",
	    // position of the heading
	    // default is top
	    pos: "top"
	},
	
	// labels shown in the graph. Data object is available as d.
	// default label is the "label" field
	label: function(d) {
	    return d.data.place + ":" + d.data.noOfColleges;
	},
	
	// field to be used as value in graph
	// default field name assumed is "value"
	value: "noOfColleges",
	
	// field to be used as nested data for multi-level pie chart
	// default field name assumed is "inner"
	inner: "drilldown",
	
	// tooltip shown for the graph sections. Data object is available as d.
	// default tooltip is the "value" field
	tooltip: function(d) {
	    return "<p>There are " + d.noOfColleges + " medical colleges in " + d.place + ".</p>";
	},
	
	// transition effect. Any d3 ease transition is accepted.
	// default is linear
	transition: "bounce",
	
	// transitionDuration
	// default is 1000
	transitionDuration: 1500,
	
	// innerRadius for donut charts
	// default is 0
	donutRadius: 50,
	
	// colors function that accepts an index and returns color string
	// default is d3.scale.category20()
	colors: d3.scale.category20(),
	
	// if true linear gradient is applied. gradient start with color(i) and ends with color(i+1) and so on..
	// default is false
	gradient: true,
        
    // color of the label
    // default is black
    labelColor: "white"

    // color of the pie slice border stroke
    // default is white
    stroke: "#eee",

    // stroke width of pie slice border
    // default is 2
    strokeWidth: 3,

    // fade out transition of current view when drilling down
    // default is linear
    drilldownTransition: "linear",

    // duration of fade out transition of current view when drilling down
    // default is 0
    drilldownTransitionDuration: 1000,

    // highlight color of pie slice when mouse over
    // default is orange
    highlightColor: "#c00",
    
    // rotate the label along the arc of the pie slice
    // default is false
    rotateLabel: true
}
```
## MIT Licensed

Find full text [here](https://github.com/pshivale/psd3/blob/master/LICENSE.md)

