let express = require('express');
let router = express.Router();
let databaseManager = require("../../../core/database/database-manager");
router.use('/', async function (req, res, next) {


    if (req.method === "POST") {
        try {
            if (req.body.upgrade) {
                if (req.body.upgrade[0] === "yes") {

                    if (!req.user.roles.includes("caretaker")) {
                        let saveRoleRequest = databaseManager.createRequest("role").insert({
                            user_id: req.user.id,
                            role: "caretaker"
                        });
                        await databaseManager.executeRequest(saveRoleRequest);
                        req.user.roles.push("caretaker");
                    }


                }
            }
        } catch (error) {
            console.log(error);
        }
    }


    next();
});

module.exports = router;