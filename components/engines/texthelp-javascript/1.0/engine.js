let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class TextHelpJavaScript extends base.EngineBase {
    constructor() {
        super();
        this.name = "Texthelp JavaScript Injection";
        this.description = "Texthelp Services";
        this.versionDescription = "Initial Version";


    }



    getFunctions() {
        return [
            {
                id: "sampleJavaScriptInjection",
                name: "Texthelp JavaScript Injection",
                description: "Sample Javascript",
                defaultIcon: "assets/texthelp-js.png",
                includeInDefaultProfile: false,
                supportedLanguages: [],
                visibleInConfiguration: false,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.TOOLS,
                inputTypes: [{
                    "inputType": ioType.IOTypes.VoidIOType.className,
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.JavaScriptType.className,
                    "name": "Output",
                    "description": "Javascript to call",

                }],
                toolCategory: base.EngineFunction.ToolCategories.Experimental,
                entryPoint: "getScript",
            }

        ];
    }

    getScript(callback, input, config, profile, constants) {


        this.authManager.getToken("texthelp",function (token) {

            if (!token) {
                //Error:
                callback(new ioType.IOTypes.Error("Texthelp authentication error"));

            } else {
                let options = {
                    url: 'https://easy-reading-api.dev.texthelp.com/api/v1/test/script',
                    method: 'GET',
                    headers: {
                        Authorization: ' Bearer ' + token,
                    },
                };
                let request = require('request');
                request(options, function (err, res, body) {

                    try {
                        let response = JSON.parse(body);
                        if (response.status === "success") {

                            let result = new ioType.IOTypes.JavaScriptType(response.data.script);

                            callback(result);
                        }
                    } catch (err) {
                        //Error:
                        callback(new ioType.IOTypes.Error("Error processing request"));
                        console.log(err);
                    }

                });
            }
        });
    }

}
module.exports.class = TextHelpJavaScript;
