const contentReplacementRepo = require("../../repository/contentReplacmentRepo");
const core = rootRequire("core/core");
const databaseManager = core.databaseManager;
const mysql = require('mysql');
module.exports = {
    /**
     * Gets the content replacements for a given user from the repository
     * @param {Request} req Request object that includes the unique UserId
     * @param {Response} res Response object that is used for storing the content
     * @param next Returns the response object
     */
    getContentReplacementsByUserId: async (req, res, next) => {

        const id = req.query.id;
        if (!id) return res.redirect('/');

        let results = [];

        const contentReplacementsOfUser = await contentReplacementRepo.getContentReplacementsByUserId(id);

        res.locals.context = {
            contentReplacements: contentReplacementsOfUser,
            backURL: req.session.returnTo || '/',
            ...res.locals.context
        };

        return next();
    },

    /**
     * Gets the content replacements for a given id from the repository
     * @param {Request} req Request object that includes the content ID to get
     * @param {Response} res Response object that is used for storing the content
     * @param next Returns the response object
     */    
    getContentReplacementsById: async (req, res, next) => {
        let id = null;
        if ('user' in req && 'id' in req.user) {
            id = req.user.id;
        }
        if (!id) return res.redirect('/');

        let contentReplacement = null;

        if(req.query.id){
            contentReplacement = await contentReplacementRepo.getContentReplacementsById(req.query.id);
        }

        res.locals.context = {
            contentReplacement: contentReplacement,
            backURL: req.session.returnTo || '/',
            ...res.locals.context
        };

        return next();
    },

    /**
     * Add or Update the content replacements for a given user from the repository
     * @param {Request} req Request object that includes the unique UserId and the content as body
     * @param {Response} res Response object that used for redirect to next page
     * @param next Not used
     */    
    saveOrUpdateContentReplacement: async (req, res, next) => {
        if (!req.body || !req.user.id) {
            return res.sendStatus(401).end();
        }

        if(req.body.active === "true"){
            req.body.active = true;
        }else{
            req.body.active = false;
        }

        try{
            for (let prop in (req.body)) {
                if (Object.prototype.hasOwnProperty.call(req.body, prop)) {

                    req.body[prop] = mysql.escape(req.body[prop]);


                    if(req.body[prop].startsWith("'") && req.body[prop].endsWith("'") ){
                        req.body[prop] = req.body[prop].substr(1);
                        req.body[prop] = req.body[prop].substring(0, req.body[prop].length - 1);
                    }
                }
            }
        }catch (e) {
            console.log(e);
        }


        //UPDATE
        if(req.body.id){
            let request = databaseManager.createRequest("content_replacement").update(req.body).where("id","=",req.body.id);
            let updateRequest = await databaseManager.executeRequest(request);
        }else{
            req.body.pid = req.user.id;

            let request = databaseManager.createRequest("content_replacement").insert(req.body);
            let newContentReplacement = await databaseManager.executeRequest(request);
        }

        return res.redirect('/caretaker/custom-paragraphs-overview?id=' + req.user.id);
    },

    /**
     * ???
     * @param {Request} req Request object that includes the unique UserId and the content as body
     * @param {Response} res Response object that is used for storing the content and set response status
     * @param next Not used
     */       
    quickEditContentReplacement: async (req, res, next) => {
        let id = 0;
        if (!req.body || !req.user.id) {
            return res.sendStatus(401).end();
        }
        try {
            for (let element in req.body) {
                if (element.startsWith("delete_")) {
                    res.locals.context = {
                        contentReplacementID: element.replace("delete_", ""),
                        backURL: req.session.returnTo || '/',
                        ...res.locals.context
                    };

                    return deleteContentReplacement(req, res, next);
                }
            }
        } catch (error) {
            return res.sendStatus(500).end();
        }
    }
};

/**
* Deletes the content replacements for a given user from the repository
* @param {Request} req Request object that includes the unique UserId and the content as body
* @param {Response} res Response object that is used for storing the content and set response status
* @param next Not used
*/    
const deleteContentReplacement = async (req, res, next) => {

    let id = 0;
    if (!req.body || !req.user.id) {
        return res.sendStatus(401).end();
    }

    try {
        id = req.user.id;
        if (res.locals.context.contentReplacementID && await userOwnsContentReplacement(id, res.locals.context.contentReplacementID)){
            let deleteContentReplacementRequest = databaseManager.createRequest("content_replacement")
                .where("id", '=', res.locals.context.contentReplacementID).delete();
            let result_remove = await databaseManager.executeRequest(deleteContentReplacementRequest);
        } else {
            return res.sendStatus(401).end();
        }
    } catch (error) {
        return res.sendStatus(500).end();
    }

    return res.redirect('/caretaker/custom-paragraphs-overview?id=' + id);

};

/**
* Check if the user owns the requested content replacement
* @param {number} u_id User id
* @param {number} cr_id Content Replacement id
* @returns {bool}
*/   
const userOwnsContentReplacement = async (u_id, cr_id) => {
    if (u_id && cr_id > 0) {
        let results = [];
        const contentReplacment = await contentReplacementRepo.getContentReplacementsById(cr_id);

        if(contentReplacment.pid) {
            if(contentReplacment.pid === u_id) {
                return true;
            }
        }
    }
    return false;
};
