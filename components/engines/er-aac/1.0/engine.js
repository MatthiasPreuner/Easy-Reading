var base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class EasyReadingAAC extends base.EngineBase {

    constructor() {
        super();
        this.id = "EasyReadingAAC";
        this.name = "EasyReadingAAC";
        this.description = "Creates AAC Annotations";
        this.version = "1.0";
        this.versionDescription = "Initial Version";

    }


    getFunctions() {
        return [
            {
                id: "er_aac",
                name: "Easy Reading AAC",
                description: "Creates an AAC version",
                defaultIcon: "assets/er-aac-symbol.png",
                includeInDefaultProfile: false,
                supportedLanguages: ["en", "de", "sv"],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.DICTIONARY,
                supportCategories: [
                    base.functionSupportCategories.symbol_support.aac,
                ],
                inputTypes: [
                    {
                        "inputType": ioType.IOTypes.Paragraph.className,
                        "name": "Input paragraph",
                        "description": "Paragraph to detect key phrases",
                    }
                ],
                outputTypes: [
                    {
                        "outputType": ioType.IOTypes.Paragraph.className,
                        "name": "Paragraph word",
                        "description": "Translated paragraph",
                    }
                ],
                toolCategory: base.EngineFunction.ToolCategories.Explanation,
                entryPoint: "createAAC",
            },

        ];
    }

    createAAC(callback, input, config, profile, constants) {

        let core = require("../../../../core/core");

        let keyPhraseDetector = core.getEngine("mircrosoft-textanalytics-key-phrase");
        let thPicturedDictionary = core.getEngine("texthelp-pictured-dictionary");

        keyPhraseDetector.detectKeyPhrases(
            function (result) {

                let runningRequests = 0;
                for (let i = 0; i < result.taggedText.length; i++) {

                    if (result.taggedText[i].tags) {

                        result.taggedText[i].text = result.taggedText[i].text.split(" ");
                        for (let j = 0; j < result.taggedText[i].text.length; j++) {
                            runningRequests++;
                        }
                    } else {
                        result.taggedText[i].text = [result.taggedText[i].text];
                    }
                }

                if (!result.taggedText.length) {
                    let noResults = new ioType.IOTypes.NoResult("No result found!");
                    callback(noResults);

                    return;

                }

                for (let i = 0; i < result.taggedText.length; i++) {

                    if (result.taggedText[i].tags) {
                        for (let j = 0; j < result.taggedText[i].text.length; j++) {

                            thPicturedDictionary.picturedDictionary(function (pictureResult) {
                                runningRequests--;

                                if (pictureResult.name === "ImageIOType") {
                                    let spacing = "";
                                    if (j > 0) {
                                        spacing = " ";
                                    }

                                    let replacement = '<span style="display:inline-block; line-height:0.8; ">\n' +
                                        '    <span style="display:block;">\n' +
                                        '        <img src="' + pictureResult.url + '" style="width: 50px; height: 50px;">\n' +
                                        '    </span>\n' +
                                        '    <span style="display:block; text-align:center">&nbsp;' + result.taggedText[i].text[j] + spacing + '&nbsp;</span>\n' +
                                        '</span>';

                                    result.taggedText[i].text[j] = replacement;
                                }else if(pictureResult.name === "Error"){

                                    callback(pictureResult);
                                    return;
                                }


                                if (runningRequests === 0) {
                                    let finalText = "";
                                    for (let i = 0; i < result.taggedText.length; i++) {
                                        for (let j = 0; j < result.taggedText[i].text.length; j++) {
                                            finalText += result.taggedText[i].text[j];

                                            //Add empty spaces again that were removed when splitting key phrases
                                            if (j > 0) {
                                                finalText += " ";
                                            }
                                        }
                                    }
                                    let theResult = new ioType.IOTypes.Paragraph(finalText);
                                    callback(theResult);
                                }

                            }, new ioType.IOTypes.Word(result.taggedText[i].text[j], input.lang), config, profile, constants);
                        }
                    }


                }
            }, input, config, profile, constants
        );

    }

}

module.exports.class = EasyReadingAAC;
