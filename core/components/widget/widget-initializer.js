let ComponentInitializer = require("./../base/component-initializer");

class WidgetInitializer extends ComponentInitializer{
    constructor(debugMode){
        super(debugMode);
        this.pathToComponentsDir = "components/widgets/";
        this.pathToContainerFile = "core/components/widget/base/widget-version-container.js";
    }
}

module.exports = WidgetInitializer;