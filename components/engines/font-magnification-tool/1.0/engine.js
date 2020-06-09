let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class FontMagnificationTool extends base.EngineBase{
    constructor() {
        super();
        this.name = "Font magnification tool";
        this.description = "Tools that change font size";
        this.version = "1.0";
        this.versionDescription = "Initial version";
        this.bundles = [new base.FunctionBundle('fontMagnification','Font Size', 'Modify the font size of the current page.')]
    }

    getFunctions(){
        return [
            {
                id : "magnifyFont",
                sortOrder: "1",
                name: "Magnify font",
                description : "Magnifies the font size",
                defaultIcon : "assets/magnify.png",
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
                    "outputType" : ioType.IOTypes.VoidIOType.className,
                }],
                javaScripts:['/js/font-magnification-tool.js'],
                styleSheets : [],
                toolCategory: base.EngineFunction.ToolCategories.Layout,
                entryPoint: "magnifyFont",
                bundle: this.bundles[0],
            },
            {
                id : "shrinkFont",
                sortOrder: "2",
                name: "Shrink font",
                description : "Shrinks the font size",
                defaultIcon : "assets/shrink.png",
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
                javaScripts:['/js/font-magnification-tool.js'],
                styleSheets : [],
                toolCategory: base.EngineFunction.ToolCategories.Layout,
                entryPoint: "shrinkFont",
                bundle: this.bundles[0],
            },

        ];
    }

    createTextualDescription(){

        this.textualDescription = [
            {
                functionID: "magnifyFont",
                description:[
                    this.descriptionManager.createSubHeadingEntry(this,"magnify_intro_text","Instruction"),
                    this.descriptionManager.createOrderedListItemEntry(this,"magnify_instruction_1","Click on A+ and the font will get bigger."),
                    this.descriptionManager.createOrderedListItemEntry(this,"magnify_instruction_2","Click again and it will get even bigger."),
                ]
            },
            {
                functionID: "shrinkFont",
                description:[
                    this.descriptionManager.createSubHeadingEntry(this,"shrink_intro_text","Instruction"),
                    this.descriptionManager.createOrderedListItemEntry(this,"shrink_instruction_1","Click on A- and the font will get smaller."),
                    this.descriptionManager.createOrderedListItemEntry(this,"shrink_instruction_2","Click again and it will get even smaller."),
                ]
            }

        ];
    }
}

module.exports.class = FontMagnificationTool;