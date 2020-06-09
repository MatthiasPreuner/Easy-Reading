let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class TextHelpWikiSummary extends base.EngineBase {
    constructor() {
        super();
        this.name = "Texthelp Wiki";
        this.description = "Texthelp Services";
        this.versionDescription = "Initial Version";

    }


    getFunctions() {
        return [
            {
                id: "wikiSummary",
                name: "Wiki Summary",
                description: "Texthelp Wiki Summary",
                defaultIcon: "assets/texthelp-wiki.png",
                includeInDefaultProfile: false,
                supportedLanguages: ["en"],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.TOOLS,
                supportCategories: [
                    base.functionSupportCategories.text_support.multimedia_annotation,
                ],
                inputTypes: [{
                    "inputType": ioType.IOTypes.Paragraph.className,
                    "name": "Paragraph",
                    "description": "Words",
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.AnnotatedParagraph.className,
                    "name": "Wiki Summary",
                    "description": "Wikipedia summary of the word",

                }],
                toolCategory: base.EngineFunction.ToolCategories.Explanation,
                entryPoint: "wikiSummary",
            }
        ];
    }


    wikiSummary(callback, input, config, profile, constants) {

        this.authManager.getToken("texthelp", function (token) {

            if (!token) {
                //Error:
                callback(new ioType.IOTypes.Error("Texthelp authentication error"));

            } else {
                let options = {
                    url: 'https://easy-reading-api.dev.texthelp.com/api/v1/wikisummary',
                    method: 'POST',
                    headers: {
                        Authorization: ' Bearer ' + token,
                    },
                    json: {
                        text: {
                            0: input.paragraph,
                        }
                    }
                };
                let request = require('request');
                request(options, function (err, res, body) {
                    try {

                        let replacements = [];

                        let result = new ioType.IOTypes.AnnotatedParagraph(input.paragraph);


                        let results = Object.values(body.results);
                        for (let i = 0; i < results.length; i++) {

                            let combinedResults = Object.keys(results[i].combined);

                            for (let j = 0; j < combinedResults.length; j++) {

                                replacements.push({
                                    word: combinedResults[j],
                                    result: results[i].combined[combinedResults[j]],
                                });

                                let stringIndices = getIndicesOf(combinedResults[j], input.paragraph, false);

                                for (let k = 0; k < stringIndices.length; k++) {
                                    result.addWikipediaAnnotation(stringIndices[k], combinedResults[j], results[i].combined[combinedResults[j]]);
                                }


                            }


                        }

                        callback(result);

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

module.exports.class = TextHelpWikiSummary;


function getIndicesOf(searchStr, str, caseSensitive) {
    let searchStrLen = searchStr.length;
    if (searchStrLen === 0) {
        return [];
    }
    let startIndex = 0, index, indices = [];
    if (!caseSensitive) {
        str = str.toLowerCase();
        searchStr = searchStr.toLowerCase();
    }
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {

        let foundWord = str.substring(index - 1, index + searchStrLen + 1);
        if (foundWord.match(new RegExp("\\b" + searchStr + "\\b")) !== null) {
            indices.push(index);
        } else {
            console.log("filtered:" + foundWord);
        }

        startIndex = index + searchStrLen;
    }
    return indices;
}

