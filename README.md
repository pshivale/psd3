## psd3 - Charts based on d3.js

Javascript pie chart library based on d3.js that supports multi-level pie and donut charts.

### Demos

http://pshivale.github.io/psd3/index.html

### Dependencies

psd3 should work with the latest [d3.js](http://d3js.org/) version 3.5.3 and later.

## Usage

### Sample HTML.
```html
<!doctype html>
<html>
<head>
    <link rel="stylesheet" type="text/css" href="psd3.css"/>
    <script type="text/javascript" src="d3.js"></script>
    <script type="text/javascript" src="psd3.js"></script>
</head>
<body>

  <div id="chartContainer"></div>

  <script type="text/javascript">
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
	
	// labels shown in the graph. Any function that returns a string. Data object is available as d.
	label: function(d) {
	    return d.place + ":" + d.noOfColleges;
	},
	
	// field to be used as value in graph
	value: "noOfColleges",
	
	// filed to be used as nested data
	inner: "drilldown",
	
	// tooltip shown for the graph sections. Any function that returns a string. Data object is available as d.
	tooltip: function(d) {
	    return "<p>There are " + d.noOfColleges + " medical colleges in " + d.place + ".</p>";
	},
	
	// transition effect. Any d3 ease transition is accepted.
	// default is linear
	transition: "bounce",
	
	// transitionDuration
	// default is 1000
	transitionDuration: 1500,
	
	// donutRadius for donut charts
	// default is 0
	donutRadius: 50
}
```
