var base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class Dictionary extends base.EngineBase {
    constructor() {
        super();
        this.id = "Dictionary";
        this.name = "Dictionary";
        this.description = "A simple online dictionary";
        this.version = "1.0";
        this.versionDescription = "Initial Version";
    }

    getDataSchema() {
        return {};
    }

    getFunctions() {
        return [
            {
                id: "simple_dict",
                name: "Dictionary",
                description: "Word definitions from Wiktionary",
                defaultIcon: "assets/dictionary.png",
                includeInDefaultProfile: false,
                supportedLanguages: [],
                visibleInConfiguration: false,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.DICTIONARY,
                inputTypes: [{
                    "inputType": ioType.IOTypes.Word.className,
                    "name": "Input word",
                    "description": "Word to translate",
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.Word.className,
                    "name": "Output word",
                    "description": "Translated word",

                }],
                additionalOutput: [{
                    "outputType": ioType.IOTypes.Sentence.className,
                    "name": "Meaning",
                    "description": "Meaning of the word explained with a sentence",

                }],
                toolCategory: base.EngineFunction.ToolCategories.Explanation,
                entryPoint: "dictionary",
            }

        ];
    }

    dictionary(webSocketConnection, req, config) {

        let https = require('follow-redirects').https;
        let options = {
            host: 'glosbe.com',
            path: '/gapi/translate?from=' + encodeURIComponent(req.input.lang.split('-')[0]) + '&dest='+encodeURIComponent(config.language)+'&format=json&phrase=' + encodeURIComponent(req.input.value) + '&pretty=true',
            method: 'GET',

        };

        let reqGet = https.request(options, function (res) {

            let rawData = "";
            res.on('data', function (data) {
                if (res.statusCode === 200) {
                    try {
                        rawData = rawData + data;

                    } catch (e) {
                        console.error(e.message);

                    }
                }
            });
            res.on('end', function () {
                try {
                    //Do not know api good enough :-/
                    const parsedData = JSON.parse(unescape(rawData));
                    let wordText = '';
                    if (typeof parsedData.tuc !== 'undefined') {
                        if(parsedData.tuc.length > 0){
                            if(typeof parsedData.tuc[0].phrase !== 'undefined'){
                                wordText = parsedData.tuc[0].phrase.text;
                            }else if(typeof parsedData.tuc[0].meanings !== 'undefined'){
                                wordText = parsedData.tuc[0].meanings[0].text;
                            }else{

                            }
                        }else{

                            wordText = "No results found.";
                        }
                    }else{
                        wordText = "No results found.";
                    }
                    req.result = new ioType.IOTypes.Word(wordText);
                    res.outputType = ioType.IOTypes.Word.className;
                    req.type = "cloudRequestResult";
                    webSocketConnection.sendMessage(req);
                } catch (e) {
                    console.error(e.message);
                    req.result = new ioType.IOTypes.Word("Error handling request.");
                    res.outputType = ioType.IOTypes.Word.className;
                    req.type = "cloudRequestResult";
                    webSocketConnection.sendMessage(req);
                }
            });

        });

        reqGet.end();
        reqGet.on('error', function (e) {
            console.error(e);
            req.result = new ioType.IOTypes.Word("Error handling request.");
            res.outputType = ioType.IOTypes.Word.className;
            req.type = "cloudRequestResult";
            webSocketConnection.sendMessage(req);
        });


    }


}


module.exports.class = Dictionary;