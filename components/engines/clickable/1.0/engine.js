var base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class Clickable extends base.EngineBase{
    constructor() {
        super();
        this.id = "Clickable";
        this.name = "Clickable";
        this.description = "Mark all clickable objects in the whole web-page according to your favorite setting";
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
                id : "clickable",
                name: "Clickable",
                description : "Mark clickable objects according to your favorite setting",
                defaultIcon : "assets/clickable.png",
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
                styleSheets : [],
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
                    this.descriptionManager.createOrderedListItemEntry(this,"instruction_2","Color of background and text changes."), // TODO
                ]
            }

        ];
    }
}

module.exports.class = Clickable;
