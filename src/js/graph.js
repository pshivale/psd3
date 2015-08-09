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
        inner: "inner",
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
        transitionDuration: 1000,
        donutRadius: 0
    };
    /*console.log("before defaults");
    for(var property in config){
        console.log(property);
    }*/
    for(var property in this.defaults){
        if(this.defaults.hasOwnProperty(property)){
            if(!config.hasOwnProperty(property)){
                config[property] = this.defaults[property];
            }
        }
    }
    /*console.log("after defaults");
    for(var property in config){
        console.log(property);
    }*/
};