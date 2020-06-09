let ioType = require("../../../IOtypes/iotypes");

var RemoteFunctionSchema = {
    "type": "object",
    "properties": {
        "id": {
            "type": "string",
            "title": "ID",
            "description": "Identifier of the function - must be unique",

        },
        "name": {
            "type": "string",
            "title": "Name",
            "description": "Name of the function",

        },
        "description": {
            "type": "string",
            "title": "Description",
            "description": "Description of the function",

        },
        "inputTypes": {
            "type": "array",
            "title": "InputTypes",
            "description": "Input types of the function",
            "default": {
                "inputType": ioType.IOTypes.Word.className,
                "name": "Word to input",
            },
            "items": {
                "type": "object",
                "properties": {
                    "inputType": {
                        "type": "string",
                        "title": "InputType",
                        "enum": [
                            ioType.IOTypes.VoidIOType.className,
                            ioType.IOTypes.Word.className,
                            ioType.IOTypes.Sentence.className,
                            ioType.IOTypes.Paragraph.className,
                            ioType.IOTypes.AnnotatedParagraph.className,
                            ioType.IOTypes.ParsedLanguageType.className,
                            ioType.IOTypes.Page.className,
                            ioType.IOTypes.ImageIOType.className,
                            ioType.IOTypes.URLType.className,
                            ioType.IOTypes.ContentReplacement.className,
                            ioType.IOTypes.AudioType.className,
                            ioType.IOTypes.JavaScriptType.className,
                        ],
                    },
                    "name": {
                        "type": "string",
                        "title": "Name",
                        "description": "Name of the input type",

                    },

                    "description": {
                        "type": "string",
                        "title": "Description",
                        "description": "Description of the input type",

                    },

                },
                "required": ["inputType"],


            },
            "minItems": 1,
            "uniqueItems": true,

        },
        "outputTypes": {
            "type": "array",
            "title": "OutputTypes",
            "description": "Output types of the function",
            "default": ioType.IOTypes.Word.className,
            "items": {
                "type": "object",
                "properties": {
                    "outputType": {
                        "type": "string",
                        "enum": [
                            ioType.IOTypes.VoidIOType.className,
                            ioType.IOTypes.Word.className,
                            ioType.IOTypes.Sentence.className,
                            ioType.IOTypes.Paragraph.className,
                            ioType.IOTypes.AnnotatedParagraph.className,
                            ioType.IOTypes.ParsedLanguageType.className,
                            ioType.IOTypes.Page.className,
                            ioType.IOTypes.ImageIOType.className,
                            ioType.IOTypes.URLType.className,
                            ioType.IOTypes.ContentReplacement.className,
                            ioType.IOTypes.AudioType.className,
                            ioType.IOTypes.JavaScriptType.className,
                        ],
                    },
                    "name": {
                        "type": "string",
                        "title": "Name",
                        "description": "Name of the output type",

                    },

                    "description": {
                        "type": "string",
                        "title": "Description",
                        "description": "Description of the output type",

                    },
                },
                "required": ["outputType"],

            },
            "minItems": 1,
            "uniqueItems": true,

        },
        "additionalOutput": {
            "type": "array",
            "title": "Additional output types",
            "description": "Additional output types of the function",
            "default": ioType.IOTypes.Word.className,
            "items": {
                "type": "object",
                "properties": {
                    "outputType": {
                        "type": "string",
                        "enum": [
                            ioType.IOTypes.VoidIOType.className,
                            ioType.IOTypes.Word.className,
                            ioType.IOTypes.Sentence.className,
                            ioType.IOTypes.Paragraph.className,
                            ioType.IOTypes.Page.className,
                            ioType.IOTypes.ImageIOType.className,
                            ioType.IOTypes.URLType.className,
                            ioType.IOTypes.AudioType.className,
                        ],
                    },
                    "name": {
                        "type": "string",
                        "title": "Name",
                        "description": "Name of the additional output type",

                    },

                    "description": {
                        "type": "string",
                        "title": "Description",
                        "description": "Description of the output type",

                    },
                },
                "required": ["outputType", "name"],

            },
            "uniqueItems": true,

        },
        "defaultIcon": {
            "type": "string",
            "title": "Default Icon",
            "description": "Default icon of the function",

        },
    },
    "entryPoint": {
        "type": "string",
        "title": "Conversion function",
        "description": "The name of the conversion function",

    },
    "toolCategory": {
        "type": "string",
        "title": "Tool category",
        "description": "Defines the category of the tool as it is displayed in the user interface",
        "enum": [
            "Reading",
            "Layout",
            "Explanation",
            "Other",
            "Experimental",
        ],
    },
    "required": [
        "id", "name", "inputTypes", "outputTypes", "defaultIcon", "entryPoint", "toolCategory"
    ]
};


var LocalFunctionSchema = {
    "type": "object",
    "properties": {
        "id": {
            "type": "string",

            "title": "ID",
            "description": "Identifier of the function - must be unique",

        },
        "name": {
            "type": "string",
            "title": "Name",
            "description": "Name of the function",

        },
        "inputTypes": {
            "type": "array",
            "title": "InputTypes",
            "description": "Input types of the function",
            "default": {
                "inputType": ioType.IOTypes.Word.className,
                "name": "Word to input",
            },
            "items": {
                "type": "object",
                "properties": {
                    "inputType": {
                        "type": "string",
                        "title": "InputType",
                        "enum": [
                            ioType.IOTypes.VoidIOType.className,
                            ioType.IOTypes.Word.className,
                            ioType.IOTypes.Sentence.className,
                            ioType.IOTypes.Paragraph.className,
                            ioType.IOTypes.Page.className,
                            ioType.IOTypes.ImageIOType.className,
                            ioType.IOTypes.URLType.className,
                        ],
                    },
                    "name": {
                        "type": "string",
                        "title": "Name",
                        "description": "Name of the input type",

                    },

                    "description": {
                        "type": "string",
                        "title": "Description",
                        "description": "Description of the input type",

                    },

                },
                "required": ["inputType"],


            },
            "minItems": 1,
            "uniqueItems": true,

        },
        "outputTypes": {
            "type": "array",
            "title": "OutputTypes",
            "description": "Output types of the function",
            "default": {
                "outputType": ioType.IOTypes.Word.className,
                "name": "Result of the function",
            },
            "items": {
                "type": "object",
                "properties": {
                    "outputType": {
                        "type": "string",
                        "enum": [
                            ioType.IOTypes.VoidIOType.className,
                            ioType.IOTypes.Word.className,
                            ioType.IOTypes.Sentence.className,
                            ioType.IOTypes.Paragraph.className,
                            ioType.IOTypes.Page.className,
                            ioType.IOTypes.ImageIOType.className,
                            ioType.IOTypes.URLType.className,
                            ioType.IOTypes.AudioType.className,
                        ],
                    },
                    "name": {
                        "type": "string",
                        "title": "Name",
                        "description": "Name of the output type",

                    },

                    "description": {
                        "type": "string",
                        "title": "Description",
                        "description": "Description of the output type",

                    },
                },
                "required": ["outputType"],

            },
            "minItems": 1,
            "uniqueItems": true,

        },
        "additionalOutput": {
            "type": "array",
            "title": "Additional output types",
            "description": "Additional output types of the function",
            "default": ioType.IOTypes.Word.className,
            "items": {
                "type": "object",
                "properties": {
                    "outputType": {
                        "type": "string",
                        "enum": [
                            ioType.IOTypes.VoidIOType.className,
                            ioType.IOTypes.Word.className,
                            ioType.IOTypes.Sentence.className,
                            ioType.IOTypes.Paragraph.className,
                            ioType.IOTypes.Page.className,
                            ioType.IOTypes.ImageIOType.className,
                            ioType.IOTypes.URLType.className,
                            ioType.IOTypes.AudioType.className,
                        ],
                    },
                    "name": {
                        "type": "string",
                        "title": "Name",
                        "description": "Name of the additional output type",

                    },

                    "description": {
                        "type": "string",
                        "title": "Description",
                        "description": "Description of the output type",

                    },
                },
                "required": ["outputType", "name"],

            },
            "uniqueItems": true,

        },
        "defaultIcon": {
            "type": "string",
            "title": "Default Icon",
            "description": "Default icon of the function",

        },
        "javaScripts": {
            "type": "array",
            "title": "Java Scripts",
            "description": "Java scripts injected",
            "items": {
                "type": "string"
            }
        },
        "styleSheets": {
            "type": "array",
            "title": "Style sheets to inject",
            "description": "Java scripts injected",
            "items": {
                "type": "string"
            }
        },
        "entryPoint": {
            "type": "string",
            "title": "Entry function",
            "description": "The function triggering the injected script",

        },
        "toolCategory": {
            "type": "string",
            "title": "Tool category",
            "description": "Defines the category of the tool as it is displayed in the user interface",
            "enum": [
                "Reading",
                "Layout",
                "Explanation",
                "Other",
                "Experimental",
            ],
        },
    },
    "required": [
        "id", "name", "inputTypes", "outputTypes", "defaultIcon", "javaScripts", "entryPoint","toolCategory"
    ]
};

module.exports.LocalFunctionSchema = LocalFunctionSchema;
module.exports.RemoteFunctionSchema = RemoteFunctionSchema;