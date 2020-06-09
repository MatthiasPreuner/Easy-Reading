let ComponentBase = require("./../../base/component-base");

class BusyAnimationBase extends  ComponentBase {
    constructor(baseDir){
        super(baseDir);
        this.componentID = "busy-animation";
        this.name = "BaseBusyAnimation";
        this.description = "Base Busy Animation class";
        this.implementationClass = "BusyAnimation";
        this.componentCategory = "busy-animation";
    }
}

module.exports = BusyAnimationBase;
