let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class AWSPollyTextToSpeech extends base.EngineBase {
    constructor() {
        super();
        this.name = "AWS Polly TTS";
        this.description = "A text to speech engine hosted on AWS";
        this.versionDescription = "Initial Version";
        this.polly = null;
        this.initPolly();

    }

    initPolly() {

        try {

            const AWS = require('aws-sdk');
            const Fs = require('fs');

            this.polly = new AWS.Polly({
                signatureVersion: 'v4',
                region: 'eu-central-1'
            });

        } catch (exeption) {

            console.log(exeption);
            this.polly = null;
        }


    }

    getConfigurationDataOptions() {
        return [{
            type: "singleSelectList",
            dataSchemaProerty: ["language"],
            configurableDataOption: [
                {"label": "Language of the actual website", "value": "language_of_website"},
                {"label": "English", "value": "en"},
                {"label": "French", "value": "fr"},
                {"label": "German", "value": "de"},
                {"label": "Spanish", "value": "es"},
                {"label": "Swedish", "value": "sv"}
            ]
        },
            {
                type: "singleSelectList",
                dataSchemaProerty: ["gender"],
                configurableDataOption: [
                    {"label": "Male", "value": "male"},
                    {"label": "Female", "value": "female"},
                ]
            }

        ]
    }


    getDataSchema() {
        return {
            "type": "object",
            "properties": {
                "language": {
                    "type": "string",
                    "title": "Language",
                    "description": "Your preferred language",
                    "default": "language_of_website",
                    "enum": [
                        "language_of_website",
                        "en",
                        "de",
                        "es",
                        "fr",
                        "sv",
                    ],
                },
                "gender": {
                    "type": "string",
                    "title": "Language",
                    "description": "Preferred gender of the language",
                    "default": "female",
                    "enum": [
                        "male",
                        "female",
                    ],
                },

            },
            "required": [
                "language",
                "gender",
                "languagePriority"

            ]
        };
    }

    createIconsForSchemaProperties(){
        this.createIconForSchemaPropertyValue("language","language_of_website","assets/language_of_website_icon.png","radio_button_icon");
        this.createIconForSchemaPropertyValue("language","en","assets/en_icon.png","radio_button_icon");
        this.createIconForSchemaPropertyValue("language","de","assets/de_icon.png","radio_button_icon");
        this.createIconForSchemaPropertyValue("language","es","assets/es_icon.png","radio_button_icon");
        this.createIconForSchemaPropertyValue("language","fr","assets/fr_icon.png","radio_button_icon");
        this.createIconForSchemaPropertyValue("language","sv","assets/sv_icon.png","radio_button_icon");

    }

    getFunctions() {
        return [
            {
                id: "tts",
                name: "AWS: Polly",
                description: "Converts text to Speech",
                defaultIcon: "assets/text-to-speech.png",
                includeInDefaultProfile: true,
                supportedLanguages: ["en", "de", "sv", "es"],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.SPEECH_SYNTHESIS,
                supportCategories: [

                    base.functionSupportCategories.reading_support.tts,
                ],
                inputTypes: [
                    {
                        "inputType": ioType.IOTypes.Paragraph.className,
                        "name": "Input paragraph",
                        "description": "Paragraph to convert to audio",
                    },
                    {
                        "inputType": ioType.IOTypes.Word.className,
                        "name": "Input word",
                        "description": "Word to convert to audio",
                    }
                ],
                outputTypes: [{
                    "outputType": ioType.IOTypes.AudioType.className,
                    "name": "Output",
                    "description": "Image word",

                }],
                toolCategory: base.EngineFunction.ToolCategories.Reading,
                entryPoint: "convertTextToSpeech",
            }
        ];
    }

    /*
    createTextualDescription(){

        this.textualDescription = [
            {
                functionID: "tts",
                description:[
                    this.descriptionManager.createTextEntry(this,"intro_text","You can have the text read aloud."),
                    this.descriptionManager.createOrderedListItemEntry(this,"instruction_1","Click on Text to Speech."),
                    this.descriptionManager.createOrderedListItemEntry(this,"instruction_2","Click at the beginning of the text that you want to read aloud. Voice output starts."),
                    this.descriptionManager.createOrderedListItemEntry(this,"instruction_3","You can have the text read aloud."),
                    this.descriptionManager.createEntryForImage(this,"instruction_image","assets/test.png","some alt text","description_image"),
                ]
            }

        ];
    }
    */

    convertTextToSpeech(callback, input, config, profile, constants) {


        let voiceID = this.getVoiceID(config,input.lang);

        let params = {

            'OutputFormat': 'mp3',
            'VoiceId': voiceID,
            'SampleRate': '22050',
            //  'SpeechMarkTypes':['word','sentence']
        };

        if (input.name === "Paragraph") {
            params.Text = input.paragraph + "          ";
        } else if (input.name === "Word") {
            params.Text = input.word;
        }

        let ioType = rootRequire("core/IOtypes/iotypes");
        let polly = this.polly;
        const fs = require('fs-extra');
        let webPath = "tmp/" + profile.uuid + "/aws-polly-tts/";
        let tempDirPath = "./public/" + webPath;
        this.polly.synthesizeSpeech(params, (err, data) => {
            if (err) {

                //Error:


                if(err.message){
                    callback(new ioType.IOTypes.Error("Error:"+err.message));
                }else{

                    callback(new ioType.IOTypes.Error("Error synthesize speech"));
                }
            } else if (data) {
                if (data.AudioStream instanceof Buffer) {

                    if (!fs.existsSync(tempDirPath)) {
                        fs.mkdirSync(tempDirPath);

                    } else {

                        try {
                            fs.emptyDirSync(tempDirPath);
                        } catch (error) {
                            //Error:
                            callback(new ioType.IOTypes.Error("Error writing data"));
                            console.log(error);
                        }


                    }

                    const uuidV4 = require('uuid/v4');
                    let filename = uuidV4();

                    fs.writeFile(tempDirPath + filename + ".mp3", data.AudioStream, function (err) {
                        if (err) {
                            //Error:
                            callback(new ioType.IOTypes.Error("Error writing data"));
                        }

                        params.OutputFormat = "json";
                        params.SpeechMarkTypes = ['word', 'sentence'];

                        polly.synthesizeSpeech(params, (err, data) => {
                            if (err) {
                                console.log(err.code)
                            } else if (data) {
                                if (data.AudioStream instanceof Buffer) {

                                    fs.writeFile(tempDirPath + filename + ".json", data.AudioStream, function (err) {
                                        if (err) {
                                            //Error:
                                            callback(new ioType.IOTypes.Error("Error writing json"));
                                        }

                                    });

                                    let speechMarksSource = data.AudioStream.toString().split("\n");

                                    let speechMarks = [];
                                    //Last line is blank in AWS Polly
                                    for (let i = 0; i < speechMarksSource.length - 1; i++) {
                                        try {
                                            let currentSpeechMark = JSON.parse(speechMarksSource[i]);
                                            speechMarks.push(currentSpeechMark);
                                        } catch (error) {
                                            //Error:
                                            callback(new ioType.IOTypes.Error("Error writing speech marks"));
                                        }

                                    }


                                    let audioURL = constants.url + webPath + filename + ".mp3";
                                    let speechMarkURL = constants.url + webPath + filename + ".json";

                                    let result = new ioType.IOTypes.AudioType(audioURL, speechMarkURL,
                                        speechMarks);

                                    callback(result);
                                }
                            }
                        });
                    });
                }
            }
        });

    }


    getVoiceID(config, websiteLanguage) {

        let languageToUse = websiteLanguage;

        if (config.language !== "language_of_website") {
            languageToUse = config.language;
        }

        switch (languageToUse) {
            case "sv":
                return "Astrid";
            case "es":

                if (config.gender === "female") {
                    return "Conchita";
                } else {
                    return "Enrique";
                }

                break;
            case "it":

                if (config.gender === "female") {
                    return "Bianca";
                } else {
                    return "Giorgio";
                }

                break;
            case "fr":

                if (config.gender === "female") {
                    return "Lea";
                } else {
                    return "Mathieu";
                }

                break;
            case "de":

                if (config.gender === "female") {
                    return "Marlene";
                } else {
                    return "Hans";
                }

                break;
            case "en":

                if (config.gender === "female") {
                    return "Emma";
                } else {
                    return "Brian";
                }

                break;
            default:
                if (config.gender === "female") {
                    return "Emma";
                } else {
                    return "Brian";
                }
        }

    }


}


module.exports.class = AWSPollyTextToSpeech;