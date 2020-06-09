let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class ImageSearch extends base.EngineBase {
    constructor() {
        super();
        this.id = "ImageSearch";
        this.name = "Image Search";
        this.description = "A simple online image search";
        this.version = "1.0";
        this.versionDescription = "Initial Version";

    }


    getFunctions() {
        return [
            {
                id: "image_search",
                name: "Image Search",
                description: "Simple image search using Google Image Search",
                defaultIcon: "assets/image_search.png",
                includeInDefaultProfile: true,
                supportedLanguages: [],
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
                toolCategory: base.EngineFunction.ToolCategories.Explanation,
                entryPoint: "getImage",
            }

        ];
    }

    getDataSchema() {
        return {};
    }

    getCredentials() {

        if (process.env.GOOGLE_IMAGE_SEARCH) {

            return process.env.GOOGLE_IMAGE_SEARCH;
        }

        if (this.credentialManager.hasKey("GOOGLE_IMAGE_SEARCH")){
            return this.credentialManager.getValueForKey("GOOGLE_IMAGE_SEARCH");
        }
    }

    getImage(callback, input, config,profile,constants) {

        let credentials = this.getCredentials();

        if(!credentials){
            callback(new ioType.IOTypes.Error("No credentials found for Google image search"));
            return;
        }


        let https = require('follow-redirects').https;
        let optionsget = {
            host : 'www.googleapis.com',
            path : '/customsearch/v1?key='+credentials+'&q='+encodeURIComponent(input.word)+'&searchType=image&alt=json&num=10&start=1&imgType=clipart',
            method : 'GET',

        };


        let reqGet = https.request(optionsget, function(res) {

            let allData = "";
            res.on('data', function(d) {
                 if(res.statusCode === 200) {
                     allData = allData + d;

                 }

            });

            res.on('end', function () {
                try {
                    let imgSearchResult =  JSON.parse(unescape(allData));
                    let ioType = rootRequire("core/IOtypes/iotypes");
                    let result = new ioType.IOTypes.ImageIOType("");
                    if(imgSearchResult.items[0].link !== null){
                        result.url = imgSearchResult.items[0].link;
                        result.alt = imgSearchResult.items[0].title;
                        result.title = imgSearchResult.items[0].title;
                    }
                   callback(result);
                }catch(error){
                    //Error:
                    callback(new ioType.IOTypes.Error("Error retrieving images"));

                }
            });
        });
        reqGet.end();
        reqGet.on('error', function(e) {
            console.error(e);
            //Error:
            callback(new ioType.IOTypes.Error("Error retrieving images"));
        });


    }


}


module.exports.class = ImageSearch;