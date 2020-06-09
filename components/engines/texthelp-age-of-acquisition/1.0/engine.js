let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class TextHelpAgeOfAcquisition extends base.EngineBase {
    constructor() {
        super();
        this.name = "Texthelp";
        this.description = "Texthelp Services";
        this.versionDescription = "Initial Version";


    }


    getFunctions() {
        return [
            {
                id: "ageOfAcquisition",
                name: "Age of Acquisition",
                description: "Texthelp Age of Acquisition",
                defaultIcon: "assets/texthelp-age.png",
                includeInDefaultProfile: false,
                supportedLanguages: ["en"],
                visibleInConfiguration: false,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.TOOLS,
                inputTypes: [{
                    "inputType": ioType.IOTypes.Paragraph.className,
                    "name": "Paragraph",
                    "description": "Words or paragraphs",
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.Word.className,
                    "name": "averageAgeOfAcquisition",
                    "description": "average age of Aquisition",

                }],
                toolCategory: base.EngineFunction.ToolCategories.Other,
                entryPoint: "averageAgeOfAcquisition",
            },


        ];
    }

    averageAgeOfAcquisition(callback, input, config, profile, constants) {
        this.authManager.getToken("texthelp",function (token) {

            if (!token) {
                //Error:
                callback(new ioType.IOTypes.Error("Texthelp authentication error"));

            }  else {
                let options = {
                    url: 'https://easy-reading-api.dev.texthelp.com/api/v1/ageofacquisition',
                    method: 'POST',
                    headers: {
                        Authorization: ' Bearer ' + token,
                    },
                    json: {
                        content: input.paragraph,
                    }
                };
                let request = require('request');
                request(options, function (err, res, body) {
                    try {
                        //    let response = JSON.parse(body);
                        let output = "";
                        if (body.status === "success") {
                            output = "Average age of acquisition: " + body.data.average;
                        } else {
                            output = "Could not connect to service. Please try again later.";
                        }
                        let result = new ioType.IOTypes.Word(output);

                        callback(result);
                    } catch (err) {
                        console.log(err);
                        //Error:
                        callback(new ioType.IOTypes.Error("Error processing request"));
                    }
                });
            }
        });
    }



}

module.exports.class = TextHelpAgeOfAcquisition;
