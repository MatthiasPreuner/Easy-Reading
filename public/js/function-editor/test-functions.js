let functions = [
    {
        id: "aws-tts",
        name: "AWS Polly",
        description: "Converts text to Speech",
        defaultIcon: "assets/text-to-speech.png",
        category: "Speech Synthesis",
        type: "REMOTE",
        inputTypes: [
            {
                "inputType": "ParagraphType",
                "name": "Input paragraph",
                "description": "Paragraph to speak",
            },

            {
                "inputType": "WordType",
                "name": "Input word",
                "description": "Word to translate",
            }
        ],
        outputTypes: [{
            "outputType": "AudioType",
            "name": "Output",
            "description": "Image word",

        }],
        entryPoint: "convertTextToSpeech",
    },

    {
        id: "simple_dict",
        name: "Dictionary",
        description: "A dictionary using globse.com",
        defaultIcon: "assets/dictionary.png",
        category: "Dictionary",
        type: "REMOTE",
        inputTypes: [{
            "inputType": "WordType",
            "name": "Input word",
            "description": "Word to translate",
        }],
        outputTypes: [{
            "outputType": "WordType",
            "name": "Output word",
            "description": "Translated word",

        }],
        additionalOutput: [{
            "outputType": "SentenceType",
            "name": "Meaning",
            "description": "Meaning of the word explained with a sentence",

        }],
        entryPoint: "dictionary",
    },
    {
        id: "th-tts",
        name: "Texthelp: Text to Speech",
        description: "Converts text to Speech",
        defaultIcon: "assets/text-to-speech.png",
        category: "Speech Synthesis",
        type: "REMOTE",
        inputTypes: [
            {
                "inputType": "ParagraphType",
                "name": "Input paragraph",
                "description": "Paragraph to speak",
            },

            {
                "inputType": "WordType",
                "name": "Input word",
                "description": "Word to translate",
            }
        ],
        outputTypes: [{
            "outputType": "AudioType",
            "name": "Output",
            "description": "Image word",

        }],
        entryPoint: "convertTextToSpeech",
    },
    {
        id: "picture_dictionary",
        name: "Texthelp: Picture Dictionary",
        description: "Texthelp picture dictionary",
        defaultIcon: "assets/texthelp-picture-dictionary.png",
        category: "Dictionary",
        type: "REMOTE",
        inputTypes: [{
            "inputType": "WordType",
            "name": "Input word",
            "description": "Word for the picture",
        }],
        outputTypes: [{
            "outputType": "ImageType",
            "name": "Image",
            "description": "Image word",

        }],
        entryPoint: "picturedDictionary",
    },
    {
        id: "stanford_nlp",
        name: "Stanford NLP",
        description: "Texthelp picture dictionary",
        defaultIcon: "assets/texthelp-picture-dictionary.png",
        category: "Parser",
        type: "REMOTE",
        inputTypes: [{
            "inputType": "ParagraphType",
            "name": "Input paragraph",
            "description": "Paragraph to process",
        }],
        outputTypes: [{
            outputType: "TaggedText",
            name: "Parsed Output",
            tags: [
                {
                    outputType: "ClauseType",
                    tagCategories: [
                        {
                            name: "subject",
                            description: "Subject of a sentence"
                        },
                        {
                            name: "verb",
                            description: "Verb of the sentence"
                        }

                    ],
                }
            ]

        }],
        entryPoint: "picturedDictionary",
    }


];
let taggedText =
    [{
        original: "Hello",
        tag: {}
    },
    ];

let startFunc = {
    id: "simple_dict",
    name: "Dictionary",
    description: "A dictionary using globse.com",
    defaultIcon: "assets/dictionary.png",
    type: "REMOTE",
    inputTypes: [{
        "inputType": "WordType",
        "name": "Input word",
        "description": "Word to translate",
    }],
    outputTypes: [{
        "outputType": "WordType",
        "name": "Output word",
        "description": "Translated word",

    }],
    additionalOutput: [{
        "outputType": "SentenceType",
        "name": "Meaning",
        "description": "Meaning of the word explained with a sentence",

    }],
    entryPoint: "dictionary",
};

let input = {
    required: "true",
    id: "function_input",
    name: "Function input",
    description: "Start of the function",
    defaultIcon: "assets/dictionary.png",
    type: "REMOTE",
    inputTypes: [],
    outputTypes: [{
        "outputType": "ALL",
        "name": "ALL",
        "description": "ACCEPTS ALL",
    }],

};


let output = {
    required: "true",
    id: "function_output",
    name: "Function Output",
    description: "End of the function",
    defaultIcon: "assets/dictionary.png",
    type: "REMOTE",
    inputTypes: [{
        "inputType": "ALL",
        "name": "ALL",
        "description": "ACCEPTS ALL",

    }],
    outputTypes: [],
};

let commonFunctions = [];
commonFunctions.push(input);
commonFunctions.push(output);