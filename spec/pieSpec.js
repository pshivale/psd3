describe("Pie Test Suite", function() {
    it("costructor works", function() {
        expect(new psd3.Pie({})).not.toBe(null);
    });

    it("defaults are set", function() {
        var graph = new psd3.Pie({});
        expect(graph.config.width).toBe(400);
        expect(graph.config.height).toBe(400);
        expect(graph.config.value).toBe("value");
        expect(graph.config.inner).toBe("inner");
        expect(graph.config.transition).toBe("linear");
        expect(graph.config.transitionDuration).toBe(1000);
        expect(graph.config.donutRadius).toBe(0);
        expect(graph.config.gradient).toBe(false);
        expect(graph.config.labelColor).toBe("black");
        expect(graph.config.drilldownTransition).toBe("linear");
        expect(graph.config.drilldownTransitionDuration).toBe(0);
        expect(graph.config.stroke).toBe("white");
        expect(graph.config.strokeWidth).toBe(2);
        expect(graph.config.highlightColor).toBe("orange");
    });

    it("overrides default width", function() {
        var config = {
            width: 500,
            height: 500,
            value: "myValue",
            inner: "myInner",
            transition: "bounce",
            transitionDuration: 2000,
            donutRadius: 10,
            gradient: true,
            labelColor: "white",
            drilldownTransition: "bounce",
            drilldownTransitionDuration: 10,
            stroke: "red",
            strokeWidth: 5,
            highlightColor: "green"
        };
        var graph = new psd3.Pie(config);
        expect(graph.config.width).toBe(500);
        expect(graph.config.height).toBe(500);
        expect(graph.config.value).toBe("myValue");
        expect(graph.config.inner).toBe("myInner");
        expect(graph.config.transition).toBe("bounce");
        expect(graph.config.transitionDuration).toBe(2000);
        expect(graph.config.donutRadius).toBe(10);
        expect(graph.config.gradient).toBe(true);
        expect(graph.config.labelColor).toBe("white");
        expect(graph.config.drilldownTransition).toBe("bounce");
        expect(graph.config.drilldownTransitionDuration).toBe(10);
        expect(graph.config.stroke).toBe("red");
        expect(graph.config.strokeWidth).toBe(5);
        expect(graph.config.highlightColor).toBe("green");
    });

    it("finds Max Depth", function() {
        var dataset = [{
            value: 1,
            inner: [{
                value: 2,
                inner: [{
                    value: 3
                }]
            }]
        }, {
            value: 1,
            inner: [{
                value: 2,
                inner: [{
                    value: 3,
                    inner: [{
                        value: 4
                    }]
                }]
            }]
        }];
        expect(new psd3.Pie({}).findMaxDepth(dataset)).toBe(4);
    });

    it("draws simple multi-level pie", function() {
        d3.select("body").append("div").attr("id", "chartContainer");
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
        expect(d3.select("#chartContainer_svg")).not.toBe(undefined);
    });

});
