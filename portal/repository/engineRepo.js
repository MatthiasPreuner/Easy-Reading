const core = rootRequire("core/core");
const databaseManager = core.databaseManager;

module.exports = {

    getEngineConfigByUserId : async (id) => {
        
        const sql = `SELECT tool_conf.* FROM profile p 
                     INNER JOIN ui_collection ui_coll ON p.id = ui_coll.pid
                     INNER JOIN ui_conf ui_conf ON ui_coll.id = ui_conf.ui_collection
                     INNER JOIN tool_conf tool_conf ON ui_conf.id = tool_conf.ui_conf_id
                     WHERE p.id=?
                        AND ui_coll.active = ?;`;

        const sqlParamters = [id, 1];
     
        const toolConfigIdForUser = await databaseManager.executeSql(sql, sqlParamters);
        return toolConfigIdForUser;
     }
}