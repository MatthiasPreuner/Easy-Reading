let ComponentInitializer = require("./../base/component-initializer");

class BusyAnimationInitializer extends ComponentInitializer {
    constructor(debugMode){
        super(debugMode);
        this.pathToComponentsDir = "components/busy-animations/";
        this.pathToContainerFile = "core/components/busy-animation/base/busy-animation-version-container.js";
    }
}

module.exports = BusyAnimationInitializer;
