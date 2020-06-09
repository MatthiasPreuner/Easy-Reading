module.exports = {
    setupController: async (req, res, next) => {


        let totalSteps = 8;
        let step = 0;
        if (req.session.step) {
            step = req.session.step;
        } else {
            req.session.setupInformation = [];
            for (let i = 0; i < totalSteps; i++) {
                req.session.setupInformation.push(0);
            }
        }


        if (!req.session.internalStep) {
            req.session.internalStep = 0;
        }
        if (step === 0) {
            req.session.internalStep = 0;
        }


        if (step > 0 && req.method === "POST") {

            switch (step) {
                case 1:

                    //Audio
                    req.session.setupInformation[0] = {
                        tts: req.body.tts,
                        tts_speed: req.body.tts_speed,
                    };

                    /*
                    //Text easier to understand
                    req.session.setupInformation[0] =  {
                        easytext: req.body.easytext,
                        translation: req.body.translation,
                        video: req.body.video,

                    };
                    */
                    break;
                case 2:

                    req.session.setupInformation[1] = {
                        easytext: req.body.easytext,
                        translation: req.body.translation,

                    };

                    /*
                    //Preferred Symbol
                    req.session.setupInformation[1] =  {
                        preferred_symbol: req.body.preferred_symbol,
                    };

                     */
                    break;
                case 3:

                    if (req.session.internalStep === 0) {
                        req.session.setupInformation[2] = {
                            multimedia_support: req.body.multimedia_support,

                        };
                    } else {

                        req.session.setupInformation[7] = {
                            presentation: req.body.presentation,
                        }
                    }


                    /*
                    req.session.setupInformation[2] =  {
                        colorize: req.body.colorize,
                        fonts: req.body.fonts,
                        links: req.body.links,
                        noads:req.body.noads,
                        reading:req.body.reading,

                    };

                     */
                    break;
                case 4:

                    if (req.session.internalStep === 0) {
                        req.session.setupInformation[3] = {
                            symbol_support: req.body.symbol_support,
                            preferred_symbol: req.body.preferred_symbol,
                        };
                    } else {

                        req.session.setupInformation[7] = {
                            presentation: req.body.presentation,
                        }
                    }


                    /*
                    req.session.setupInformation[3] =  {
                        tts: req.body.tts,
                        highlightning: req.body.highlightning,
                    };

                     */

                    break;
                case 5:


                    req.session.setupInformation[4] = {
                        colorize: req.body.colorize,
                        fonts: req.body.fonts,
                        line_spacing: req.body.line_spacing,

                    };
                    /*
                    req.session.setupInformation[4] =  {
                        text_selection: req.body.text_selection,
                    };

                     */

                    break;
                case 6:

                    req.session.setupInformation[5] = {
                        links: req.body.links,
                        noads: req.body.noads,
                        reading: req.body.reading,

                    };


                    /*
                    req.session.setupInformation[5] =  {
                        presentation: req.body.presentation,
                        user_interface: req.body.user_interface,
                    };
*/


                    break;

                case 7:
                    req.session.setupInformation[6] = {
                        text_selection: req.body.text_selection,
                    };


                    break;


            }
        }

        res.locals.setupInformation = req.session.setupInformation;

        if (req.body.personalizedProfile) {

            step = 1;

        } else if (req.body.defaultProfile) {

            step = 8;

            res.locals.defaultProfile = true;

        } else if (req.body.progressBar && req.method === "POST") {

            if (req.body.progressBar === "next") {


                if (step === 3) {


                    if (req.session.setupInformation[2].multimedia_support === "yes") {
                        if (req.session.internalStep === 0) {
                            req.session.internalStep = 1;
                        } else {
                            req.session.internalStep = 0;
                            step++;
                        }
                    } else {

                        req.session.internalStep = 0;
                        req.session.setupInformation[5] = 0;
                        step++;

                    }
                } else if (step === 4) {
                    if (req.session.setupInformation[3].symbol_support === "yes" && req.session.setupInformation[2].multimedia_support !== "yes") {
                        if (req.session.internalStep === 0) {
                            req.session.internalStep = 1;
                        } else {
                            req.session.internalStep = 0;
                            step++;
                        }
                    } else {
                        req.session.internalStep = 0;
                        if (req.session.setupInformation[3].symbol_support === "no") {
                            req.session.setupInformation[5] = 0;
                        }
                        step++;

                    }

                } else {
                    step++;
                }


            } else if (req.body.progressBar === "previous") {
                if (step === 3) {
                    if (req.session.setupInformation[2].multimedia_support === "yes") {
                        if (req.session.internalStep === 0) {
                            step--;
                        } else {
                            req.session.internalStep = 0;

                        }
                    } else {
                        step--;
                        req.session.internalStep = 0;
                    }
                } else if (step === 4) {
                    if (req.session.setupInformation[3].symbol_support === "yes") {
                        if (req.session.internalStep === 0) {

                            if (req.session.setupInformation[2].multimedia_support === "yes") {
                                req.session.internalStep = 1;
                            }
                            step--;
                        } else {
                            req.session.internalStep = 0;

                        }
                    } else {
                        step--;
                    }
                } else if (step === 5 && req.session.setupInformation[2].multimedia_support !== "yes" && req.session.setupInformation[3].symbol_support === "yes") {
                    req.session.internalStep = 1;
                    step--;
                } else {
                    req.session.internalStep = 0;
                    step--;
                }
            } else {
                step = parseInt(req.body.progressBar);
                //Reset internal step
                req.session.internalStep = 0;
            }

        }


        if (step === 8) {


            let supportCategories = createSupportCategories(req, res);
            //  await saveSupportData(data,req.session.user.id);

            //Fore user wizard user testing...
            await storeUserTestData(req);




            let automatedProfileCreator = require("../../../core/profile/automated-profile-creator");
            await automatedProfileCreator.createConfigurationForSupportCategories(supportCategories, req.session.user.id);
            res.redirect("/client/finished");
            return;
        }

        req.session.step = step;


        if (step > 0) {
            res.locals.previousStep = step - 1;
        }
        res.locals.currentStep = step;
        res.locals.nextStep = step + 1;


        let stepInformation = [];

        for (let i = 1; i < totalSteps; i++) {

            if (i < step) {
                stepInformation.push({
                    stepNumber: i,
                    step: "completedStep"
                });
            } else if (i === step) {
                let currentStep = {
                    stepNumber: i,
                    step: "currentStep",
                    percent: "",
                };
                if (req.session.internalStep) {
                    currentStep.percent = "percent-50"
                }
                stepInformation.push(currentStep);
            } else {
                stepInformation.push({
                    stepNumber: i,
                    step: "upcomingStep"
                });

            }


        }

        if (step < 0) {
            step = 0;
            console.log("error step");
        }

        res.locals.stepInformation = stepInformation;
        res.locals.lang = req.locale;
        if (req.session.internalStep === 0) {
            res.render('client_setup_step_' + step, res.locals.context);
        } else {
            res.render('client_setup_step_' + step + "_" + req.session.internalStep, res.locals.context);
        }
        //   return next();
    }


};

let databaseManager = require("../../../core/database/database-manager");

/*
async function saveSupportData(data,pid) {



    let keys = [];
    Object.entries(data).forEach(([key, value]) => {
        keys.push(key);
    });

    for(let i=0; i < keys.length; i++){

        //Delete old stuff
        let deleteOldSupportDataRequest = databaseManager.createRequest("profile_"+keys[i]).where("pid", "=", pid).delete();
        await databaseManager.executeRequest(deleteOldSupportDataRequest);


        data[keys[i]].pid = pid;
        let insertNewDataRequest = databaseManager.createRequest("profile_"+keys[i]).insert(data[keys[i]]);
        let insertNewDataRequestResult = await databaseManager.executeRequest(insertNewDataRequest);

    }

};
*/


function createSupportCategories(req, res) {


    let profileBuilder = require("../../../core/profile/profile-builder");
    let supportCategories = profileBuilder.createDefaultSupportCategories(req.user.id);

    if (res.locals.defaultProfile) {
        return supportCategories;
    }

    if (req.session.setupInformation) {
        let setupInformation = req.session.setupInformation;

        //Reading Support
        if (setupInformation[0].tts === "yes") {
            supportCategories.reading_support.tts.preference = 50;
            supportCategories.reading_support.tts.speed = setupInformation[0].tts_speed;
            supportCategories.reading_support.tts.syntax_highlightning = true;
        } else {
            supportCategories.reading_support.tts.preference = 0;
        }

        //Understanding Support
        if (setupInformation[1].easytext) {
            if (setupInformation[1].easytext === "true") {
                supportCategories.text_support.simplified_language.preference = 50;
            } else {
                supportCategories.text_support.simplified_language.preference = 0;
            }
        }

        if (setupInformation[1].translation) {
            if (setupInformation[1].translation === "true") {
                supportCategories.text_support.translation.preference = 50;
            } else {
                supportCategories.text_support.translation.preference = 0;
            }
        }

        if (setupInformation[2].multimedia_support) {
            if (setupInformation[2].multimedia_support === "yes") {
                supportCategories.text_support.multimedia_annotation.preference = 50;
            } else {
                supportCategories.text_support.multimedia_annotation.preference = 0;
            }
        }

        //Symbol Support
        if (setupInformation[3].symbol_support !== "") {

            if (setupInformation[3].symbol_support === "yes") {
                supportCategories.symbol_support.aac.preference = 50;

                if (setupInformation[3].preferred_symbol) {
                    supportCategories.symbol_support.aac.preferred_library = setupInformation[3].preferred_symbol;
                } else {
                    supportCategories.symbol_support.aac.preferred_library = "widgit";
                }


            } else {
                supportCategories.symbol_support.aac.preference = 0;
                supportCategories.symbol_support.aac.preferred_library = "none";
            }
        }
        //Layout Support New
        if (setupInformation[4].fonts) {
            if (setupInformation[4].fonts === "true") {
                supportCategories.layout_support.font_support.preference = 50;
            } else {
                supportCategories.layout_support.font_support.preference = 0;
            }
        }
        if (setupInformation[4].colorize) {
            if (setupInformation[4].colorize === "true") {
                supportCategories.layout_support.color_support.preference = 50;
            } else {
                supportCategories.layout_support.color_support.preference = 0;
            }
        }

        //THIS IS THE SAME AS FONTS...
        if (setupInformation[4].line_spacing) {
            if (setupInformation[4].line_spacing === "true") {
                supportCategories.layout_support.font_support.preference = 50;
            } else {
                supportCategories.layout_support.font_support.preference = 0;
            }
        }


        if (setupInformation[5].noads) {
            if (setupInformation[5].noads === "true") {
                supportCategories.layout_support.ad_support.preference = 50;
            } else {
                supportCategories.layout_support.ad_support.preference = 0;
            }
        }

        if (setupInformation[5].links) {
            if (setupInformation[5].links === "true") {
                supportCategories.layout_support.link_support.preference = 50;
            } else {
                supportCategories.layout_support.link_support.preference = 0;
            }
        }

        if (setupInformation[5].reading) {
            if (setupInformation[5].reading === "true") {
                supportCategories.layout_support.layout_support.preference = 50;
            } else {
                supportCategories.layout_support.layout_support.preference = 0;
            }
        }


        //Input Support
        if (setupInformation[6].text_selection !== "") {

            if (setupInformation[6].text_selection === "click") {
                supportCategories.input.text_selection_click.preference = 50;
                supportCategories.input.text_selection_mark.preference = 0;
            } else if (setupInformation[6].text_selection === "mark") {
                supportCategories.input.text_selection_click.preference = 0;
                supportCategories.input.text_selection_mark.preference = 50;
            }

        }

        //Presentation support
        if (setupInformation[7].presentation) {
            if (setupInformation[7].presentation === "tooltip") {
                supportCategories.output.tooltip.preference = 50;
                supportCategories.output.above_word.preference = 0;
                supportCategories.output.next_to_word.preference = 0;
            } else if (setupInformation[7].presentation === "top") {
                supportCategories.output.tooltip.preference = 0;
                supportCategories.output.above_word.preference = 50;
                supportCategories.output.next_to_word.preference = 0;

            } else if (setupInformation[7].presentation === "next") {
                supportCategories.output.tooltip.preference = 0;
                supportCategories.output.above_word.preference = 0;
                supportCategories.output.next_to_word.preference = 50;
            }

        }


        //Default is now slide in
        supportCategories.user_interface.overlay.preference = 0;
        supportCategories.user_interface.slide_in.preference = 50;

        /*
        //User interface
        if(setupInformation[5].user_interface){
            if(setupInformation[5].user_interface === "overlay"){
                supportCategories.user_interface.overlay.preference = 50;
                supportCategories.user_interface.slide_in.preference = 0;
            }else{
                supportCategories.user_interface.overlay.preference = 0;
                supportCategories.user_interface.slide_in.preference = 50;
            }
        }*/
    }

    return supportCategories;


}

async function storeUserTestData(req){

    let defaultProfile = false;
    if(req.body){
        if(req.body.defaultProfile){
            defaultProfile = true;
        }
    }
    let setupInformation = "";
    if (req.session.setupInformation) {
        setupInformation = JSON.stringify(req.session.setupInformation);
    }

    let lang = "?";
    if(req.locale){
        lang = req.locale;
    }


    let login = "";
    if(req.session){
        if(req.session.user){
            login = req.session.user.email;
        }
    }


    let data = {
        lang: lang,
        login:login,
        json:setupInformation,
        timestamp: Math.floor(Date.now()/1000),
        defaultProfile: defaultProfile,
    };

    let request = databaseManager.createRequest("wizard_user_test").insert(data);

    let collectionInsertResult = await databaseManager.executeRequest(request);
}