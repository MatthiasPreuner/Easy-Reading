const profileRepo = require("../../repository/profileRepo");

module.exports = {
    /**
     * Locale middleware: Try to fetch locale from URI param. If not available, fetch locale from user profile.
     * Otherwise, defaults to English.
     */
    setLocale: async (req, res, next) => {
        let loc = 'en';
        let localeInURL = false;
        const queryParam = 'lang';

        if (req.url) {
            let url = require('url');
            const urlObject = url.parse(req.url, true);

            if (urlObject.query[queryParam]) {
                loc = urlObject.query[queryParam].toLowerCase();

                req.locale = loc;
                localeInURL = true;
            }
        }

        if (!localeInURL) {
            if ('user' in req.session) {
                loc = await profileRepo.getProfileLanguage(req.session.user.id);
                if (loc) {
                    req.locale = loc;
                }
            }
        }

        res.locals.lang  =loc;

        return next();
    },


    translateMain: async (req, res, next) => {

        let loc = {

            'logout_text': req.__("logout_text"),
            'login_text': req.__("login_text"),
            'anonymous_user': req.__("anonymous_user"),
            'not_logged_in_message': req.__("not_logged_in_message"),
            'name_text': req.__("name_text"),
            'role_text': req.__("role_text"),
            'account_label': req.__("account_label"),
            'leave_site_info_text': req.__("leave_site_info_text"),



            'healthcareworker_role_text': req.__("healthcareworker_role_text"),
            'client_role_text': req.__("client_role_text"),

            'menu_home_text': req.__("menu_home_text"),
            'menu_welcome_text': req.__("menu_welcome_text"),
            'menu_config_your_toolbar_text': req.__("menu_config_your_toolbar_text"),
            'menu_config_your_content_replacments': req.__('menu_config_your_content_replacments'),
            'menu_configure_toolbar_for_clients_text': req.__("menu_configure_toolbar_for_clients_text"),
            'menu_caretaker_list_text': req.__("menu_caretaker_list_text"),
            'menu_basic_setting_text':req.__("menu_basic_setting_text"),
            'menu_configure_clients_text': req.__("menu_configure_clients_text"),
            'eu_funding_string': req.__("eu_funding_string"),
            'imprint': req.__("imprint"),
            'privacy_policy': req.__("privacy_policy"),
            'privacy_policy_easy': req.__("privacy_policy_easy"),


            'Save': req.__("Save"),
            'Saved': req.__("Saved"),
            'EnableSave': req.__("EnableSave"),
            'Cancel': req.__("Cancel"),
        };

        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    },
    translateImprint: async (req, res, next) => {
        let loc = {
            'questions_about_project': req.__("questions_about_project"),
            'website_contact': req.__("website_contact"),
        };

        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    },
    translateBackEnd: async (req, res, next) => {

        let loc = {
            'er_backend_title': req.__("er_backend_title"),
            'er_backend_what_can_you_do': req.__("er_backend_what_can_you_do"),
            'er_backend_what_can_you_do_list1': req.__("er_backend_what_can_you_do_list1"),
            'er_backend_what_can_you_do_list2': req.__("er_backend_what_can_you_do_list2"),
            'er_backend_upgarde_info': req.__("er_backend_upgarde_info"),
            'er_backend_upgarde_info_yes': req.__("er_backend_upgarde_info_yes"),
            'er_backend_upgarde_info_no': req.__("er_backend_upgarde_info_no"),
            'configure_own_engines_text': req.__("Config your toolbar"),
            'admin_text': req.__("Caretaker administration"),
            'registerprofile_text': req.__("Register new caretaker"),
            'healthcareworker_text': req.__("Configure caretaker"),
            'healthcareworker_title': req.__("Health care worker"),
            'easy_reading_login': req.__("easy_reading_login"),
            'login_or_register_with': req.__("login_or_register_with"),
            'back': req.__("back"),


        };

        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    },

    translateConfigure: async (req, res, next) => {
        let loc = {
            'page_configure_title': req.__("page_configure_title"),

            'page_configure_settings_header': req.__("page_configure_settings_header"),

            'page_configure_settings_type_header': req.__("page_configure_settings_type_header"),
            'page_configure_settings_type_description': req.__("page_configure_settings_type_description"),
            'page_configure_settings_type_how_to_use': req.__("page_configure_settings_type_how_to_use"),
            'page_configure_settings_type_legend': req.__("page_configure_settings_type_legend"),
            'page_configure_settings_type_overlay': req.__("page_configure_settings_type_overlay"),
            'page_configure_settings_type_slideout': req.__("page_configure_settings_type_slideout"),

            'page_configure_description': req.__("page_configure_description"),
            'page_configure_tool_section_tile': req.__("page_configure_tool_section_tile"),
            'page_configure_tool_about': req.__("page_configure_tool_about"),
            'page_configure_tool_how_to_use': req.__("page_configure_tool_how_to_use"),
            'page_configure_tool_settings_title': req.__("page_configure_tool_settings_title"),
            'page_configure_tool_card_collapse_settings': req.__("page_configure_tool_card_collapse_settings"),
            'page_configure_tool_card_collapse_close': req.__("page_configure_tool_card_collapse_close"),
            'select_multiple_widget_title': req.__("select_multiple_widget_title"),
            'select_single_widget_title': req.__("select_single_widget_title"),
            'select_multiple_presentation_title': req.__("select_multiple_presentation_title"),
            'select_single_presentation_title': req.__("select_single_presentation_title"),
            'select_multiple_widget_legend': req.__("select_multiple_widget_legend"),
            'select_multiple_presentation_legend': req.__("select_multiple_presentation_legend"),
            'change_widget_button_label': req.__("change_widget_button_label"),


        };

        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    },

    translateContentReplacements: async (req, res, next) => {
        let loc = {
            'page_content_replacement_title': req.__("page_content_replacement_title"),
            'page_content_replacement_intro_text': req.__("page_content_replacement_intro_text"),
            'page_content_replacement_create_new': req.__("page_content_replacement_create_new"),
            'content_replacement_title': req.__('content_replacement_title'),
            'content_replacement_description': req.__('content_replacement_description'),
            'content_replacement_url': req.__("content_replacement_url"),
            'content_replacement_selector_type': req.__("content_replacement_selector_type"),
            'content_replacement_selector': req.__("content_replacement_selector"),
            'content_replacement_edit': req.__("content_replacement_edit"),
            'content_replacement_delete': req.__("content_replacement_delete"),
            'page_content_replacement_edit_title': req.__("page_content_replacement_edit_title"),
            'page_content_replacement_edit_legend': req.__("page_content_replacement_edit_legend"),
            'dom_selector_label': req.__("dom_selector_label"),
            'w3c_selector_label': req.__("w3c_selector_label"),
            'selector_label': req.__("selector_label"),
            'scope_label': req.__("scope_label"),
            'public': req.__("public"),
            'clients': req.__("clients"),
            'active_label': req.__("active_label"),

        };

        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    },

    translateClientWelcome: async (req, res, next) => {

        let loc = {
            'page_client_welcome_title': req.__("page_client_welcome_title"),
            'page_client_welcome_intro_title': req.__("page_client_welcome_intro_title"),
            'page_client_welcome_intro_description_1': req.__("page_client_welcome_intro_description_1"),
            'page_client_welcome_intro_description_2': req.__("page_client_welcome_intro_description_2"),
            'page_client_welcome_intro_description_3': req.__("page_client_welcome_intro_description_3"),
            'page_client_welcome_intro_description_4': req.__("page_client_welcome_intro_description_4"),
            'page_client_welcome_intro_description_5': req.__("page_client_welcome_intro_description_5"),
            'page_client_welcome_tool_panel_layout_description': req.__("page_client_welcome_tool_panel_layout_description"),
            'page_client_welcome_to_configuration_title': req.__("page_client_welcome_to_configuration_title"),
            'page_client_welcome_to_configuration_link_text': req.__("page_client_welcome_to_configuration_link_text"),
            'page_client_welcome_to_configuration_description': req.__("page_client_welcome_to_configuration_description")
        };

        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    },

    translateBasicSetting: async (req, res, next) => {

        let loc = {
            'page_basic_setting_tittle': req.__("page_basic_setting_tittle"),
            'page_basic_setting_description': req.__("page_basic_setting_description"),
            'page_basic_setting_language_title': req.__("page_basic_setting_language_title"),
            'page_basic_setting_language_description': req.__("page_basic_setting_language_description"),
            'page_basic_setting_language_label': req.__("page_basic_setting_language_label"),
            'page_basic_setting_adaptable_title': req.__("page_basic_setting_adaptable_title"),
            'page_basic_setting_adaptable_description': req.__("page_basic_setting_adaptable_description"),
            'page_basic_setting_adaptable_label': req.__("page_basic_setting_adaptable_label"),
            'page_basic_setting_adaptive_label': req.__("page_basic_setting_adaptive_label"),
            'page_basic_setting_reasoner_title': req.__("page_basic_setting_reasoner_title"),
            'page_basic_setting_reasoner_description': req.__("page_basic_setting_reasoner_description"),
            'page_basic_setting_reasoner_on_label': req.__("page_basic_setting_reasoner_on_label"),
            'page_basic_setting_reasoner_off_label': req.__("page_basic_setting_reasoner_off_label"),
            'page_basic_setting_reasoner_models_label': req.__("page_basic_setting_reasoner_models_label"),
            'adaptive_help': req.__("adaptive_help"),
            'adaptive_help_intro': req.__("adaptive_help_intro"),
            'page_basic_setting_adaptable_you_can_choose': req.__("page_basic_setting_adaptable_you_can_choose"),
            'automatic_help_warning': req.__("automatic_help_warning"),
            'automatic_help_intro': req.__("automatic_help_intro"),
            'automatic_help': req.__("automatic_help"),




        };
        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    },

    translateClientCaretakerRegister: async (req, res, next) => {

        let loc = {
            'page_registercaretaker_title': req.__("page_registercaretaker_title"),
            'page_registercaretaker_label_google': req.__("page_registercaretaker_label_google"),
            'caretaker_already_assigned': req.__("caretaker_already_assigned"),
            'caretaker_cannot_be_you': req.__("caretaker_cannot_be_you"),
            'user_is_not_a_caretaker': req.__("user_is_not_a_caretaker"),
            'user_not_found': req.__("user_not_found"),
        };
        /*
         'caretaker_already_assigned': req.__(" is already assigned to you as a caretaker!"),
                    'caretaker_cannot_be_you': req.__("You cannot assign yourself!"),
                    'user_is_not_a_caretaker': req.__("is not a caretaker"),
                    'user_not_found': req.__("User not found!"),
         */
        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    },

    translateCaretaker: async (req, res, next) => {

        let loc = {
            'page_caretaker_title': req.__("page_caretaker_title"),
            'page_caretaker_select': req.__("page_caretaker_select"),
            'page_caretaker_clients': req.__("page_caretaker_clients"),
        };

        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    },

    translateCaretakerList: async (req, res, next) => {

        let loc = {
            'page_caretakerlist_title': req.__("page_caretakerlist_title"),
            'page_caretakerlist_select': req.__("page_caretakerlist_select"),
            'page_registercaretaker_title': req.__("page_registercaretaker_title"),
            'page_remove_caretaker': req.__("page_remove_caretaker"),
            'caretaker_name_label': req.__("caretaker_name_label"),
            'caretaker_email_label': req.__("caretaker_email_label"),
            'page_client_caretaker_info': req.__("page_client_caretaker_info"),

        };

        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    },

    translateClientList: async (req, res, next) => {

        let loc = {
            'page_clientlist_title': req.__("page_clientlist_title"),
            'page_clinetlist_edit': req.__("page_clinetlist_edit"),
            'page_clinetlist_clients': req.__("page_clinetlist_clients"),
            'page_clientlist_clients_empty': req.__("page_clientlist_clients_empty"),



        };

        res.locals.context = {
            ...res.locals.context,
            ...loc
        };

        return next();
    }

};
