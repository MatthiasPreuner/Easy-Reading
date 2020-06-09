let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class LineSpacingTool extends base.EngineBase{
    constructor() {
        super();
        this.name = "Line height increaser";
        this.description = "Tools that change font size, line spacing and so on...";
        this.version = "1.0";
        this.versionDescription = "Initial version";
        this.bundles = [new base.FunctionBundle('lineSpacing','Line Spacing', 'Alter the spacing between lines in the current page.')]
    }

    getFunctions(){
        return [
            {
                id : "increaseLineHeight",
                sortOrder: "1",
                name: "Line spacing tool",
                description : "Increases or decreases line spacing",
                defaultIcon : "assets/increaseLineHeight.png",
                includeInDefaultProfile: true,
                supportedLanguages: [],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.LOCAL,
                category: base.EngineFunction.FunctionCategory.TOOLS,
                supportCategories: [
                    base.functionSupportCategories.layout_support.font_support,
                ],
                inputTypes: [{
                    "inputType": ioType.IOTypes.VoidIOType.className,
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.VoidIOType.className,
                }],
                javaScripts:['/js/line-spacing-tool.js'],
                styleSheets : [],
                toolCategory: base.EngineFunction.ToolCategories.Layout,
                entryPoint: "increaseLineHeight",
                bundle: this.bundles[0],
            },
            {
                id : "decreaseLineHeight",
                sortOrder: "2",
                name: "Decrease line height",
                description : "Decreases the line height",
                defaultIcon : "assets/decreaseLineHeight.png",
                includeInDefaultProfile: true,
                supportedLanguages: [],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.LOCAL,
                category: base.EngineFunction.FunctionCategory.TOOLS,
                supportCategories: [
                    base.functionSupportCategories.layout_support.font_support,
                ],
                inputTypes: [{
                    "inputType": ioType.IOTypes.VoidIOType.className,
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.VoidIOType.className,
                }],
                javaScripts:['/js/line-spacing-tool.js'],
                styleSheets : [],
                entryPoint: "decreaseLineHeight",
                toolCategory: base.EngineFunction.ToolCategories.Layout,
                bundle: this.bundles[0],
            }

        ];
    }

    createTextualDescription(){

        this.textualDescription = [
            {
                functionID: "increaseLineHeight",
                description:[
                    this.descriptionManager.createSubHeadingEntry(this,"inc_intro_text","Instruction"),
                    this.descriptionManager.createOrderedListItemEntry(this,"inc_instruction_1","Click on the tool and the line height will get bigger."),
                    this.descriptionManager.createOrderedListItemEntry(this,"inc_instruction_2","Click again and it will get even bigger."),
                ]
            },
            {
                functionID: "decreaseLineHeight",
                description:[
                    this.descriptionManager.createSubHeadingEntry(this,"dec_intro_text","Instruction"),
                    this.descriptionManager.createOrderedListItemEntry(this,"dec_instruction_1","Click on the tool and the line height will get smaller."),
                    this.descriptionManager.createOrderedListItemEntry(this,"dec_instruction_2","Click again and it will get even smaller."),
                ]
            }

        ];
    }
}

module.exports.class = LineSpacingTool;