var base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class MicrosoftTextAnalyticsKeyPhrase extends base.EngineBase {

    constructor() {
        super();
        this.id = "MicrosoftKeyPhrase";
        this.name = "Microsoft Text Analytics Key Phrase";
        this.description = "Detects Key Phrases";
        this.version = "1.0";
        this.versionDescription = "Initial Version";
        this.client = null;
        this.initMicrosoftTextAnalyticsClient();
    }
    getCredentials() {

        let credentialManager = require("../../../../core/util/credential-manager");

        if (process.env.MICROSOFT_AZURE_TEXTANALYTICS) {

            return {
                credential: process.env.MICROSOFT_AZURE_TEXTANALYTICS,
            }
        }

        if (credentialManager.hasKey("MICROSOFT_AZURE_TEXTANALYTICS")) {

            return {
                credential: credentialManager.getValueForKey("MICROSOFT_AZURE_TEXTANALYTICS"),
            }
        }

    }

    initMicrosoftTextAnalyticsClient() {
        let credentials = this.getCredentials();

        if(credentials){
            try {
                const CognitiveServicesCredentials = require("@azure/ms-rest-js");
                const TextAnalyticsAPIClient = require("@azure/cognitiveservices-textanalytics");
                const creds = new CognitiveServicesCredentials.ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': credentials.credential } });
                this.client = new TextAnalyticsAPIClient.TextAnalyticsClient(creds, "https://eaysyreadingtextanalysis.cognitiveservices.azure.com/");


            } catch (e){
                console.log(e);
            }
        }else{
            console.log("No credentials found for MICROSOFT_AZURE_TEXTANALYTICS");
        }

    }


    getFunctions() {
        return [
            {
                id: "ms_text_analytics_key_phrase",
                name: "MS: Key Phrase Detection",
                description: "Detects key phrases in a given text.",
                defaultIcon: "assets/translate.png",
                includeInDefaultProfile: false,
                supportedLanguages: ["en","de","sv"],
                visibleInConfiguration: false,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.DICTIONARY,
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
                toolCategory: base.EngineFunction.ToolCategories.Other,
                entryPoint: "detectKeyPhrases",
            },

        ];
    }

    detectKeyPhrases(callback, input, config,profile,constants) {


        let Tokenizer = require('sentence-tokenizer');
        let myTokenizer = new Tokenizer('Chuck');
        myTokenizer.setEntry(input.paragraph);
        let sentences =  myTokenizer.getSentences();



        let keyPhraseInput = {
            documents: []
        };

        for(let i=0; i < sentences.length; i++){
            let newSentence = {
                language: input.lang,
                id: (i+1).toString(),
                text: sentences[i]
            };
            if(i > 0){
                newSentence.text = " "+newSentence.text;
            }
            keyPhraseInput.documents.push(newSentence);
        }


        let operation = this.client.keyPhrases({
            multiLanguageBatchInput: keyPhraseInput
        });
        operation
            .then(result => {

                if(result.documents){
                    let keyPhraseTags = [];
                    for(let i=0; i < result.documents.length; i++){

                        for(let j=0; j < keyPhraseInput.documents.length; j++){

                            if(result.documents[i].id === keyPhraseInput.documents[j].id){


                                let currentSentenceTags = [];
                                currentSentenceTags.push(ioType.IOTypes.TaggedText.createPOSTag(keyPhraseInput.documents[j].text));



                                for(let k=0; k < result.documents[i].keyPhrases.length; k++){



                                    for(let p=0; p < currentSentenceTags.length; p++){

                                        if(!currentSentenceTags[p].tags){
                                            let currentKeyPhrase = result.documents[i].keyPhrases[k];
                                            let sentence = currentSentenceTags[p].text;
                                            let sentenceParts = sentence.split(currentKeyPhrase);
                                            let newPosTags = [];

                                            for(let l=0; l < sentenceParts.length; l++){

                                                if(sentenceParts[l]=== ""){

                                                    newPosTags.push(ioType.IOTypes.TaggedText.createPOSTag(currentKeyPhrase,["keyword"]));
                                                }else{
                                                    newPosTags.push(ioType.IOTypes.TaggedText.createPOSTag(sentenceParts[l]));

                                                    if(l !== sentenceParts.length-1){
                                                        newPosTags.push(ioType.IOTypes.TaggedText.createPOSTag(currentKeyPhrase,["keyword"]));
                                                    }
                                                }


                                            }

                                            if(newPosTags.length > 1){

                                                currentSentenceTags.splice(p,1);

                                                for(let x = newPosTags.length-1; x >=0; x--){
                                                    currentSentenceTags.splice(p,0,newPosTags[x]);

                                                }

                                                p = p+newPosTags.length-1;


                                            }



                                        }


                                    }




                                }


                                keyPhraseTags = keyPhraseTags.concat(currentSentenceTags);




                            }
                        }


                    }

                    let newResult = new ioType.IOTypes.TaggedText(input.paragraph,keyPhraseTags);


                    callback(newResult);
                }
            })
            .catch(err => {
                throw err;
            });
    }

}

module.exports.class = MicrosoftTextAnalyticsKeyPhrase;
