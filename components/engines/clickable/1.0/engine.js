var base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class Clickable extends base.EngineBase{
    constructor() {
        super();
        this.id = "Clickable";
        this.name = "Clickable";
        this.description = "Marks all clickable objects in the whole web-page according to your favorite setting";
        this.version = "1.0";
        this.debugMode = false;
        this.versionDescription = "Initial version";

    }

    getFunctions(){
        return [
            {
                id : "clickable",
                name: "Clickable",
                description : "Marks clickable objects.",
                defaultIcon : "assets/clickable-light.png",
                includeInDefaultProfile: true,
                states: 2,
                supportedLanguages: [],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.LOCAL,
                category: base.EngineFunction.FunctionCategory.TOOLS,
                supportCategories: [
                    base.functionSupportCategories.layout_support.color_support,
                ],
                inputTypes: [{
                    "inputType": ioType.IOTypes.VoidIOType.className,
                }],
                outputTypes: [{
                    "outputType" : ioType.IOTypes.VoidIOType.className,
                }],
                javaScripts:['/js/clickable.js'],
                styleSheets : ['/css/style.css'],
                toolCategory: base.EngineFunction.ToolCategories.Layout,
                entryPoint: "clickable",
            }

        ];
    }
    createTextualDescription(){

        this.textualDescription = [
            {
                functionID: "clickable",
                description:[
                    this.descriptionManager.createSubHeadingEntry(this,"intro_text","Instruction:"),
                    this.descriptionManager.createOrderedListItemEntry(this,"instruction_1","Click on the Clickable Button"),
                    this.descriptionManager.createOrderedListItemEntry(this,"instruction_2","Color of background and text changes."),
                ]
            }

        ];
    }
}

module.exports.class = Clickable;
