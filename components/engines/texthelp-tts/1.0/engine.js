let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class TextHelpTTS extends base.EngineBase {
    constructor() {
        super();
        this.name = "Texthelp";
        this.description = "Texthelp Services";
        this.versionDescription = "Initial Version";
        this.supportCategories.push(
            {
                type: "reading_support",
                value: 10,
            }
        );
        this.ttsVoices = {
            en: "Tom",
            de: "Petra",
            es: "Monica",
            default: "Petra",

        };

        this.allTTSVoices = [
            {
                "voice": "Ava",
                "description": "US Ava - Vocalizer"

            },
            {
                "voice": "Samantha",
                "description": "US Samantha - Vocalizer"
            },
            {
                "voice": "Tom",
                "description": "US Tom - Vocalizer"
            },
            {
                "voice": "Serena",
                "description": "UK Serena - Vocalizer"
            },
            {
                "voice": "Daniel",
                "description": "UK Daniel - Vocalizer"
            },
            {
                "voice": "Fiona",
                "description": "UK Scottish Fiona - Vocalizer"
            },
            {
                "voice": "Paulina",
                "description": "Mexican Spanish Paulina - Vocalizer"
            },
            {
                "voice": "Monica",
                "description": "Spanish Monica - Vocalizer"
            },
            {
                "voice": "Carlos",
                "description": "Columbian Spanish Carlos - Vocalizer"
            },
            {
                "voice": "Miren",
                "description": "Basque Miren - Vocalizer"
            },
            {
                "voice": "Montserrat",
                "description": "Catalan Montserrat - Vocalizer"
            },
            {
                "voice": "Amelie",
                "description": "French Canadian Amelie - Vocalizer"
            },
            {
                "voice": "Audrey",
                "description": "French Audrey - Vocalizer"
            },
            {
                "voice": "Karen",
                "description": "Australian Karen - Vocalizer"
            },
            {
                "voice": "Lee",
                "description": "Australian Lee - Vocalizer"
            },
            {
                "voice": "Luciana",
                "description": "Brazilian Luciana - Vocalizer"
            },
            {
                "voice": "Claire",
                "description": "Dutch Claire - Vocalizer"
            },
            {
                "voice": "Ellen",
                "description": "Flemish Ellen - Vocalizer"
            },
            {
                "voice": "Petra",
                "description": "German Petra - Vocalizer"
            },
            {
                "voice": "Alice",
                "description": "Italian Alice - Vocalizer"
            },
            {
                "voice": "Luciana",
                "description": "Portuguese Luciana - Vocalizer"
            },
            {
                "voice": "Felipe",
                "description": "Portuguese Felipe - Vocalizer"
            },
            {
                "voice": "Alva",
                "description": "Swedish Alva - Vocalizer"
            },
            {
                "voice": "Henrik",
                "description": "Norwegian Henrik - Vocalizer"
            },
            {
                "voice": "Nora",
                "description": "Norwegian Nora - Vocalizer"
            },
            {
                "voice": "Satu",
                "description": "Finnish Satu - Vocalizer"
            },
            {
                "voice": "Damayanti",
                "description": "Indonesian Damayanti - Vocalizer"
            },
            {
                "voice": "Ewa",
                "description": "Polish Ewa - Vocalizer"
            },
            {
                "voice": "Tarik",
                "description": "Arabic Tarik - Vocalizer"
            },
            {
                "voice": "Tian-Tian",
                "description": "Mandarin Tian-tian - Vocalizer"
            },
            {
                "voice": "Milena",
                "description": "Russian Milena - Vocalizer"
            },
            {
                "voice": "Yuri",
                "description": "Russian Yuri - Vocalizer"
            },
            {
                "voice": "Veena",
                "description": "Indian English Veena - Vocalizer"
            }
        ];
    }


    getFunctions() {
        return [
            {
                id: "th_tts",
                name: "Texthelp TTS",
                description: "Converts text to Speech",
                defaultIcon: "assets/texthelp-tts.png",
                includeInDefaultProfile: false,
                supportedLanguages: ["en","de","sv"],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.SPEECH_SYNTHESIS,
                supportCategories: [
                    base.functionSupportCategories.reading_support.tts,
                ],
                inputTypes: [{
                    "inputType": ioType.IOTypes.Paragraph.className,
                    "name": "Input word",
                    "description": "Word to translate",
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.AudioType.className,
                    "name": "Output",
                    "description": "Image word",

                }],
                toolCategory: base.EngineFunction.ToolCategories.Reading,
                entryPoint: "textToSpeech",
            }

        ];
    }


    textToSpeech(callback, input, config, profile, constants) {

        let voice = this.ttsVoices.default;
        if (typeof this.ttsVoices[input.lang] !== "undefined") {
            voice = this.ttsVoices[input.lang];
        }



        this.authManager.getToken("texthelp",function (token) {

            if (!token) {
                //Error:
                callback(new ioType.IOTypes.Error("Texthelp authentication error"));

            } else {

                //Create text with TH bookmarks
                let Tokenizer = require('sentence-tokenizer');
                let myTokenizer = new Tokenizer('Chuck');
                myTokenizer.setEntry(input.paragraph);

                let sentences = myTokenizer.getSentences();
                let sentenceMap = [];
                let words = [];
                let wordMap = [];
                let text = "";
                let count = 0;
                for (let i = 0; i < sentences.length; i++) {
                    let wordTokens = myTokenizer.getTokens(i);
                    for (let j = 0; j < wordTokens.length; j++) {
                        text += " " + wordTokens[j] + '<bookmark mark="' + count + '"/>';
                        words.push(wordTokens[j]);
                        wordMap.push(count);
                        count++;
                    }


                    text += '<bookmark mark="' + count + '"/>';
                    sentenceMap.push(count);
                    count++;
                }
                //insert some space
                text += "   ";


                let options = {
                    url: 'https://easy-reading-api.dev.texthelp.com/api/v1/speech/speak',
                    method: 'POST',
                    headers: {
                        Authorization: ' Bearer ' + token,
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF8"
                    },

                    form: {
                        text: encodeURI(text),
                        voice: voice,
                    },
                    encoding: null,
                };

                let request = require('request');
                request(options, function (err, res, body) {

                    try {


                        let length = res.headers['th-time'];
                        let buf = body.slice(0, length);
                        let json = JSON.parse(String.fromCharCode.apply(null, new Uint8Array(buf)));

                        let currentWordStartTime = 0;
                        let currentSentenceStartTime = 0;

                        //AWS Style speechmarks might not be needed. But just in case
                        let speechMarksAWSStyle = "";
                        let speechMarks = [];
                        if (json.bookmarks) {
                            for (let i = 0; i < json.bookmarks.length; i++) {
                                if (wordMap.indexOf(i) !== -1) {
                                    speechMarksAWSStyle += '{"time":' + currentWordStartTime + ',"type":"word","value":"' + words[wordMap.indexOf(i)] + '"}\n';

                                    speechMarks.push({
                                        "time": currentWordStartTime,
                                        "type": "word",
                                        "value": words[wordMap.indexOf(i)],
                                    });
                                    currentWordStartTime = Math.round(json.bookmarks[i].time);
                                } else {
                                    speechMarksAWSStyle += '{"time":' + currentSentenceStartTime + ',"type":"sentence","value":"' + sentences[sentenceMap.indexOf(i)] + '"}\n';
                                    speechMarks.push({
                                        "time": currentSentenceStartTime,
                                        "type": "sentence",
                                        "value": sentences[sentenceMap.indexOf(i)],
                                    });
                                    currentSentenceStartTime = Math.round(json.bookmarks[i].time);
                                }
                            }
                        }
                        const fs = require('fs-extra');
                        let webPath = "tmp/" + profile.uuid + "/th-tts/";
                        let tempDirPath = "./public/" + webPath;
                        if (!fs.existsSync(tempDirPath)) {
                            fs.mkdirSync(tempDirPath);
                        } else {
                            fs.emptyDirSync(tempDirPath);
                        }
                        const uuidV4 = require('uuid/v4');
                        let filename = uuidV4();
                        fs.writeFile(tempDirPath + filename + ".mp3", Buffer.from(new Uint8Array(body.slice(length))), function (err) {
                            if (err) {
                                return console.log(err)
                            }

                        });
                        fs.writeFile(tempDirPath + filename + ".json", speechMarksAWSStyle, function (err) {
                            if (err) {
                                return console.log(err)
                            }
                        });
                        let result = new ioType.IOTypes.AudioType(
                            constants.url + webPath + filename + ".mp3",
                            constants.url + webPath + filename + ".json",
                            speechMarks);

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

module.exports.class = TextHelpTTS;
