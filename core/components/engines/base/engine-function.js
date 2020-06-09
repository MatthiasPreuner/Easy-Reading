'use strict';
const localeService = require("./../../../i18n/locale-service");

let Job = require("./job");
const InputType = {
    WORD: "word",
    SENTENCE: "sentence",
    PARAGRAPH: "paragraph",
    PAGE: "page",
    IMAGE: "image",
    VOID: "void",
    URL: "url",
};

const OutputType = {
    WORD: "word",
    SENTENCE: "sentence",
    PARAGRAPH: "paragraph",
    PAGE: "page",
    IMAGE: "image",
    VOID: "void",
    AUDIO: "audio",
    VIDEO: "video",
    JAVASCRIPT:"javascript",
};

const FunctionType = {
    REMOTE: "remote",
    LOCAL: "local"
};

const FunctionCategory = {
    SPEECH_SYNTHESIS: "SPEECH_SYNTHESIS",
    DICTIONARY : "DICTIONARY",
    NLP :"NLP",
    TOOLS : "TOOLS",


};

const SupportCategories = {
    LAYOUT_SUPPORT: {
        ALL: "LAYOUT_SUPPORT_ALL",
        FONT_SUPPORT: "LAYOUT_SUPPORT_FONT_SUPPORT",
        COLOR_SUPPORT: "LAYOUT_SUPPORT_COLOR_SUPPORT",
        AD_SUPPORT: "LAYOUT_SUPPORT_AD_SUPPORT",
        LAYOUT_SUPPORT: "LAYOUT_SUPPORT_LAYOUT_SUPPORT",
        LINK_SUPPORT: "LAYOUT_SUPPORT_LINK_SUPPORT"
    },
    READING_SUPPORT : {
        ALL: "READING_SUPPORT_ALL",
        TTS_SUPPORT: "READING_SUPPORT_TTS_SUPPORT",
        TTS_SYNTAX_HIGHLIGHTNING :"READING_SUPPORT_TTS_SYNTAX_HIGHLIGHTNING",
        TTS_SPEED: "READING_SUPPORT_TTS_SPEED"
    },
    SYMBOL_SUPPORT: {
        ALL: "SYMBOL_SUPPORT_ALL",
        BLISS: "SYMBOL_SUPPORT_BLISS",
        ARASAAC: "SYMBOL_SUPPORT_ARASAC",
        WIDGIT: "SYMBOL_SUPPORT_WIDGIT",

    },
    UNDERSTANDING_SUPPORT:{
        ALL: "UNDERSTANDING_SUPPORT_ALL",
        SIMPLIFIED_LANGUAGE : "UNDERSTANDING_SUPPORT_SIMPLIFIED_LANGUAGE",
        TRANSLATION: "UNDERSTANDING_SUPPORT_TRANSLATION",
        MULTIMEDIA_ANNOTATION: "UNDERSTANDING_SUPPORT_MULTIMEDIA_ANNOTATION"
    }
};

const ToolCategories = {
    Reading: "Reading",
    Layout: "Layout",
    Explanation : "Explanation",
    Other: "Other",
    Experimental: "Experimental"

};


class Function {
    constructor(engine, id ,name, description, inputTypes, outputTypes, defaultIcon, toolCategory,bundle=null) {
        this.engine = engine;
        this.id = id;
        this.name = name;
        this.description = description;
        this.inputTypes = inputTypes;
        this.outputTypes = outputTypes;
        this.defaultIcon = defaultIcon;
        this.toolCategory = toolCategory;
        this.bundle = bundle;
    }


    validateProperties() {
        let fs = require('fs');

        //Check defaultIcon
        let defaultIconPath = require("path").join(this.engine.baseDir, this.defaultIcon);
        if (fs.existsSync(defaultIconPath)) {

            this.copyFileToWeb(this.defaultIcon);
        } else {
            console.log("File not found:" + this.defaultIcon);
        }
    }

    copyFileToWeb(pathToFile) {

        try {
            const fs = require('fs-extra');
            fs.copySync(require("path").join(this.engine.baseDir, pathToFile), baseDirPath("public/components/engines/" + this.engine.id + '/' + this.engine.version + '/' + pathToFile));

            return "/components/engines/" + this.engine.id + '/' + this.engine.version + '/' + pathToFile;
        } catch (err) {
            console.error(err)
        }


    }

    getFunctionInformation(loc) {
        return {
            id: this.id,
            engine: this.engine.getEngineIdentifier(),
            debugMode: this.engine.debugMode,
            name: localeService.translateToLanguage(this.name, loc),
            description: localeService.translateToLanguage(this.description, loc),
            inputTypes: this.inputTypes,
            outputTypes: this.outputTypes,
            defaultIcon: this.defaultIcon,
            defaultIconURL: "components/engines/" + this.engine.id + "/" + this.engine.version+ "/" + this.defaultIcon,
            remoteBaseDirectory: "components/engines/" + this.engine.id + '/' + this.engine.version + '/',
        };


    }

}

class RemoteFunction extends Function {
    constructor(engine, id, name, description, inputTypes, outputTypes, defaultIcon, entryPoint,toolCategory, bundle=null) {
        super(engine, id, name, description, inputTypes, outputTypes, defaultIcon,toolCategory, bundle);

        this.type = "RemoteFunction";
        this.entryPoint = entryPoint;

    }

    validateProperties() {
        super.validateProperties();

        if (typeof  this.engine[this.entryPoint] !== 'function') {

            console.log("Entry point:" + this.entryPoint + " for " + this.name + " not found");
        }

    }

    getFunctionInformation(loc) {
        let functionInfo = super.getFunctionInformation(loc);
        functionInfo.type = this.type;
        functionInfo.entryPoint = this.entryPoint;
        return functionInfo;

    }

}


class LocalFunction extends Function {
    constructor(engine, id, name, description, inputTypes, outputTypes, defaultIcon, javaScripts, styleSheets,
                entryPoint, toolCategory,bundle=null) {
        super(engine, id, name, description, inputTypes, outputTypes, defaultIcon,toolCategory, bundle);

        this.type = "LocalFunction";
        this.javaScripts = javaScripts;
        this.styleSheets = styleSheets;
        this.entryPoint = entryPoint;
        this.assetDirectory = "";
        this.remoteAssetDirectory = "";
        this.contentScripts = [];
        this.contentCSS = [];
        this.remoteScripts = [];
        this.remoteCSS = [];
        /*
        this.loadedJavaScripts = [];
        this.loadedStyleSheets = [];

        this.remoteJavaScripts = [];
        this.remoteStyleSheets = [];
        */
    }

    validateProperties() {
        super.validateProperties();

        let fs = require('fs');

        if (this.assetDirectory !== "") {
            let pathToAssetDir = require("path").join(this.baseDir, this.assetDirectory);
            let stat = fs.statSync(pathToAssetDir);
            if (stat && stat.isDirectory()) {
                this.remoteAssetDirectory = this.copyToWeb(this.assetDirectory);
            } else {
                console.log("Asset Directory not found:" + this.assetDirectory);
            }
        }

        for (let i = 0; i < this.javaScripts.length; i++) {
            let pathToJavaScriptFile = require("path").join(this.engine.baseDir, this.javaScripts[i]);
            if (!fs.existsSync(pathToJavaScriptFile)) {
                console.log("File not found:" + this.javaScripts[i]);
            } else {

                if (this.engine.debugMode) {
                    let scriptURL = this.copyFileToWeb(this.javaScripts[i]);
                    this.remoteScripts.push(scriptURL);
                } else {
                    this.contentScripts.push(
                        {
                            id: this.engine.id+'/'+this.engine.version+this.javaScripts[i],
                            source: btoa(fs.readFileSync(pathToJavaScriptFile, "utf8")),
                        });

                }

            }
        }

        for (let i = 0; i < this.styleSheets.length; i++) {
            let pathToStyleSheet = require("path").join(this.engine.baseDir, this.styleSheets[i]);
            if (!fs.existsSync(pathToStyleSheet)) {
                console.log("File not found:" + this.styleSheets[i]);
            } else {

                if (this.engine.debugMode) {
                    let styleSheetURL = this.copyFileToWeb(this.styleSheets[i]);
                    this.remoteCSS.push(styleSheetURL);
                } else {

                    this.contentCSS.push(
                        {
                            id: this.engine.id+'/'+this.engine.version+this.styleSheets[i],
                            css: btoa(fs.readFileSync(pathToStyleSheet)),
                        });

                }

            }
        }

    }

    getFunctionInformation(loc) {
        let functionInfo = super.getFunctionInformation(loc);
        functionInfo.type = this.type;
        functionInfo.entryPoint = this.entryPoint;
        functionInfo.remoteAssetDirectory =  this.remoteAssetDirectory;

        if (this.engine.debugMode) {

            functionInfo.remoteScripts = this.remoteScripts;
            functionInfo.remoteCSS = this.remoteCSS;
        } else {


            //Clone of script and css are made
            functionInfo.contentScripts = [];
            for(let i=0; i < this.contentScripts.length; i++){
                functionInfo.contentScripts.push(Object.assign({}, this.contentScripts[i]));

            }

            functionInfo.contentCSS = [];
            for(let i=0; i < this.contentCSS.length; i++){
                functionInfo.contentCSS.push(Object.assign({}, this.contentCSS[i]));

            }

            //functionInfo.contentScripts = this.contentScripts;
            //functionInfo.contentCSS = this.contentCSS;

        }

        return functionInfo;

    }

}

class CombinedFunction {
    constructor(id, functions, connections, name, description,defaultIcon) {
        this.type = "CombinedFunction";
        this.functions = functions;
        this.connections = connections;

        this.id = id;
        this.name = name;
        this.description = description;
        this.inputTypes = [];
        this.outputTypes = [];
        this.defaultIcon = defaultIcon;
        this.jobs =  [];
        this.startConnections = null;
        this.endConnections = null;

        this.createJobs();
        this.defineInputOutputTypes();
    }

    createJobs(){
        let core = require("../../../core");
        for(let i=0; i < this.functions.length; i++) {

            if(this.functions[i].functionInfo.type !== "staticFunction"){

                let connections = this.getConnectionsForFunction(this.functions[i]);
                let engine = core.getEngine(this.functions[i].functionInfo.engineID, this.functions[i].functionInfo.engineVersison);
                let curFunction = engine.getFunction(this.functions[i].functionInfo.functionID);


                this.jobs.push(new Job(this.functions[i].id, curFunction,connections,engine.getDefaultData()));
            }else{

                if(this.functions[i].functionInfo.functionID === "function_output"){

                    let connection = this.getConnectionsForFunction(this.functions[i]);
                    this.endConnections = connection.outputs;

                }else if(this.functions[i].functionInfo.functionID === "function_input"){
                    let connection = this.getConnectionsForFunction(this.functions[i]);
                    this.startConnections = connection.inputs;

                }

            }
        }

    }

    defineInputOutputTypes(){

        for(let i=0; i < this.startConnections.length; i++) {
            for(let j=0; j < this.jobs.length; j++){
                if (this.startConnections[i].functionID === this.jobs[j].functionID) {

                    this.inputTypes = this.inputTypes.concat(this.jobs[j].engineFunction.inputTypes[this.startConnections[i].portID]);
                }
            }
        }

        for(let i=0; i < this.endConnections.length; i++) {
            for(let j=0; j < this.jobs.length; j++){
                if (this.endConnections[i].functionID === this.jobs[j].functionID) {

                    this.outputTypes = this.outputTypes.concat(this.jobs[j].engineFunction.outputTypes[this.endConnections[i].portID])
                }
            }
        }


    }

    getConnectionsForFunction(func){
        let inputConnections = [];
        let outputConnections = [];
        for(let i=0; i < this.connections.length; i++){
            if(this.connections[i].outputPort.functionID === func.id){
                inputConnections.push(this.connections[i].inputPort);
            }

            if(this.connections[i].inputPort.functionID === func.id){
                outputConnections.push(this.connections[i].outputPort);
            }

        }

        return {
            inputs : inputConnections,
            outputs: outputConnections,
        }


    }
    getFunctionInformation() {
        return {
            id:this.id,
            name: this.name,
            type: this.type,
            description: this.description,
            inputTypes: this.inputTypes,
            outputTypes: this.outputTypes,
            defaultIcon: this.defaultIcon,
        };


    }
   //
    executeFunction(callback, input, profile,constants){

        let jobManager = require("./job-manager");
        let newJobManager = new jobManager(this);
        newJobManager.executeJobs(callback, input, profile,constants);

    }
}


module.exports.LocalFunction = LocalFunction;
module.exports.RemoteFunction = RemoteFunction;
module.exports.CombinedFunction = CombinedFunction;


let schemas = require("./schemas");
module.exports.LocalFunctionSchema = schemas.LocalFunctionSchema;
module.exports.RemoteFunctionSchema = schemas.RemoteFunctionSchema;
module.exports.InputType = InputType;
module.exports.OutputType = OutputType;
module.exports.FuntionType = FunctionType;
module.exports.FunctionCategory = FunctionCategory;
module.exports.SupportCategories = SupportCategories;
module.exports.ToolCategories = ToolCategories;