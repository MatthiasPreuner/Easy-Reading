var base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class LocalEngine extends base.EngineBase{
    constructor() {
        super();
        this.id = "LocalEngine";
        this.name = "LocalEngine";
        this.description = "LocalEngine Description";
        this.version = "1.0";
        this.debugMode = false;
        this.versionDescription = "Initial version";

    }


    getDataSchema(){
        return {
            "type": "object",
            "properties": {
                "favoriteColor": {
                    "type": "string",
                    "default": "Yellow",
                },
            },

            "required": [
                "favoriteColor",
            ]
        };
    }

    getFunctions(){
        return [
            {
                id : "local_function",
                name: "Function name",
                description : "Function description",
                defaultIcon : "assets/local_function.png",
                includeInDefaultProfile: false,
                supportedLanguages: [],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.LOCAL,
                category: base.EngineFunction.FunctionCategory.TOOLS,
                supportCategories: [
                    base.EngineFunction.SupportCategories.UNDERSTANDING_SUPPORT.ALL,
                ],
                inputTypes: [{
                    "inputType": ioType.IOTypes.VoidIOType.className,
                }],
                outputTypes: [{
                    "outputType" : ioType.IOTypes.VoidIOType.className,
                }],
                javaScripts:['/js/script.js'],
                styleSheets : [],
                toolCategory: base.EngineFunction.ToolCategories.Experimental,
                entryPoint: "entryFunction",
            }

        ];
    }
}

module.exports.class = LocalEngine;
