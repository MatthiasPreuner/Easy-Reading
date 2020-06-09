let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class TextHelpPicturedDictionary extends base.EngineBase {
    constructor() {
        super();
        this.name = "Texthelp Pictued Dictionary";
        this.description = "Texthelp Pictured dictionary";
        this.versionDescription = "Initial Version";

    }


    getFunctions() {
        return [
            {
                id: "picture_dictionary",
                name: "Picture Dictionary",
                description: "Texthelp picture dictionary",
                defaultIcon: "assets/texthelp-picture-dictionary.png",
                includeInDefaultProfile: false,
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.TOOLS,
                supportCategories: [
                    base.functionSupportCategories.text_support.multimedia_annotation,
                ],
                inputTypes: [{
                    "inputType": ioType.IOTypes.Word.className,
                    "name": "Input word",
                    "description": "Word to translate",
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.ImageIOType.className,
                    "name": "Image",
                    "description": "Image word",

                }],
                supportedLanguages: ["en","sv","de"],
                toolCategory: base.EngineFunction.ToolCategories.Explanation,
                entryPoint: "picturedDictionary",
            }

        ];
    }

    picturedDictionary(callback, input, config, profile, constants) {

        let pictureDictionary = this;
        this.authManager.getToken("texthelp",function (token) {

            if (!token) {
                //Error:
                callback(new ioType.IOTypes.Error("Texthelp authentication error"));

            } else {

                if(input.lang === "en"){

                    pictureDictionary.createPictureRequest(token,callback, input, config, profile, constants);

                }else{

                    let core = require("../../../../core/core");

                    let translate = core.getEngine("translate");

                    translate.translateWord(
                        function (result) {

                            if(result.name === "Error"){
                                callback(result);
                            }else{

                                pictureDictionary.createPictureRequest(token,callback, result, {lang :"en"}, profile, constants);
                            }



                        }, input, config, profile, constants
                    );


                }

            }
        });
    }

    createPictureRequest(token,callback, input, config, profile, constants){
        let options = {
            url: 'https://easy-reading-api.dev.texthelp.com//api/v1/picturedictionary/get',
            method: 'POST',
            headers: {
                Authorization: ' Bearer ' + token,
            },
            json: {
                text: input.word,
            }
        };
        let request = require('request');
        request(options, function (err, res, body) {
            try {
                if(!body.symbols){
                    callback(new ioType.IOTypes.Error("Error processing request"));
                }else if (body.symbols.length === 0) {

                    callback(new ioType.IOTypes.NoResult("No images found"));

                } else {

                    let src = body.symbols[0];
                    let result = new ioType.IOTypes.ImageIOType(src, body.word, body.word);
                    callback(result);
                }

            } catch (err) {
                //Error:
                callback(new ioType.IOTypes.Error("Error processing request"));
                console.log(err);
            }
        });
    }


}
module.exports.class = TextHelpPicturedDictionary;


