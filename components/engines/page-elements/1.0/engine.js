var base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class PageElements extends base.EngineBase{
    constructor() {
        super();
        this.id = "page-elements";
        this.name = "Page Elements";
        this.description = "Show lists of important page elements, sorted by their type.";
        this.version = "1.0";
        this.debugMode = false;
        this.versionDescription = "Initial version";

    }

    getFunctions(){
        return [
            {
                id : "page-elements",
                name: "Page Elements",
                description : "Show lists of important page elements, sorted by their type.",
                defaultIcon : "assets/page-elements-full.png",
                includeInDefaultProfile: true,
                states: 1,
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
                javaScripts:['/js/page-elements.js'],
                styleSheets : ['/css/style.css'],
                toolCategory: base.EngineFunction.ToolCategories.Layout,
                entryPoint: "pageElements",
            }

        ];
    }
    createTextualDescription(){

        this.textualDescription = [
            {
                functionID: "page-elements",
                description:[
                    this.descriptionManager.createSubHeadingEntry(this,"intro_text","Instruction:"),
                    this.descriptionManager.createOrderedListItemEntry(this,"instruction_1","Click on the Page Elements Button"),
                    this.descriptionManager.createOrderedListItemEntry(this,"instruction_2","A window with important page elements opens."),
                ]
            }

        ];
    }
}

module.exports.class = PageElements;
