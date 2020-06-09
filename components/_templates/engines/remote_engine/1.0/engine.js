var base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class RemoteFunction extends base.EngineBase {
    constructor() {
        super();
        this.id = "remote_function";
        this.name = "Remote Function";
        this.description = "Remote Function Description";
        this.version = "1.0";
        this.versionDescription = "Initial Version";

    }


    getFunctions() {
        return [
            {
                id: "remote_function_1",
                name: "Remote function 1",
                description: "Remote function 1 description",
                defaultIcon: "assets/remote_function.png",
                includeInDefaultProfile: false,
                visibleInConfiguration: true,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.DICTIONARY,
                supportedLanguages: [],
                supportCategories: [
                    base.EngineFunction.SupportCategories.UNDERSTANDING_SUPPORT.ALL,
                ],
                inputTypes: [{
                    "inputType": ioType.IOTypes.Word.className,
                    "name": "Input word",
                    "description": "Word to process",
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.Word.className,
                    "name": "Definition",
                    "description": "Result",

                }],
                toolCategory: base.EngineFunction.ToolCategories.Experimental,
                entryPoint: "remoteFunction",
            }

        ];
    }

    remoteFunction(callback, input, config,profile,constants) {

        //Return reverse word
        let result = new ioType.IOTypes.Word(this.reverse(input.word));

        callback(result);





    }
    reverse(str){
        let reversed = "";
        for (let i = str.length - 1; i >= 0; i--){
            reversed += str[i];
        }
        return reversed;
    }

}


module.exports.class = RemoteFunction;