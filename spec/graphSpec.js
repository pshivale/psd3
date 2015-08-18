describe("A suite", function() {
  it("contains spec with an expectation", function() {
    expect(true).toBe(true);
  });
});

describe("Graph suite", function() {
  it("Graph Costructor", function() {
    expect(new psd3.Graph({})).not.toBe(null);
  });
});
