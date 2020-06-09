const i18n = require('i18n');

let localeService = {
    init: function () {

        this.i18nProvider = i18n;

        this.i18nProvider.configure({
            locales: ['en', 'es', 'de', 'sv'],
            defaultLocale: 'en',
            queryParameter: 'lang',
            syncFiles: true,
            directory: __dirname + '/locales'
        });

        this.i18nProvider.init();

    },

    getCurrentLocale: function() {
        return this.i18nProvider.getLocale();
    },

    getLocales: function() {
        return this.i18nProvider.getLocales();
    },

    setLocale: function(locale) {
        if (this.getLocales().indexOf(locale) !== -1) {
            this.i18nProvider.setLocale(locale)
        }
    },

    translate: function(what, args=undefined) {
        return this.i18nProvider.__(what, args);
    },

    translatePlural: function(what, n) {
        return this.i18nProvider.__n(what, n);
    },

    translateToLanguage(what, loc) {
        let translations = this.i18nProvider.__h(what);
        let def = what;
        for (let i=0; i < translations.length; i++) {
            if (loc in translations[i]) {
                return translations[i][loc]
            }
        }
        return def;
    },

    getSupportedLanguage(lang){

        try{
            let locales = ['en', 'es', 'de', 'sv'];

            if(locales.includes(lang)){
                return lang;
            }

            return "en";
        }catch (e) {
            console.log(e);
        }


        return "en";


    },


    setLocaleMiddleWare() {
        return (req, res, next) => {
            const queryParameter = 'lang';
            if (req.url) {
                const urlObj = url.parse(req.url, true);
                if (urlObj.query[queryParameter]) {
                    const language = urlObj.query[queryParameter].toLowerCase();
                    this.setLocale(language);
                }
            }
            next();
        }
    },


    translateSchema(schema,req){

        if(schema.properties){

            Object.keys(schema.properties).forEach(function(key,index) {

                if(typeof schema.properties[key].title !== "undefined"){
                    schema.properties[key].originalTitle = schema.properties[key].title;
                    schema.properties[key].title = req.__(schema.properties[key].title);
                }

                if(typeof schema.properties[key].description !== "undefined"){
                    schema.properties[key].originalDescription = schema.properties[key].description;
                    schema.properties[key].description = req.__(schema.properties[key].description);
                }

                if(typeof schema.properties[key].enum !== "undefined"){

                    schema.properties[key].translatedEnum = [];

                    for(let i=0; i < schema.properties[key].enum.length; i++){

                        schema.properties[key].translatedEnum.push(req.__(schema.properties[key].enum[i]))
                    }

                }
            });




        }

        return schema;




    },

    translateTextualDescription(textualDescription,req){

        if(!textualDescription){
            return null;
        }

        for(let i=0; i < textualDescription.length; i++){

            textualDescription[i].translatedContent = req.__(textualDescription[i].id);

        }

        return textualDescription;


    },

    getCatalog(){
        return this.i18nProvider.getCatalog();
    }

};

module.exports = localeService;
