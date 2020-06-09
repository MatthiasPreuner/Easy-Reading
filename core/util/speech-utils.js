let fs = require('fs-extra');
let path = require('path');
let core = require("./../core");
const baseDir = "/public/audio/speech/";
const webDir = "/audio/speech/";
const striptags = require('striptags');

let speechUtils = {
    createSpeechForAllCatalogues: async function () {
        let localeService = require("../i18n/locale-service");

        if (fs.existsSync(path.join(__dirname, "../../", baseDir))) {
            fs.removeSync(path.join(__dirname, "../../", baseDir));
            console.log("deleting old TTS complete!");
        }

        fs.mkdirSync(path.join(__dirname, "../../", baseDir));

        let catalogues = localeService.getCatalog();

        for (let lang in catalogues) {
            if (catalogues.hasOwnProperty(lang)) {

                let catalogue = catalogues[lang];

                console.log("Starting Catalogue:" + lang);
                let allEntriesCount = Object.keys(catalogue).length;
                let i=0;
                for (let entry in catalogue) {
                    if (catalogue.hasOwnProperty(entry)) {
                        let id = speechUtils.getHashForString(entry);
                        let speech = catalogue[entry];
                        console.log("TTS:"+i+"/"+allEntriesCount+" - " + speech);
                        i++;
                        await speechUtils.getSpeechForString(id, speech, lang);
                    }
                }


            }
        }


    },
    getHashForString(stringId) {

        //Returns an integer hash for a string
        const stringHash = require("string-hash");
        return stringHash(stringId);


    },

    getSpeechForString: async function (id, string, lang) {

        try {


            let dir = baseDir + id + "/";
            let dirAlreadyExists = await fs.exists(path.join(__dirname, "../../", dir));
            if (!dirAlreadyExists) {
                await fs.mkdir(path.join(__dirname, "../../", dir));
            }

            dir += lang + "/";
            let speechAlreadyExists = await fs.exists(path.join(__dirname, "../../", dir));
            if (!speechAlreadyExists) {


                await fs.mkdir(path.join(__dirname, "../../", dir));

                let awsPolly = core.getEngine("aws-polly-tts");

                if (!awsPolly.polly) {
                    return null;
                }

                let voiceID = awsPolly.getVoiceID(
                    {
                        language: "language_of_website",
                        gender: "female",

                }, lang);
                let params = {

                    'OutputFormat': 'mp3',
                    'VoiceId': voiceID,
                    'SampleRate': '22050',
                    'Text': striptags(string)
                };


                const util = require('util');
                let data = await awsPolly.polly.synthesizeSpeech(params).promise();
                if (data.AudioStream instanceof Buffer) {

                    fs.writeFile("./" + dir + "speech.mp3", data.AudioStream, function (err) {
                        if (err) {
                            console.log(err);

                        }
                    });
                }
            }


            return dir + "speech.mp3";


        } catch (err) {
            console.error(err)
        }


    },
    getAudioSourceForString(stringID, lang) {
        return webDir+speechUtils.getHashForString(stringID)+"/"+lang+"/speech.mp3";
    },

};

module.exports = speechUtils;



