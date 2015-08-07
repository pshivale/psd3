/**
 * 
 */
 var psd3 = psd3 || {};
psd3.Graph = function(config) {
    this.config = config;
    this.defaults = {
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