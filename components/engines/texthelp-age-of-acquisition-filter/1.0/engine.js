let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class TextHelpAgeOfAcquisitionFilter extends base.EngineBase {
    constructor() {
        super();
        this.name = "Texthelp";
        this.description = "Texthelp Services";
        this.versionDescription = "Initial Version";


    }


    getFunctions() {
        return [
            {
                id: "filterWordsOfAnnotatedParagraph",
                name: "Filter easy words of paragraph",
                description: "Texthelp filtering words",
                defaultIcon: "assets/texthelp-age.png",
                includeInDefaultProfile: false,
                supportedLanguages: ["en"],
                visibleInConfiguration: false,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.TOOLS,
                inputTypes: [{
                    "inputType": ioType.IOTypes.AnnotatedParagraph.className,
                    "name": "Paragraph with annotations",
                    "description": "Paragraph with word annotations",
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.AnnotatedParagraph.className,
                    "name": "Annotation paragraph with filtered annotations",
                    "description": "Filters elements which are too low",

                }],
                toolCategory: base.EngineFunction.ToolCategories.Other,
                entryPoint: "filterWordsOfAnnotatedParagraph",
            },


        ];
    }

    filterWordsOfAnnotatedParagraph(callback, input, config, profile, constants) {

        this.authManager.getToken("texthelp",function (token) {

            if (!token) {
                //Error:
                callback(new ioType.IOTypes.Error("Texthelp authentication error"));

            }  else {

                //If no input... send it back and break.
                if(input.annotations.length === 0){

                    callback(input);
                    return;
                }

                let resultsReceived = 0;
                let filteredAnnotations = [];

                let allAnnotations = [];
                for (let i = 0; i < input.annotations.length; i++) {

                    if(allAnnotations.indexOf(input.annotations[i].textToAnnotate) === -1 ){
                        allAnnotations.push(input.annotations[i].textToAnnotate);
                    }
                }
                let allAnnotationsString = allAnnotations.join(" ");

                let options = {
                    url: 'https://easy-reading-api.dev.texthelp.com/api/v1/ageofacquisition',
                    method: 'POST',
                    headers: {
                        Authorization: ' Bearer ' + token,
                    },
                    json: {
                        content: allAnnotationsString,
                    }
                };
                let request = require('request');
                request(options, function (err, res, body) {
                    try {
                        //    let response = JSON.parse(body);
                        let output = "";
                        if (body.status === "success") {

                            //let words = Object.entries(body.data.words).map(([word, value]) => ({word,value}));

                            let words = body.data.words;

                            for(let i= 0; i < input.annotations.length; i++){

                                let wordsOfAnnotation = input.annotations[i].textToAnnotate.split(" ");

                                let averageAge = 0;

                                for(let j=0; j < wordsOfAnnotation.length; j++){

                                    let value = words[wordsOfAnnotation[j]];
                                    if(value){
                                        averageAge+=value;
                                    }
                                }

                                if(averageAge === 0 || averageAge > 12){
                                    filteredAnnotations.push(input.annotations[i]);
                                }


                            }

                            let result = new ioType.IOTypes.AnnotatedParagraph(input.paragraph,filteredAnnotations,input.lang,input.description);
                            callback(result);

                        } else {
                            //Error:
                            callback(new ioType.IOTypes.Error("Error processing request"));
                        }

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

module.exports.class = TextHelpAgeOfAcquisitionFilter;
