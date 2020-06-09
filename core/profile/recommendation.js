let localeService = require("../i18n/locale-service");
let i18n = require("i18n");

class Recommendation {
    constructor(type, functions, recommendationMethod) {
        this.type = type;
        this.functions = functions;
        this.recommendationMethod = recommendationMethod;





    }

    createFunctionInformation(profile) {
        for (let i = 0; i < this.functions.length; i++) {
            this.functions[i] = {...(this.functions[i].getFunctionInformation(profile.locale))};
            if(this.functions[i].contentScripts){
                delete this.functions[i].contentScripts;
            }

            if(this.functions[i].contentCSS){
                delete this.functions[i].contentCSS;
            }

            this.functions[i].transtlatedTitle = localeService.translateToLanguage(this.functions[i].engine.id + "." + this.functions[i].engine.version + "." + this.functions[i].id + ".title", profile.locale)
            this.functions[i].translatedDescription = localeService.translateToLanguage(this.functions[i].engine.id + "." + this.functions[i].engine.version + "." + this.functions[i].id + ".description", profile.locale)


        }

        if (this.functions.length === 1) {

            if (this.type === "add") {
                this.title = i18n.__({
                    phrase: 'recommendation_add_function_title',
                    locale: profile.locale
                });
                this.description = i18n.__(
                    {
                        phrase: 'recommendation_add_function_description',
                        locale: profile.locale
                    });
            } else if (this.type === "remove") {
                this.title = i18n.__({
                    phrase: 'recommendation_remove_function_title',
                    locale: profile.locale,
                });
                this.description = i18n.__({
                    phrase:'recommendation_remove_function_description',
                    locale: profile.locale
                });
            }

        } else {
            if (this.type === "add") {
                this.title = i18n.__({
                    phrase: 'recommendation_add_functions_title',
                    locale: profile.locale,
                });

                this.description = i18n.__({
                    phrase:'recommendation_add_functions_description',
                    locale: profile.locale
                });
            } else if (this.type === "remove") {
                this.title = i18n.__({
                    phrase: 'recommendation_remove_functions_title',
                    locale: profile.locale,
                });

                this.description = i18n.__({
                    phrase:'recommendation_remove_functions_description',
                    locale: profile.locale
                });
            }

        }

        this.yes = i18n.__({
            phrase: 'yes',
            locale: profile.locale
        });
        this.no = i18n.__({
            phrase: 'no',
            locale: profile.locale
        });
    }



    normalizeIconPaths(url) {
        for (let i = 0; i < this.functions.length; i++) {

            this.functions[i].defaultIconURL = url + this.functions[i].defaultIconURL;
        }
    }

}


module.exports = Recommendation;