let ComponentBase = require("./../../base/component-base");

class PresentationBase extends ComponentBase {
    constructor(baseDir){
        super(baseDir);
        this.componentID = "presentation";
        this.name = "BasePresentation";
        this.description = "BasePresentation description";
        this.implementationClass = "PresentationImplementation";
        this.componentCategory = "presentation";
        this.inputTypes = [];
    }
}

module.exports = PresentationBase;