let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class ContentClarifier extends base.EngineBase {
    constructor() {
        super();
        this.name = "ContentClarifier";
        this.description = "IBM ContentClarifier";
        this.versionDescription = "Initial Version";

    }

    getCredentials() {

        if (process.env.IBM_CCF_USER && process.env.IBM_CCF_PW) {

            return {
                id: process.env.IBM_CCF_USER,
                apikey: process.env.IBM_CCF_PW,
            }
        }

        if (this.credentialManager.hasKey("IBM_CCF_USER") && this.credentialManager.hasKey("IBM_CCF_PW")) {

            return {
                id: this.credentialManager.getValueForKey("IBM_CCF_USER"),
                apikey: this.credentialManager.getValueForKey("IBM_CCF_PW"),
            }
        }

    }


    getDataSchema() {
        return {};
    }

    getFunctions() {
        return [
            {
                id: "contextualSimplify",
                name: "Contextual Simplify",
                description: "This API accepts a string of English text as input and returns a simplified or enhanced version of it.",
                defaultIcon: "assets/ibm-ccf.png",
                includeInDefaultProfile: false,
                supportedLanguages: ["en",],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.TOOLS,
                supportCategories: [
                    base.functionSupportCategories.text_support.simplified_language,
                ],
                inputTypes: [{
                    "inputType": ioType.IOTypes.Paragraph.className,

                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.Paragraph.className,
                    "name": "Output",
                    "description": "Contextual simplify",

                }],
                toolCategory: base.EngineFunction.ToolCategories.Experimental,
                entryPoint: "contextualSimplify",
            },
            {
                id: "contextualSimplifyWithAAC",
                name: "Contextual Simplify with AAC",
                description: "This API accepts a string of English text as input and returns a simplified or enhanced version of it.",
                defaultIcon: "assets/ibm-aac.png",
                includeInDefaultProfile: false,
                supportedLanguages: ["en",],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.TOOLS,
                supportCategories: [
                    base.functionSupportCategories.symbol_support.aac,
                ],
                inputTypes: [{
                    "inputType": ioType.IOTypes.Paragraph.className,
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.Paragraph.className,
                    "name": "Output",
                    "description": "Contextual simplify",

                }],
                toolCategory: base.EngineFunction.ToolCategories.Experimental,
                entryPoint: "contextualSimplifyAAC",
            },
        ];
    }


    contextualSimplify(callback, input, config, profile, constants) {

        let credentials = this.getCredentials();
        if (!credentials) {

            //Error:
            callback(new ioType.IOTypes.Error("No credentials found for IBM CCF!"));
            console.log("No credentials found for IBM CCF!");
            return;
        }

        if (!input.paragraph) {
            return;
        }
        let data = {
            id: credentials.id,
            apikey: credentials.apikey,
            data: input.paragraph,
        };

        let options = {
            url: 'https://contentclarifiertest.mybluemix.net/api/V1/contextual-simplify',
            method: 'POST',
            json: data,
            headers: {
                'Access-Control-Allow-Headers': '*',
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        };
        let request = require('request');
        let component = this;
        request(options, function (err, res, body) {
            try {
                let replacements = component.parseResponse(body.simplified);
                let simplified = component.replaceWordsWithHighlights(body.simplified, replacements);
                let result = new ioType.IOTypes.Paragraph(component.repairChars(simplified));
                callback(result);

            } catch (error) {
                //Error:
                callback(new ioType.IOTypes.Error("Error in creating request"));
            }
        });
    }

    contextualSimplifyAAC(callback, input, config, profile, constants) {
        let credentials = this.getCredentials();
        if (!credentials) {
            //Error:
            callback(new ioType.IOTypes.Error("No credentials found for IBM CCF!"));
            return;
        }

        if (!input.paragraph) {
            //Error:
            callback(new ioType.IOTypes.Error("No input found"));
            return;
        }

        let data = {
            id: credentials.id,
            apikey: credentials.apikey,
            data: input.paragraph,
            options: {
                "enhanceContentMode": 3,

            },
        };

        let options = {
            url: 'https://contentclarifiertest.mybluemix.net/api/V1/contextual-simplify',
            method: 'POST',
            json: data,
            headers: {
                'Access-Control-Allow-Headers': '*',
                'Content-type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
        };
        let request = require('request');
        let component = this;
        request(options, function (err, res, body) {


            try {
                let replacements = component.parseResponseAAC(body.simplified);
                let simplified = component.replaceWordsWithAAC(body.simplified, replacements);

                let result = new ioType.IOTypes.Paragraph(component.repairCharsAAC(simplified));
                callback(result);
            } catch (error) {
                //Error:
                callback(new ioType.IOTypes.Error("Error in creating request"));
            }


        });
    }


    parseResponse(response) {

        try {
            let findings = response.match(/\|_(.*?)_\|/g);
            if (findings) {


                let keywords = findings.map(function (val) {

                    return {
                        stringToReplace: val,
                        word: (val.substr(2)).slice(0, -2),
                    };
                });

                let replacements = response.match(/\|\^(.*?)\^\|/g).map(function (val) {

                    return {
                        stringToReplace: val,
                        keyword: (val.substr(2)).slice(0, -2),
                    };
                });

                let confidences = response.match(/%\#(.*?)\#%/g).map(function (val) {
                    return {
                        stringToReplace: val,
                        values: JSON.parse((val.substr(2)).slice(0, -2)),
                    };
                });

                return {
                    keywords: keywords,
                    replacements: replacements,
                    confidences: confidences
                }
            }


        } catch (error) {

            console.log(error);
        }

        return {
            keywords: [],
            replacements: [],
            confidences: []
        }

    }

    replaceWordsWithHighlights(result, replacements) {
        for (let i = 0; i < replacements.keywords.length; i++) {

            result = result.replace(replacements.keywords[i].stringToReplace, "");
            result = result.replace(replacements.replacements[i].stringToReplace, '<span class="easy-reading-highlight">' + replacements.replacements[i].keyword + '</span>');
            result = result.replace(replacements.confidences[i].stringToReplace, "");

        }


        return result;


    }

    repairChars(result) {

        return result.replace(/\\\s"/g, '"');
    }

    parseResponseAAC(response) {
        if (response) {
            try {
                let findings = response.match(/%\~(.*?)\~%/g);
                if (findings) {

                    let aacSymbols = findings.map(function (val) {
                        return {
                            stringToReplace: val,
                            values: JSON.parse((val.substr(2)).slice(0, -2)),
                        };
                    });

                    return {
                        aacSymbols: aacSymbols,
                    }
                }
            } catch (error) {
                console.log(error);

            }
        }


        return {
            aacSymbols: [],
        };

    }

    replaceWordsWithAAC(result, replacements) {
        for (let i = 0; i < replacements.aacSymbols.length; i++) {


            let replacement = '<span style="display:inline-block; line-height:0.8; ">\n' +
                '    <span style="display:block;">\n' +
                '        <img src="' + replacements.aacSymbols[i].values.image_url + '" style="width: 50px; height: 50px;">\n' +
                '    </span>\n' +
                '    <span style="display:block; text-align:center">' + replacements.aacSymbols[i].values.symbol + '</span>\n' +
                '</span>';

            result = result.replace(replacements.aacSymbols[i].values.symbol + replacements.aacSymbols[i].stringToReplace, replacement);


        }


        return result;


    }

    repairCharsAAC(result) {
        if (result) {
            return result.replace(/\\"/g, '');
        }

    }

}

module.exports.class = ContentClarifier;