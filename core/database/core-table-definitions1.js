let Profile = {
    "$id": "https://www.easyreading.eu/schemas/Profile.json",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "profile",
    "type": "object",
    "properties": {
        "googleID": {
            "type": "string"
        },
        "facebookID": {
            "type": "string"
        },
        "email": {
            "type": "string",
            "format": "email"
        },
        "role": {
            "type": "integer",
            "title": "Role for this profile ",
            "default": 0,
        },
        "locale": {
            "type": "string",
            "maxLength": 255,
            "title": "Language of the user",
            "default": "en",
        },
    },
    "required": [
        "email"
    ],
    "unique": [
        ["email"]
    ]
};

let Role = {
    "$id": "https://www.easyreading.eu/schemas/Profile.json",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "role",
    "type": "object",
    "properties": {
        "user_id": {
            "$id": "/properties/ui_id",
            "type": "integer",
            "title": "User ID ",

        },
        "role": {
            "$id": "/properties/ui_id",
            "type": "string",
            "title": "Role",
            "enum": ["administrator", "client", "caretaker"],

        },
    },
};

let ClientCarerRelation = {
    "$id": "https://www.easyreading.eu/schemas/Profile.json",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "client_carer_relation",
    "type": "object",
    "properties": {
        "client_id": {
            "$id": "/properties/ui_id",
            "type": "integer",
            "title": "client ID ",

        },
        "carer_id": {
            "$id": "/properties/ui_id",
            "type": "integer",
            "title": "client ID ",

        },
        "state": {
            "$id": "/properties/ui_id",
            "type": "integer",
            "title": "client ID ",
            "default": 0,

        },
    },
};


let UICollection = {
    "$id": "https://www.easyreading.eu/schemas/UICollection.json",
    "type": "object",
    "title": "ui_collection",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "pid": {
            "$id": "/properties/uid",
            "type": "integer",
            "title": "The pid Schema ",
            "default": 0,

        },
        "active": {
            "$id": "/properties/active",
            "type": "boolean",
            "title": "The Active Schema ",
            "default": false,

        }
    }
};

let UIConf = {
    "$id": "https://www.easyreading.eu/schemas/UIConf.json",
    "type": "object",
    "title": "ui_conf",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "ui_id": {
            "$id": "/properties/ui_id",
            "type": "string",
            "title": "The Ui_id Schema ",

        },
        "ui_version": {
            "$id": "/properties/ui_version",
            "type": "string",
            "title": "The Ui_version Schema ",


        },
        "ui_conf_id": {
            "$id": "/properties/ui_conf_id",
            "type": "integer",
            "title": "The Ui_conf_id Schema ",

        },
        "ui_collection": {
            "$id": "/properties/ui_collection",
            "type": "integer",
            "title": "The Ui_collection Schema ",

        }
    }
};


let PluginConf = {
    "$id": "https://www.easyreading.eu/schemas/PluginConf.json",
    "type": "object",
    "title": "plugin_conf",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "plugin_id": {
            "$id": "/properties/plugin_id",
            "type": "string",
            "title": "The Plugin_id Schema ",
        },
        "plugin_version": {
            "$id": "/properties/plugin_version",
            "type": "string",
            "title": "The Plugin_version Schema ",
        },
        "ui_collection": {
            "$id": "/properties/ui_collection",
            "type": "integer",
            "title": "The Ui_collection Schema ",
        },
        "plugin_conf_id": {
            "$id": "/properties/plugin_conf_id",
            "type": "integer",
            "title": "The Plugin_conf_id Schema ",
        },
    }
};


let BusyAnimationConf = {
    "$id": "https://www.easyreading.eu/schemas/PluginConf.json",
    "type": "object",
    "title": "busy_animation_conf",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "busy_animation_id": {
            "$id": "/properties/busy_animation_id",
            "type": "string",
            "title": "The busy_animation_id Schema ",
        },
        "busy_animation_version": {
            "$id": "/properties/busy_animation_version",
            "type": "string",
            "title": "The busy_animation_version Schema ",
        },
        "ui_collection": {
            "$id": "/properties/ui_collection",
            "type": "integer",
            "title": "The Ui_collection Schema ",
        },
        "busy_animation_conf_id": {
            "$id": "/properties/busy_animation_conf_id",
            "type": "integer",
            "title": "The busy_animation_conf_id Schema ",
        },
    }
};


let ToolConf = {
    "$id": "https://www.easyreading.eu/schemas/ToolConf.json",
    "type": "object",
    "title": "tool_conf",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "ui_conf_id": {
            "$id": "/properties/ui_conf_id",
            "type": "integer",
            "title": "The Ui_conf_id Schema ",


        },
        "engine_id": {
            "$id": "/properties/engine_id",
            "type": "string",
            "title": "The Engine_id Schema ",


        },
        "engine_version": {
            "$id": "/properties/engine_version",
            "type": "string",
            "title": "The Engine_version Schema ",


        },
        "function_id": {
            "$id": "/properties/function_id",
            "type": "string",
            "title": "The Function_id Schema ",


        },
        "engine_conf_id": {
            "$id": "/properties/engine_conf_id",
            "type": "integer",
            "title": "The Engine_conf_id Schema ",


        },
        "widget_id": {
            "$id": "/properties/widget_id",
            "type": "string",
            "title": "The Widget_id Schema ",


        },
        "widget_version": {
            "$id": "/properties/widget_version",
            "type": "string",
            "title": "The Widget_version Schema ",


        },
        "widget_conf_id": {
            "$id": "/properties/widget_conf_id",
            "type": "integer",
            "title": "The Widget_conf_id Schema ",


        },
        "presentation_id": {
            "$id": "/properties/presentation_id",
            "type": "string",
            "title": "The Presentation_id Schema ",


        },
        "presentation_version": {
            "$id": "/properties/presentation_version",
            "type": "string",
            "title": "The Presentation_version Schema ",

        },
        "presentation_conf_id": {
            "$id": "/properties/presentation_conf_id",
            "type": "integer",
            "title": "The Presentation_conf_id Schema ",
        },
        "layout_conf_id": {
            "$id": "/properties/layout_conf_id",
            "type": "integer",
            "title": "The Layout_conf_id Schema ",
        },
        "order_in_ui": {
            "$id": "/properties/order_in_ui",
            "type": "integer",
            "title": "The Order_in_ui Schema ",
            "default": 0,

        }
    }
};

let HealthCareWorkerPatient = {
    "$id": "https://www.easyreading.eu/schemas/HealthCareWorkerPatient.json",
    "type": "object",
    "title": "health_care_worker_patient",
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "health_care_worker_id": {
            "$id": "/properties/health_care_worker_id",
            "type": "integer",
            "title": "The profile id Schema ",

        },
        "patient_id": {
            "$id": "/properties/patient_id",
            "type": "integer",
            "title": "The profile id Schema ",

        }
    },
    "unique": [
        ["health_care_worker_id", "patient_id"]
    ]
};

let ContentReplacement = {
    "$id": "https://www.easyreading.eu/schemas/ContentReplacement.json",
    "type": "object",
    "title": "content_replacement",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "title": {
            "$id": "/properties/title",
            "type": "string",
            "title": "Title",
            "description": "Title for the content replacement"
        },
        "description": {
            "$id": "/properties/description",
            "type": "string",
            "title": "Description",
            "description": "Short description of the content replacement (optional)"
        },
        "url": {
            "$id": "/properties/url",
            "type": "string",
            "title": "Site URL",
            "description": "URL of the page where the replacement should be applied",
        },

        "selector": {
            "$id": "/properties/selector",
            "type": "string",
            "title": "Selector",
            "description": "The selector of the element within the DOM",
        },
        "selector_type": {
            "$id": "/properties/selector_type",
            "type": "string",
            "title": "Selector Type",
            "description": "Defines which selector to use. E.g: jQuery selector",
        },

        "scope": {
            "$id": "/properties/scope",
            "type": "string",
            "enum": ["pubic", "clients"],
            "title": "Scope",
            "description": "Defines which this replacement is visible for everybody, or only for the clients of the person that created the replacement",
        },
        "replacement": {
            "$id": "/properties/replacement",
            "type": "string",
            "title": "Replacement",
            "description": "The content of the replacement",
        },
        "language": {
            "$id": "/properties/language",
            "type": "string",
            "title": "Language",
            "description": "Language code of the replacement language",
        },
        "active": {
            "$id": "/properties/active",
            "type": "boolean",
            "default": true,
            "title": "Active",
            "description": "Defines if the replacement is active or not. Only active replacements are shown to users."
        },
        "pid": {
            "$id": "/properties/pid",
            "type": "integer",
            "title": "Profile ID",
            "description": "The profile ID of the user who created the replacement",
        },
    }
};

let CustomFunction = {

    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "https://www.easyreading.eu/schemas/customFunction.json",
    "type": "object",
    "title": "custom_function",
    "required": [
        "creator",
        "function_code",
        "title",
        "description"
    ],
    "properties": {
        "creator": {
            "$id": "#/properties/creator",
            "type": "integer",
            "title": "id of the creator",
        },
        "function_code": {
            "$id": "#/properties/function_code",
            "type": "string",
            "title": "json of the function",
        },
        "title": {
            "$id": "#/properties/title",
            "type": "string",
            "title": "title of the combined function",

        },
        "description": {
            "$id": "#/properties/description",
            "type": "string",
            "title": "desrciption of the combined function",
            "default": "",

        }
    }
};

let CustomToolConf = {
    "$id": "https://www.easyreading.eu/schemas/ToolConf.json",
    "type": "object",
    "title": "custom_tool_conf",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "ui_conf_id": {
            "$id": "/properties/ui_conf_id",
            "type": "integer",
            "title": "The Ui_conf_id Schema ",


        },
        "custom_function_id": {
            "$id": "/properties/engine_id",
            "type": "string",
            "title": "Id of the custom function",


        },
        "widget_id": {
            "$id": "/properties/widget_id",
            "type": "string",
            "title": "The Widget_id Schema ",


        },
        "widget_version": {
            "$id": "/properties/widget_version",
            "type": "string",
            "title": "The Widget_version Schema ",


        },
        "widget_conf_id": {
            "$id": "/properties/widget_conf_id",
            "type": "integer",
            "title": "The Widget_conf_id Schema ",


        },
        "presentation_id": {
            "$id": "/properties/presentation_id",
            "type": "string",
            "title": "The Presentation_id Schema ",


        },
        "presentation_version": {
            "$id": "/properties/presentation_version",
            "type": "string",
            "title": "The Presentation_version Schema ",

        },
        "presentation_conf_id": {
            "$id": "/properties/presentation_conf_id",
            "type": "integer",
            "title": "The Presentation_conf_id Schema ",
        },
        "layout_conf_id": {
            "$id": "/properties/layout_conf_id",
            "type": "integer",
            "title": "The Layout_conf_id Schema ",
        },
        "icon": {
            "$id": "/properties/widget_version",
            "type": "string",
            "title": "The Icon Schema ",


        },
        "order_in_ui": {
            "$id": "/properties/order_in_ui",
            "type": "integer",
            "title": "The Order_in_ui Schema ",
            "default": 0,

        }
    }
};


let understandingSupport = {
    "$id": "https://www.easyreading.eu/schemas/profile_understanding_support.json",
    "type": "object",
    "title": "profile_understanding_support",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "pid": {
            "$id": "/properties/pid",
            "type": "integer",
            "title": "Profile ID",
            "description": "The profile ID of the referenced user",
        },
        "enabled": {
            "$id": "/properties/enabled",
            "type": "boolean",
            "title": "Symbol support enabled",
            "description": "The user wants symbol support",
            "default": true,

        },
        "simplified_language": {
            "$id": "/properties/active",
            "type": "boolean",
            "title": "Simplified Language",
            "description": "Simplified language is preferred",
            "default": true,

        },
        "translation": {
            "$id": "/properties/active",
            "type": "boolean",
            "title": "Translation",
            "description": "Translations from a foreign language to the users language",
            "default": false,

        },
        "multimedia_annotation": {
            "$id": "/properties/active",
            "type": "boolean",
            "title": "Multimedia Annotation",
            "description": "Video & Audio annotations are preferred",
            "default": true,

        },

    }
};


let symbolSupport = {
    "$id": "https://www.easyreading.eu/schemas/profile_symbol_support.json",
    "type": "object",
    "title": "profile_symbol_support",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "pid": {
            "$id": "/properties/pid",
            "type": "integer",
            "title": "Profile ID",
            "description": "The profile ID of the referenced user",
        },
        "enabled": {
            "$id": "/properties/enabled",
            "type": "boolean",
            "title": "Symbol support enabled",
            "description": "The user wants symbol support",
            "default": false,

        },
        "preferred_library": {
            "$id": "/properties/preferred_library",
            "type": "string",
            "enum": ["arasaac", "bliss","widgit","none"],
            "title": "Symbol Library",
            "description": "The preferred library of the user",
            "default":"none",
        },


    }
};


let layoutSupport = {
    "$id": "https://www.easyreading.eu/schemas/profile_layout_support.json",
    "type": "object",
    "title": "profile_layout_support",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "pid": {
            "$id": "/properties/pid",
            "type": "integer",
            "title": "Profile ID",
            "description": "The profile ID of the referenced user",
        },
        "enabled": {
            "$id": "/properties/enabled",
            "type": "boolean",
            "title": "Layout support enabled",
            "description": "The user wants layout support",
            "default": true,

        },
        "font_support": {
            "$id": "/properties/font_support",
            "type": "boolean",
            "title": "Font support",
            "description": "Support for fonts(size, font type...) enabled",
            "default": true,

        },
        "color_support": {
            "$id": "/properties/color_support",
            "type": "boolean",
            "title": "Color support enabled",
            "description": "Support for colors enabled",
            "default": true,

        },
        "layout_support": {
            "$id": "/properties/layout_support",
            "type": "boolean",
            "title": "Layout support enabled",
            "description": "Support for layout enabled",
            "default": true,

        },
        "link_support": {
            "$id": "/properties/link_support",
            "type": "boolean",
            "title": "Link support enabled",
            "description": "Support for links enabled",
            "default": true,

        },
        "ad_support": {
            "$id": "/properties/ad_support",
            "type": "boolean",
            "title": "Advertisement support enabled",
            "description": "Support for annoying advertisements enabled",
            "default": true,

        },

    }
};


let readingSupport = {
    "$id": "https://www.easyreading.eu/schemas/profile_reading_support.json",
    "type": "object",
    "title": "profile_reading_support",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "pid": {
            "$id": "/properties/pid",
            "type": "integer",
            "title": "Profile ID",
            "description": "The profile ID of the referenced user",
        },
        "enabled": {
            "$id": "/properties/enabled",
            "type": "boolean",
            "title": "Reading support enabled",
            "description": "The user wants reading support",
            "default": true,

        },
        "tts_support": {
            "$id": "/properties/tts_support",
            "type": "boolean",
            "title": "Text to speech support",
            "description": "Text to speech support is enabled",
            "default": true,

        },
        "tts_syntax_highlightning": {
            "$id": "/properties/tts_syntax_highlightning",
            "type": "boolean",
            "title": "Syntax highlightning enabled",
            "description": "Syntax highlightning for text to speech enabled",
            "default": true,

        },
        "tts_speed": {
            "$id": "/properties/tts_speed",
            "type": "string",
            "enum": ["slow", "normal","fast"],
            "title": "Text to speech speed",
            "description": "The speed of the text to speech voice",
            "default" : "normal",
        },

    }
};

let inputSupport = {
    "$id": "https://www.easyreading.eu/schemas/profile_input_support.json",
    "type": "object",
    "title": "profile_input_support",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "pid": {
            "$id": "/properties/pid",
            "type": "integer",
            "title": "Profile ID",
            "description": "The profile ID of the referenced user",
        },
        "text_selection": {
            "$id": "/properties/text_selection",
            "type": "string",
            "enum": ["click", "mark"],
            "title": "Text selection",
            "description": "The preferred way of selecting text",
            "default":"click"
        },

    }
};


let presentationSupport = {
    "$id": "https://www.easyreading.eu/schemas/profile_presentation_support.json",
    "type": "object",
    "title": "profile_presentation_support",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "pid": {
            "$id": "/properties/pid",
            "type": "integer",
            "title": "Profile ID",
            "description": "The profile ID of the referenced user",
        },
        "annotation_display": {
            "$id": "/properties/annotation_display",
            "type": "string",
            "enum": ["tooltip", "top","next"],
            "title": "Annotation display",
            "description": "How annotations should be displayed",
            "default":"tooltip"
        },
        "user_interface": {
            "$id": "/properties/tool_user_interface",
            "type": "string",
            "enum": ["overlay", "tab-slide-out",],
            "title": "Userinterface",
            "description": "The preferred user interface",
            "default":"tab-slide-out"
        },

    }
};

let functionUsageEntry = {
    "$id": "https://www.easyreading.eu/schemas/functionUsageEntry.json",
    "type": "object",
    "title": "function_usage_entry",
    "definitions": {},
    "$schema": "http://json-schema.org/draft-07/schema#",
    "properties": {
        "pid": {
            "$id": "/properties/pid",
            "type": "integer",
            "title": "Profile ID",
            "description": "The profile ID of the referenced user",
        },
        "engine_id": {
            "$id": "/properties/function_id",
            "type": "string",
            "title": "The Function_id Schema ",


        },
        "function_id": {
            "$id": "/properties/function_id",
            "type": "string",
            "title": "The Function_id Schema ",


        },
        "total_usage": {
            "type": "integer",
            "title": "Total usage",
            "default": 1,
        },

    }
};



let supportTables = {
    text_support: [

    ],

    symbol_support :[

    ],

    layout_support :[

    ],

    reading_support : [
        {
            sub_category: "tts",
            additional_fields:  {
                "syntax_highlightning": {
                    "$id": "/properties/tts_syntax_highlightning",
                    "type": "boolean",
                    "title": "Syntax highlightning enabled",
                    "description": "Syntax highlightning for text to speech enabled",
                    "default": true,

                },
                "speed": {
                    "$id": "/properties/tts_speed",
                    "type": "string",
                    "enum": ["slow", "normal","fast"],
                    "title": "Text to speech speed",
                    "description": "The speed of the text to speech voice",
                    "default" : "normal",
                }
            }
        }

    ],

    input: [
      //Enter input tables here
    ],
    output: [
        //Enter output tables here
    ]

}

//Dont create this.
let supportCategoryTable = {
    "pid": {
        "$id": "/properties/pid",
        "type": "integer",
        "title": "Profile ID",
        "description": "The profile ID of the referenced user",
    },
};

let inputCategoryTable = {

};

let outputCategoryTable = {


};





let coreTableDefinitions = {

    baseTableDefinitions: [
        Profile,
        Role,
        UICollection,
        UIConf,
        ToolConf,
        HealthCareWorkerPatient,
        PluginConf,
        BusyAnimationConf,
        CustomFunction,
        CustomToolConf,
        ContentReplacement,
        ClientCarerRelation,
        understandingSupport,
        symbolSupport,
        layoutSupport,
        readingSupport,
        inputSupport,
        presentationSupport,
        functionUsageEntry,
    ],


    getDefinitions: function () {


        return this.baseTableDefinitions;

    },
    getDefinitionByTitle:function (title) {

        for(let i=0; i < coreTableDefinitions.baseTableDefinitions.length; i++){
            if(coreTableDefinitions.baseTableDefinitions[i].title === title){
                return coreTableDefinitions.baseTableDefinitions[i];
            }
        }
    }


};
module.exports = coreTableDefinitions;

