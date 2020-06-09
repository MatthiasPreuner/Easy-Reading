let profileSupportCategories = {
    supportCategories:  {
        text_support: {
            simplified_language:{
                default_value:50,
            },
            translation:{
                default_value:0,
            },
            multimedia_annotation:{
                default_value:0,
            }
        },

        symbol_support : {
            aac:{
                default_value: 0,
                additional_fields:  {
                    "preferred_library": {
                        "$id": "/properties/preferred_library",
                        "type": "string",
                        "enum": ["arasaac", "bliss","widgit","none"],
                        "title": "Symbol Library",
                        "description": "The preferred library of the user",
                        "default":"none",
                    },
                }
            }
        },

        layout_support :{
            font_support:{
                default_value: 50,
            },
            color_support:{
                default_value: 50,
            },
            layout_support:{
                default_value: 50,
            },
            link_support:{
                default_value: 0,
            },
            ad_support:{
                default_value: 0,
            }

        },

        reading_support : {
            tts: {
                default_value: 50,
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
        },
        //Widgets
        input:{
            text_selection_click:{
                default_value: 50,
            },
            text_selection_mark:{
                default_value: 0,
            }
        },

        //Presentations
        output:{
            tooltip:{
                default_value: 50,
            },
            above_word:{
                default_value: 0,
            },
            next_to_word:{
                default_value: 0,
            },
        },
        //User Interfaces
        user_interface:{
            slide_in:{
                default_value: 50,
            },
            overlay:{
                default_value: 0,
            }

        }
    },
    engineSupportCategories : {
        text_support: {
            simplified_language: "text_support_simplified_language",
            translation: "text_support_translation",
            multimedia_annotation: "text_support_multimedia_annotation",
        },
        symbol_support : {
            aac: "symbol_support_aac",
        },
        layout_support: {
            font_support: "layout_support_font_support",
            color_support: "layout_support_color_support",
            layout_support: "layout_support_layout_support",
            link_support: "layout_support_link_support",
            ad_support: "layout_support_ad_support",

        },
        reading_support:{
            tts: "reading_support_tts",
        }
    },
    input: {

    },
    output: {

    },
    user_interface: {
        overlay:"overlay",
        slide_in:"slide_in",
    },

    getNameForSubCategory:function (categoryName, subcategoryName) {

        return "sc_"+categoryName+"__"+subcategoryName;

    },

    getKeysForSupportCategory(supportCategory){

        let keys = null;
        Object.keys(profileSupportCategories.supportCategories).forEach(function (categoryName, index) {

            let category = profileSupportCategories.supportCategories[categoryName];
            Object.keys(category).forEach(function (subcategoryName, index) {

                if(supportCategory === categoryName+"_"+subcategoryName){
                    keys =  {
                        category: categoryName,
                        subCategory: subcategoryName
                    };
                }

            });
        });


        return keys;
    }


};


const SupportCategories = {
    text_support: {
        simplified_language: "text_support_simplified_language",
        translation: "text_support_translation",
        multimedia_annotation: "text_support_multimedia_annotation",
    },
    symbol_support : {
        aac: "symbol_support_aac",
    },
    layout_support: {
        font_support: "layout_support_font_support",
        color_support: "layout_support_color_support",
        layout_support: "layout_support_layout_support",
        link_support: "layout_support_link_support",
        ad_support: "layout_support_ad_support",

    },
    reading_support:{
        tt: "reading_support_tts",
    }
};

module.exports = profileSupportCategories;
