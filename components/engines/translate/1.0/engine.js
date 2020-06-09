var base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class Translate extends base.EngineBase {

    constructor() {
        super();
        this.id = "Translate";
        this.name = "Translate";
        this.description = "Translate a word or sentence from one language to another";
        this.version = "1.0";
        this.versionDescription = "Initial Version";

        this.translate = null;
        this.initAWSTranslate();
    }

    initAWSTranslate() {
        try {
            const AWS = require('aws-sdk');
            this.translate = new AWS.Translate({
                signatureVersion: 'v4',
                region: 'eu-central-1'
            });
        } catch (exeption){
            console.log(exeption);
            this.translate = null;
        }
    }

    getDataSchema() {
        return {
            "type": "object",
            "properties": {
                "language": {
                    "type": "string",
                    "title": "Language",
                    "description": "Your preferred language",
                    "default": "profile",
                    "enum": [
                        "profile",
                        'en',
                        "fr",
                        "de",
                        "es",
                        "sv",
                    ],
                }
            },
            "required": [
                "language"
            ]
        };
    }

    getConfigurationDataOptions() {
        return [{
            type: "singleSelectList",
            dataSchemaProerty: ["language"],
            configurableDataOption: [
                {"label": "Users language", "value": "profile"},
                {"label": "English", "value": "en"},
                {"label": "French", "value": "fr"},
                {"label": "German", "value": "de"},
                {"label": "Spanish", "value": "es"},
                {"label": "Swedish", "value": "sv"}
            ]
        }]
    }

    createIconsForSchemaProperties(){
        this.createIconForSchemaPropertyValue("language","profile","assets/profile_language.png","radio_button_icon");
        this.createIconForSchemaPropertyValue("language","en","assets/en_icon.png","radio_button_icon");
        this.createIconForSchemaPropertyValue("language","fr","assets/fr_icon.png","radio_button_icon");
        this.createIconForSchemaPropertyValue("language","de","assets/de_icon.png","radio_button_icon");
        this.createIconForSchemaPropertyValue("language","es","assets/es_icon.png","radio_button_icon");
        this.createIconForSchemaPropertyValue("language","sv","assets/sv_icon.png","radio_button_icon");

    }


    getFunctions() {
        return [
            {
                id: "aws_tr",
                name: "AWS: Translate Paragraph",
                description: "Translate a paragraph via Amazon translate",
                defaultIcon: "assets/translate.png",
                includeInDefaultProfile: false,
                supportedLanguages: ["en","de","sv"],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.DICTIONARY,
                supportCategories: [

                    base.functionSupportCategories.text_support.translation,
                ],
                inputTypes: [
                    {
                        "inputType": ioType.IOTypes.Paragraph.className,
                        "name": "Input paragraph",
                        "description": "Paragraph to translate",
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
                entryPoint: "translateText",
            },
            {
                id: "aws_tr_word",
                name: "AWS: Translate Word",
                description: "Translate a word via Amazon translate",
                defaultIcon: "assets/translate.png",
                includeInDefaultProfile: false,
                supportedLanguages: ["en","de","sv"],
                visibleInConfiguration: false,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.DICTIONARY,
                inputTypes: [
                    {
                        "inputType": ioType.IOTypes.Word.className,
                        "name": "Input paragraph",
                        "description": "Paragraph to translate",
                    }
                ],
                outputTypes: [
                    {
                        "outputType": ioType.IOTypes.Word.className,
                        "name": "Paragraph word",
                        "description": "Translated word",
                    }
                ],
                toolCategory: base.EngineFunction.ToolCategories.Other,
                entryPoint: "translateWord",
            }
        ];
    }

    translateText(callback, input, config,profile,constants) {

        let source_lang = input.lang;

        let target_lang = profile.locale;
        if(config.language !== "profile"){
            target_lang = config.language;
        }




        if (source_lang && target_lang && source_lang !== target_lang) {
            let params = {
                'Text': input.paragraph,
                'SourceLanguageCode': source_lang,
                'TargetLanguageCode': target_lang,
            };

            this.translate.translateText(params, function (err, data) {
                let error = false;
                if (err) {
                    error = true;
                    console.log(err.code)
                } else if (data && data.TranslatedText) {
                    error = false;
                    let result = new ioType.IOTypes.Paragraph(data.TranslatedText);

                    callback(result);
                } else {
                    error = true;
                    console.log('Translate: no error but not data in response.')
                }
                if (error) {

                    //Error:
                    callback(new ioType.IOTypes.Error("The chosen text could not be translated."));
                    console.log(err);
                }
            });
        } else {
            let result = new ioType.IOTypes.Paragraph(input.paragraph);
            callback(result);
        }
    }

    translateWord(callback, input, config,profile,constants) {

        let source_lang = input.lang;
        let target_lang = "en";

        if (source_lang && target_lang && source_lang !== target_lang) {
            let params = {
                'Text': input.word,
                'SourceLanguageCode': source_lang,
                'TargetLanguageCode': target_lang,
            };

            this.translate.translateText(params, function (err, data) {
                if (err) {
                    if(err.message){
                        callback(new ioType.IOTypes.Error("Error:"+err.message));
                    }else{

                        callback(new ioType.IOTypes.Error("Error processing request"));
                    }
                } else if (data && data.TranslatedText) {
                     let result = new ioType.IOTypes.Word(data.TranslatedText);
                   callback(result);
                } else {
                    console.log('Translate: no error but not data in response.');
                    callback(new ioType.IOTypes.Error("Error processing request"));
                }
            });
        } else {
            let result = new ioType.IOTypes.Word(input.word);

            callback(result);
        }
    }
}

module.exports.class = Translate;
