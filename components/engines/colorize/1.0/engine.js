var base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class Colorize extends base.EngineBase{
    constructor() {
        super();
        this.id = "Colorize";
        this.name = "Colorize";
        this.description = "Colorize the whole web-page according to your favorite color";
        this.version = "1.0";
        this.debugMode = false;
        this.versionDescription = "Initial version";

    }

    getConfigurationDataOptions() {
        return [
            
            {
            type: "colorCombination",
            propertyMapping: [
                {dataSchemaProerty: "fontColor", configurableDataOptionProerty: "text-color"},
                {dataSchemaProerty: "backgroundColor", configurableDataOptionProerty: "background-color"}
            ],
            configurableDataOption: [
                {"label": "Text", "text-color": "#FFFFFF", "background-color": "#000000" },
                {"label": "Text", "text-color": "#f9dc5c", "background-color": "#00006e" },
                {"label": "Text", "text-color": "#333333", "background-color": "#f8f8f8"},
                {"label" : "Text","text-color": "#0000cc", "background-color": "#FFFFFF"}
               
            ]
            }
            /*{
                type: "colorPicker",
                dataSchemaProerty: ["fontColor", "backgroundColor"]
            }*/
           /*
            {
                type: "singleSelectList",
                dataSchemaProerty: ["fontColor", "backgroundColor"],
                configurableDataOption: [
                    {"label" : "white","value": "#FFFFFF"},
                    {"label" : "Red","value": "#FF0000"},
                    {"label" : "#0000FF","value": "#0000FF"},
                    {"label" : "#00BB00","value": "#00BB00"},
                    {"label" : "#00BB00","value": "#000000"}
                ]
            }
            */
            /*{
                type: "text",
                dataSchemaProerty: ["fontColor", "backgroundColor"]
            }
            */
        ]
    }

    getDataSchema(){
        return {
            "type": "object",
            "properties": {
                "backgroundColor": {
                    "title": "Background color",
                    "description": "Preferred background color",
                    "type": "string",
                    "format": "color",
                    "default": "#000000",
                },
                "fontColor": {
                    "title": "Font color",
                    "description": "Preferred font color",
                    "type": "string",
                    "format": "color",
                    "default": "#FFFFFF"
                }
            },

            "required": [
                "backgroundColor",
                "fontColor"
            ]
        };
    }

    getFunctions(){
        return [
            {
                id : "colorize",
                name: "Colorize",
                description : "Colors a page according to your favorite color",
                defaultIcon : "assets/colorize.png",
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
                javaScripts:['/js/colorize.js'],
                styleSheets : [],
                toolCategory: base.EngineFunction.ToolCategories.Layout,
                entryPoint: "colorize",
            }

        ];
    }
    createTextualDescription(){

        this.textualDescription = [
            {
                functionID: "colorize",
                description:[
                    this.descriptionManager.createSubHeadingEntry(this,"intro_text","Instruction:"),
                    this.descriptionManager.createOrderedListItemEntry(this,"instruction_1","Click on colorize"),
                    this.descriptionManager.createOrderedListItemEntry(this,"instruction_2","Color of background and text changes."),
                ]
            }

        ];
    }
}

module.exports.class = Colorize;
