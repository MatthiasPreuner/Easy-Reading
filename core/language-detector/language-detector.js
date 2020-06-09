let languageDetector = {
    init: function () {
        const LanguageDetect = require('languagedetect');
        this.detector = new LanguageDetect();
        this.languageList = require('language-list')();
        this.commonLanguages = [
            "en",
            "de",
            "sv",
            "es",
            "fr",
            "it",
            "pt",
            "nb",
            "nl",
            "el",
        ]

    },


    detectLanguage:function (text,profileLanguage, lang) {




        let trimmedText = (text.substring(0, 200)).trim();

        let result = this.detector.detect(trimmedText);



        let detectedCommonLanguage = detectCommonLanguageOfResult(result);
        let profileLanguageProbability = detectLanguageProbability(result,profileLanguage);
        let languageProbability =  detectLanguageProbability(result,lang);

        if(detectedCommonLanguage){


            //Longer text is more reliable...
            if(trimmedText.length > 50){
                //check if page language is likely
                if(detectedCommonLanguage.probability -  languageProbability < 0.09){

                    return lang;

                }
            }else {
                //check if page language is likely
                if(lang !== "undefined" && lang){
                    if(detectedCommonLanguage.probability -  languageProbability < 0.35){

                        return lang;

                    }
                }

            }




            //if user profile language is likely
            if(detectedCommonLanguage.probability -  profileLanguageProbability < 0.05){

                return profileLanguage;

            }

            //return detected
            return detectedCommonLanguage.languageCode;

        }


        if(lang !== "undefined"){
            return lang;
        }

        return profileLanguage;


    },



};


function detectLanguageProbability(result,lang){

    if(lang === "undefined"){
        return 0;
    }
    //Iterate through results
    for(let i=0; i < result.length;i++) {
        if ((result[i][1] < 0.14)) {
            return 0;
        }
        //If profile language within 17% - it is very possible that its the profiles language
        let languageCode = languageDetector.languageList.getLanguageCode(result[i][0]);

        if(languageCode === lang){
            return result[i][1];
        }
    }

    return 0;
}

function detectCommonLanguageOfResult(result) {
    //Iterate through results - skip languages like "pidgin"
    for(let i=0; i < result.length;i++) {
        if(result[i][1] < 0.15){
            return null;
        }
        let languageCode = languageDetector.languageList.getLanguageCode(result[i][0]);
        if(languageCode){
            if(languageDetector.commonLanguages.includes(languageCode)){


                return {
                    languageCode: languageCode,
                    probability : result[i][1]
                };
            }
        }
    }
}

module.exports = languageDetector;