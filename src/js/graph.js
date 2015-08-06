/**
 * 
 */
 var spie = spie || {};
spie.Graph = function(data, config) {
    this.data = data;
    this.config = config;
    this.defaults = {
        _this: this,
        width: 400,
        height: 400,
        value: "value",
        label: function(d) {
            return d.label;
        },
        tooltip: function(d) {
            if (this.config.label !== undefined) {
                return this.config.label(d);
            } else {
                return d.label;
            }

        },
        transitionDuration: 1000
    }
}