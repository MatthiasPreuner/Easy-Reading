let ComponentInitializer = require("./../base/component-initializer");

class PresentationInitializer extends ComponentInitializer{
    constructor(debugMode){
        super(debugMode);

        this.pathToComponentsDir = "components/presentations/";
        this.pathToContainerFile = "core/components/presentation/base/presentation-version-container.js";
    }
}

module.exports = PresentationInitializer;