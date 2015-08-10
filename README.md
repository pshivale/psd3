## psd3 - Charts based on d3.js

Javascript pie chart library based on d3.js that supports multi-level pie and donut charts.

### Demos

http://pshivale.github.io/psd3/index.html

### Dependencies

psd3 should work with the latest [d3.js](http://d3js.org/) version 3.5.3 and later.

## Usage
Sample HTML.
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
