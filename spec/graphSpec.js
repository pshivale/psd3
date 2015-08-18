describe("A suite", function() {
  it("contains spec with an expectation", function() {
    expect(true).toBe(true);
  });
});

describe("Graph", function() {
  it("costructor works", function() {
    expect(new psd3.Graph({})).not.toBe(null);
  });

  it("defaults are set", function() {
  	var graph = new psd3.Graph({});
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
});

