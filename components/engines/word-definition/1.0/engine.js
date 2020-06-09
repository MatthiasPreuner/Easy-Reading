var base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class WordDefinition extends base.EngineBase {
    constructor() {
        super();
        this.id = "wikidefinition";
        this.name = "Word Definition";
        this.description = "Get definition of a word";
        this.version = "1.0";
        this.versionDescription = "Initial Version";

    }


    getFunctions() {
        return [
            {
                id: "wiktionary_dict",
                name: "Wiktionary: Word Definition",
                description: "Definition of a word",
                defaultIcon: "assets/word-definition.png",
                includeInDefaultProfile: true,
                supportedLanguages: ["en","de","sv"],
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.DICTIONARY,
                supportCategories: [
                    base.functionSupportCategories.text_support.simplified_language,
                ],
                inputTypes: [{
                    "inputType": ioType.IOTypes.Word.className,
                    "name": "Input word",
                    "description": "Word to find a definition",
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.Word.className,
                    "name": "Definition",
                    "description": "Definition of the word",

                }],
                toolCategory: base.EngineFunction.ToolCategories.Explanation,
                entryPoint: "findDefinitionForWord",
            }

        ];
    }

    findDefinitionForWord(callback, input, config,profile,constants) {

        let wd = require("word-definition");
        wd.getDef(input.word,input.lang.split('-')[0], null, function(definition) {

            if(definition.err){
                callback(new ioType.IOTypes.NoResult("No definitions found"));
            }else{
                let result = new ioType.IOTypes.Word(definition.definition,input.lang.split('-')[0]);
                callback(result);
            }

        } );
    }

}


module.exports.class = WordDefinition;