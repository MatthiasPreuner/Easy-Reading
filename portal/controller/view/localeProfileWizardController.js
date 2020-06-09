module.exports = {

    translateProfileWizard: async (req, res, next) => {

        let loc = {
            'previous': req.__("previous"),
            'next': req.__("next"),
            //Step 0
            'step_0_easy_reading': req.__("step_0_easy_reading"),
            'welcome_to_easy_reading': req.__("welcome_to_easy_reading"),
            'create_personalized_profile': req.__("create_personalized_profile"),
            'create_personalized_profile_button_text': req.__("create_personalized_profile_button_text"),
            'personalized_profile_bullet': req.__("personalized_profile_bullet"),
            'create_personalized_profile_explanation_1': req.__("create_personalized_profile_explanation_1"),
            'create_personalized_profile_explanation_2': req.__("create_personalized_profile_explanation_2"),
            'create_personalized_profile_explanation_3': req.__("create_personalized_profile_explanation_3"),
            'create_default_profile': req.__("create_default_profile"),
            'create_default_profile_button_text': req.__("create_default_profile_button_text"),
            'create_default_profile_explanation_1': req.__("create_default_profile_explanation_1"),
            'create_default_profile_explanation_2': req.__("create_default_profile_explanation_2"),


            //Step 1

            'step1_heading': req.__("step1_heading"),
            'step_1_tts': req.__("step_1_tts"),
            'text_read_aloud': req.__("text_read_aloud"),
            'text_read_aloud_yes': req.__("text_read_aloud_yes"),
            'text_read_aloud_no': req.__("text_read_aloud_no"),
            'text_read_aloud_speed': req.__("text_read_aloud_speed"),
            'text_read_aloud_speed_slow': req.__("text_read_aloud_speed_slow"),
            'text_read_aloud_speed_normal': req.__("text_read_aloud_speed_normal"),
            'text_read_aloud_speed_fast': req.__("text_read_aloud_speed_fast"),


            //Step 1
            'step2_heading': req.__("step2_heading"),
            'step2_translations': req.__("step2_translations"),
            'text_conversion_options': req.__("text_conversion_options"),
            'text_conversion_options_additional_text': req.__("text_conversion_options_additional_text"),
            'plain_language': req.__("plain_language"),
            'language_translation': req.__("language_translation"),

            //Step 3
            'step3_heading': req.__("step3_heading"),
            'step3_image_search': req.__("step3_image_search"),
            'use_image_search_text': req.__("use_image_search_text"),
            'use_image_search_yes': req.__("use_image_search_yes"),
            'use_image_search_no': req.__("use_image_search_no"),

            //Step 3_1
            'step3_1_heading': req.__("step3_1_heading"),
            'step3_1_image_presentation': req.__("step3_1_image_presentation"),
            'multimedia_presentation_tooltip_text': req.__("multimedia_presentation_tooltip_text"),
            'multimedia_presentation_top_text': req.__("multimedia_presentation_top_text"),
            'multimedia_presentation_next_text': req.__("multimedia_presentation_next_text"),


            //Step 4
            'step4_heading': req.__("step4_heading"),
            'step4_symbol_language': req.__("step4_symbol_language"),
            'use_symbol_language': req.__("use_symbol_language"),
            'use_symbol_language_text': req.__("use_symbol_language_text"),
            'use_symbol_language_yes': req.__("use_symbol_language_yes"),
            'use_symbol_language_no': req.__("use_symbol_language_no"),
            'use_symbol_language_which': req.__("use_symbol_language_which"),
            'use_symbol_language_bliss': req.__("use_symbol_language_bliss"),
            'use_symbol_language_widgit': req.__("use_symbol_language_widgit"),
            'use_symbol_language_arasaac': req.__("use_symbol_language_arasaac"),

            //Step 4_1
            'step4_1_heading': req.__("step4_1_heading"),
            'step4_1_image_presentation': req.__("step4_1_image_presentation"),
            'symbol_presentation_tooltip_text': req.__("symbol_presentation_tooltip_text"),
            'symbol_presentation_top_text': req.__("symbol_presentation_top_text"),
            'symbol_presentation_next_text': req.__("symbol_presentation_next_text"),

            //Step 5
            'step5_heading': req.__("step5_heading"),
            'step5_layout': req.__("step5_layout"),
            'layout_help_heading': req.__("layout_help_heading"),
            'layout_help_heading_text': req.__("layout_help_heading_text"),
            'change_font_size': req.__("change_font_size"),
            'change_line_spacing': req.__("change_line_spacing"),
            'change_color': req.__("change_color"),

            //Step 6
            'step6_heading': req.__("step6_heading"),
            'structure_help_heading': req.__("structure_help_heading"),
            'structure_help_heading_text': req.__("structure_help_heading_text"),
            'remove_adds_text': req.__("remove_adds_text"),
            'highlight_links_text': req.__("highlight_links_text"),
            'reading_mode': req.__("reading_mode"),


            //Step 7
            'step7_heading': req.__("step7_heading"),
            'step7_activate_help': req.__("step7_activate_help"),
            'click_interaction_label': req.__("click_interaction_label"),
            'mark_interaction_label': req.__("mark_interaction_label"),
            'click_instruction_1': req.__("click_instruction_1"),
            'click_instruction_2': req.__("click_instruction_2"),
            'click_instruction_3': req.__("click_instruction_3"),
            'mark_instruction_1': req.__("mark_instruction_1"),
            'mark_instruction_2': req.__("mark_instruction_2"),
            'mark_instruction_3': req.__("mark_instruction_3"),



            //Step 8
            'profile_wizard_step_8_heading': req.__("profile_wizard_step_8_heading"),
            'setup_complete_title': req.__("setup_complete_title"),
            'setup_complete_text': req.__("setup_complete_text"),
            'setup_complete': req.__("setup_complete"),
            'personal_profile_complete_text': req.__("personal_profile_complete_text"),
            'default_profile_complete_text': req.__("default_profile_complete_text"),
            'finish_label': req.__("finish_label"),


            //Final Step
            'final_step_heading': req.__("final_step_heading"),
            'final_step_complete': req.__("final_step_complete"),
            'final_step_complete_text1': req.__("final_step_complete_text1"),
            'final_step_complete_text2': req.__("final_step_complete_text2"),
            'final_step_goto_google': req.__("final_step_goto_google"),
            'final_step_goto_config': req.__("final_step_goto_config"),
            'final_step_here_is_help': req.__("final_step_here_is_help"),
            'final_step_goto_settings': req.__("final_step_goto_settings"),



        };

        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    }
};