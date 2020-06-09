let base = rootRequire("core/components/engines/base/engine-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class StanfordNLP extends base.EngineBase {

    constructor() {
        super();
        this.id = "stanford-nlp";
        this.name = "Stanford Text Analysis";
        this.description = "Stanford NLP Utilities";
        this.version = "1.0";
        this.versionDescription = "Initial Version";
        this.credentials = {};
    }

    getFunctions() {
        return [
            {
                id: "pos-tagger-sfd",
                name: "Stanford PoS Tagger",
                description: "A part-of-speech tagger",
                defaultIcon: "assets/pos.png",
                includeInDefaultProfile: false,
                supportedLanguages: ["en"],
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

    getCredentials() {

        if (process.env.EASYREADING_NLP_ENDPOINT && process.env.EASYREADING_NLP_USER && process.env.EASYREADING_NLP_PW) {

            return {
                stf_endpoint: process.env.EASYREADING_NLP_ENDPOINT,
                stf_user: process.env.EASYREADING_NLP_USER,
                stf_pw: process.env.EASYREADING_NLP_PW,
            }
        }

        if (this.credentialManager.hasKey("EASYREADING_NLP_ENDPOINT") &&
            this.credentialManager.hasKey("EASYREADING_NLP_USER") &&
            this.credentialManager.hasKey("EASYREADING_NLP_PW")) {
            return {
                stf_endpoint: this.credentialManager.getValueForKey("EASYREADING_NLP_ENDPOINT"),
                stf_user: this.credentialManager.getValueForKey("EASYREADING_NLP_USER"),
                stf_pw: this.credentialManager.getValueForKey("EASYREADING_NLP_PW"),
            }
        }
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
        this.credentials = this.getCredentials();
        if (!this.credentials) {
            console.log("No credentials found for Stanford NLP!")  //Error:
            callback(new ioType.IOTypes.Error("No credentials found for Standford NLP!"));
            return;
        }
        let request = require('request');
        let sentences = this.getSentences(input.paragraph);
        let authstring = 'Basic ' + new Buffer(this.credentials.stf_user + ':' + this.credentials.stf_pw).toString('base64');
        let parsed_sentences_buffer = {};
        let post_url = this.credentials.stf_endpoint + '/?annotators=pos&outputFormat=json';
        sentences.forEach((sentence, i) => {
            request.post({
                headers: {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Authorization': authstring,
                },
                url: post_url,
                body: sentence,
            }, function (error, response, body) {
                if (error) {
                    console.log(error);

                    //Error:
                    callback(new ioType.IOTypes.Error("Error processing request"));

                }
                let parsed_sentences = JSON.parse(body);
                if ('sentences' in parsed_sentences && parsed_sentences.sentences.length > 0) {
                    let new_sentence = '';
                    let t_open = '<span class="easy-reading-highlight">(';
                    let t_close = ')</span> ';
                    parsed_sentences.sentences.forEach((psentence) => {
                        let i_prev = 0;
                        psentence.tokens.forEach((token) => {
                            let i = token.characterOffsetBegin;
                            if (i - i_prev > 0) {
                                new_sentence += ' ';
                            }
                            new_sentence += token.originalText + t_open + token.pos + t_close;
                            i_prev = token.characterOffsetEnd;
                        });
                    });
                    parsed_sentences_buffer[i] = new_sentence;
                    if (Object.keys(parsed_sentences_buffer).length === sentences.length) {
                        let parsed_paragraph = '';
                        Object.keys(parsed_sentences_buffer).sort().forEach(function (j) {
                            parsed_paragraph += parsed_sentences_buffer[j];
                        });
                        let result = new ioType.IOTypes.Paragraph(parsed_paragraph);

                        callback(result);
                    }
                } else {
                    parsed_sentences_buffer[i] = '';
                }
            });
        });
    }
}

module.exports.class = StanfordNLP;
