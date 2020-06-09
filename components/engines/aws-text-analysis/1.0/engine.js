let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class AWSTextAnalysis extends base.EngineBase {
    constructor() {
        super();
        this.id = "aws-text-analysis";
        this.name = "Text Analysis";
        this.description = "AWS NLP Utilities";
        this.version = "1.0";
        this.versionDescription = "Initial Version";
        this.comprehend = null;
        this.initComprehend();
    }

    initComprehend() {
        try {
            const AWS = require('aws-sdk');
            this.comprehend = new AWS.Comprehend({
                region :'eu-west-1'
            });
        } catch (exception) {
            console.log(exeption);
            this.comprehend = null;
        }
    }

    getDataSchema() {
        return {};
    }

    getFunctions() {
        return [
            {
                id: "pos-tagger",
                name: "AWS PoS Tagger",
                description: "A simple part-of-speech tagger",
                defaultIcon: "assets/pos.png",
                includeInDefaultProfile: false,
                supportedLanguages: ["en","de","sv"],
                visibleInConfiguration: false,
                type: base.EngineFunction.FuntionType.REMOTE,
                category: base.EngineFunction.FunctionCategory.NLP,
                inputTypes: [{
                    "inputType": ioType.IOTypes.Paragraph.className,
                    "name": "Input paragraph",
                    "description": "Paragraph to process",
                }],
                outputTypes: [{
                    "outputType": ioType.IOTypes.ParsedLanguageType.className,
                    "name": "Output paragraph",
                    "description": "Processed paragraph",

                }],
                toolCategory: base.EngineFunction.ToolCategories.Other,
                entryPoint: "getPosTags",
            }

        ];
    }

    getSentences(paragraph) {
        let Tokenizer = require('sentence-tokenizer');
        let myTokenizer = new Tokenizer('Chuck');
        myTokenizer.setEntry(paragraph);
        return myTokenizer.getSentences();
    }

    /**
     * Return Part-of-Speech Tags of each word in a paragraph
     * @param webSocketConnection
     * @param req
     * @param config
     */
    getPosTags(callback, input, config, profile, constants) {
        let engine = this;
        let sentences = this.getSentences(input.paragraph);
        let parsed_sentences_buffer = {};
        sentences.forEach((sentence, i) => {
            let params = {
                LanguageCode: input.lang,
                Text: sentence,
            };
            this.comprehend.detectSyntax(params, function(err, data) {
                if (err) {
                    //Error:
                    callback(new ioType.IOTypes.Error("Error comprehend"));
                    console.log(err);

                }
                else if ('SyntaxTokens' in data) {
                    let t_open = '<span class="easy-reading-highlight">(';
                    let t_close = ')</span> ';
                    let new_paragraph = '';
                    for(let i=0; i < data.SyntaxTokens.length; i++) {
                        new_paragraph += data.SyntaxTokens[i].Text + t_open + data.SyntaxTokens[i].PartOfSpeech.Tag + t_close;
                    }
                    parsed_sentences_buffer[i] = new_paragraph;
                    if(Object.keys(parsed_sentences_buffer).length == sentences.length) {
                        let parsed_paragraph = '';
                        Object.keys(parsed_sentences_buffer).sort().forEach(function(j) {
                            parsed_paragraph += parsed_sentences_buffer[j];
                        });

                        let result = new ioType.IOTypes.Paragraph(new_paragraph);
                        callback(result);
                    }
                } else {
                    console.log('getPosTags: SyntaxTokens attribute not found in request');
                    //Error:
                    callback(new ioType.IOTypes.Error("SyntaxTokens attribute not found in request"));
                }
            });
        });
    }

}


module.exports.class = AWSTextAnalysis;