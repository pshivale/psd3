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
    draw(dataset, 50);
}

draw = function(dataset, outerRadius, startAngle, endAngle) {
    if(dataset === null || dataset ===undefined){
        return;
    }
    console.log("dataset = " + dataset);
    console.log("outerRadius = " + outerRadius);

    var pie = d3.layout.pie();
    pie.value(function(d) {
        return d.value;
    });

    
    var values = [];
    for(var i=0; i<dataset.length; i++){
        values.push(dataset[i].value);
    }
    console.log(values);


    for(var j=0; j< dataset.length; j++){
        draw(dataset[j].inner, outerRadius+50);
    }


};
