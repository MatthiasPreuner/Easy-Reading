let DatabaseManager = {

    connect: function () {

        let credentialManager = require("../util/credential-manager");
        let databaseConfiguration = {};
        if (credentialManager.hasKey("EASY_READING_DB_DRIVER") &&
            credentialManager.hasKey("EASY_READING_DB_USER") &&
            credentialManager.hasKey("EASY_READING_DB_PW") &&
            credentialManager.hasKey("EASY_READING_DB_HOST") &&
            credentialManager.hasKey("EASY_READING_DB_PORT") &&
            credentialManager.hasKey("EASY_READING_DB_NAME")) {
            databaseConfiguration = {
                driver: credentialManager.getValueForKey("EASY_READING_DB_DRIVER"),
                host: credentialManager.getValueForKey("EASY_READING_DB_HOST"),
                user: credentialManager.getValueForKey("EASY_READING_DB_USER"),
                password: credentialManager.getValueForKey("EASY_READING_DB_PW"),
                port: credentialManager.getValueForKey("EASY_READING_DB_PORT"),
                database: credentialManager.getValueForKey("EASY_READING_DB_NAME"),
            }

        } else {
            databaseConfiguration = require("./../../database-config");
        }


        if (databaseConfiguration.driver) {
            if (databaseConfiguration.driver === "mysql") {
                let ActiveDatabaseClass = require("./database-connections/mysql-connection");
                activeDatabase = new ActiveDatabaseClass();
                return activeDatabase.init(databaseConfiguration);
            } else {
                throw Error("Invalid database driver ");
            }
        } else {
            throw Error("No database driver given!");
        }
    },

    getConnection: function () {

        return activeDatabase;
    },

    createBaseTables: async function () {

        let errorMsg = null;
        try {
            let coreTableDefinitions = require("./core-table-definitions");
            let tableDefinitions = coreTableDefinitions.getDefinitions();
            for (let i = 0; i < tableDefinitions.length; i++) {

                await DatabaseManager.createOrSyncTablesFromSchema(tableDefinitions[i]);
            }
        } catch (error) {
            errorMsg = error;
        }
        return new Promise(function (resolve, reject) {
            if (errorMsg) {
                reject(errorMsg);
            } else {
                resolve();
            }
        });
    },

    createOrSyncTablesFromSchema: async function (schema, tableName) {

        let errorMsg = null;

        try {
            let $RefParser = require('json-schema-ref-parser');

            let completeSchema = await $RefParser.bundle(schema).catch(function (error) {
                console.log(error);
            });

            if (typeof tableName === "undefined") {
                tableName = completeSchema.title;
            }
            if (!completeSchema.$id) {
                completeSchema.$id = tableName;
            }
            databaseTableSchemas.push({
                tableName: tableName,
                schema: completeSchema,
            });


            await createTablesFromSchema(tableName, completeSchema);
        } catch (error) {
            errorMsg = error;
        }


        return new Promise(function (resolve, reject) {
            if (errorMsg) {
                reject(errorMsg);
            } else {
                resolve();
            }
        });

    },

    createRequest: function (tableName) {
        let request = require("./database-request");

        return new request(tableName);
    },

    executeSql: async function (sql, parameters) {

        let errorMsg = null;
        let result = null;
        try {
            result = await activeDatabase.executeSQL(sql, parameters);
        } catch (error) {
            errorMsg = error;
        }

        return new Promise(function (resolve, reject) {

            if (errorMsg) {
                reject(errorMsg);
            } else {
                resolve(result);
            }
        });
    },

    executeRequest: async function (request, sanitizeForSchema = false) {

        let errorMsg = null;
        let result = null;
        try {
            let schema = getSchemaForTable(request.tableName);
            if (request.op === "INSERT" || request.op === "UPDATE" || request.op === "INSERT_OR_UPDATE") {


                //console.log(schema);


                // let objectIsValid = ajv.validate(schema, request.object);
                let objectIsValid = validateObject(request.object, schema);
                if (objectIsValid) {

                    let sql = null;
                    if (request.op === "INSERT") {
                        request.columnValues = getColumnValuePairsForObject(request.object, schema);
                        sql = activeDatabase.createInsertSQL(request);
                    } else if (request.op === "UPDATE") {
                        request.columnValues = getColumnValuePairsForObject(request.object, schema);
                        sql = activeDatabase.createUpdateSQL(request);
                    } else {
                        request.columnValues = getColumnValuePairsForObject(request.object, schema, true);
                        sql = activeDatabase.createInsertOrUpdateSQL(request);
                    }
                    result = await activeDatabase.executeSQL(sql);

                } else {

                    errorMsg = error("Object is not conform to schema");
                }

            } else if (request.op === "SELECT") {

                let sql = activeDatabase.createSelectSQL(request);
                result = await activeDatabase.executeSQL(sql);


            } else if (request.op === "DELETE") {
                let sql = activeDatabase.createDeleteSQL(request);

                result = await activeDatabase.executeSQL(sql);

            }

            if (sanitizeForSchema) {
                if (sanitizeForSchema) {
                    if (result.result) {
                        if (result.result.length > 0) {

                            for(let i=0; i < result.result.length; i++){
                                result.result[i] = await this.getObjectFromResult(result.result[i],request.tableName);
                            }

                        }
                    }
                }

            }
        } catch (error) {
            errorMsg = error;
        }

        return new Promise(function (resolve, reject) {

            if (errorMsg) {
                reject(errorMsg);
            } else {


                resolve(result);
            }
        });


    },

    getConfigTableNameForEngine(engine) {
        return (engine.id + "_" + engine.version.replace(/\./g, "_") + "_config").replace(/-/g, "_");
    },

    getConfigTableNameForComponent(component) {
        return (component.id + "_" + component.version.replace(/\./g, "_") + "_config").replace(/-/g, "_");
    },

    getConfigTableNameForLayout(ui) {
        return (ui.id + "_" + ui.version.replace(/\./g, "_") + "_layout").replace(/-/g, "_");
    },

    async getObjectFromResult(result, tableName) {

        let errorMsg = null;
        let defaultObject = null;
        try {
            let schema = getSchemaForTable(tableName);
            let defaults = require('json-schema-defaults');
            defaultObject = defaults(schema);

            let keys = Object.keys(result);
            for (let i = 0; i < keys.length; i++) {
                defaultObject[keys[i]] = result[keys[i]];

                //Assign real bool values "true","false" instead of 0 1
                //0 is always the id
                if (i > 0) {
                    if (schema.properties) {
                        if (schema.properties[keys[i]].type === "boolean") {
                            if (defaultObject[keys[i]] === 0) {
                                defaultObject[keys[i]] = false;
                            } else if (defaultObject[keys[i]] === 1) {
                                defaultObject[keys[i]] = true;
                            }
                        }
                    }
                }
            }

            //TODO handle nested object and arrays...
        } catch (error) {
            errorMsg = error;
        }

        return new Promise(function (resolve, reject) {
            if (errorMsg) {
                reject(errorMsg);
            } else {
                resolve(defaultObject);
            }

        });
    }


};
//Private
let activeDatabase = null;

async function createTablesFromSchema(tableName, schema, referencingTableName, type) {

    let errorMsg = null;

    try {
        let properties = Object.keys(schema.properties);
        let columnDescriptions = {};
        for (let i = 0; i < properties.length; i++) {

            switch (schema.properties[properties[i]].type) {
                case "boolean":
                    columnDescriptions[properties[i]] = activeDatabase.getColumnDescriptionForBool(properties[i], schema.properties[properties[i]]);
                    break;
                case "string":
                    columnDescriptions[properties[i]] = activeDatabase.getColumnDescriptionForString(properties[i], schema.properties[properties[i]])
                    break;
                case "integer":
                    columnDescriptions[properties[i]] = activeDatabase.getColumnDescriptionForInteger(properties[i], schema.properties[properties[i]])
                    break;
                case "number":
                    columnDescriptions[properties[i]] = activeDatabase.getColumnDescriptionForNumber(properties[i], schema.properties[properties[i]])
                    break;
                case "array":
                    console.log("array");
                    break;
                case "object":
                    console.log("object");
                    break;
                default:
                    errorMsg = new Error("Unsupported type:" + schema.properties[properties[i]].type);
                    break;
            }
        }

        if (!errorMsg) {
            let result = null;
            if (!await activeDatabase.tableExists(tableName)) {
                let sqlCommand = activeDatabase.getTableDescription(tableName, columnDescriptions, schema.unique);
                result = await activeDatabase.executeSQL(sqlCommand);
            } else {
                // Check if any columns must be removed
                result = await activeDatabase.executeSQL(activeDatabase.getTableColumnDescriptions(tableName));
                for (let j = 0; j < result.result.length; j++) {
                    let field_name = result.result[j].Field;
                    let drop_column = false;
                    if (field_name !== "id") {
                        let found = false;
                        for (let k = 0; k < properties.length; k++) {
                            if (properties[k] === field_name) {
                                found = true;
                                if ('type' in schema.properties[properties[k]]) {
                                    let compatible = await activeDatabase.areColumnTypesCompatible(
                                        result.result[j].Type,
                                        schema.properties[properties[k]]['type']);
                                    drop_column = !compatible;
                                }
                                break;
                            }
                        }
                        if (!found) {
                            drop_column = true;
                        }
                        if (drop_column) {
                            let col_drop_sql = activeDatabase.dropColumnDescription(tableName, field_name);
                            result = await activeDatabase.executeSQL(col_drop_sql);
                            console.log("Removing unused field " + field_name + "from table " + tableName);
                        }
                    }
                }

                for (let col in columnDescriptions) {

                    // Check if any new columns must be added
                    if (!await activeDatabase.columnExists(tableName, col)) {
                        let sqlCommand = activeDatabase.getColumnDescription(tableName, columnDescriptions[col]);
                        result = await activeDatabase.executeSQL(sqlCommand);
                    }

                    // Check for missing default values
                    let col_prop = schema.properties[col];
                    if (typeof col_prop.format === "undefined") {
                        let def_val = null;
                        if ('default' in col_prop) {
                            def_val = col_prop['default'];
                        }
                        let col_type = null;
                        if ('type' in col_prop) {
                            col_type = col_prop['type'];
                        }
                        if (def_val && col_type) {
                            let sqlCommand = activeDatabase.getUpdateNullValues(tableName, col, def_val, col_type);
                            if (sqlCommand) {
                                result = await activeDatabase.executeSQL(sqlCommand);
                            }
                        }
                    }

                }
            }
        }

    } catch (error) {
        errorMsg = error;
    }

    return new Promise(function (resolve, reject) {
        if (errorMsg) {
            reject(errorMsg);
        } else {
            resolve({
                created: true,
                tableName: tableName,
                result: resolve,
            });
        }


    });
}

module.exports = DatabaseManager;


//Private
function getSchemaForTable(tableName) {

    for (let i = 0; i < databaseTableSchemas.length; i++) {
        if (databaseTableSchemas[i].tableName === tableName) {
            return databaseTableSchemas[i].schema;
        }
    }

}

function getColumnValuePairsForObject(object, schema, considerID = false) {
    let columns = Object.keys(object);

    let columnValuePairs = [];

    for (let i = 0; i < columns.length; i++) {
        if (typeof schema.properties[columns[i]] !== "undefined") {
            if (schema.properties[columns[i]].type === 'object') {

                //TODO

            } else if (schema.properties[columns[i]].type === 'array') {

                //TODO
            } else {


                columnValuePairs.push({
                    column: columns[i],
                    value: object[columns[i]],
                    type: schema.properties[columns[i]].type
                });

            }
        } else {

            if (considerID) {
                //ID is never part of the schema
                if (columns[i] === "id") {
                    columnValuePairs.push({
                        column: columns[i],
                        value: object[columns[i]],
                        type: "integer"
                    });

                }
            }

        }

    }
    return columnValuePairs;

}

let Ajv = require('ajv');
let ajv = new Ajv({
    unknownFormats: ['color'],
});

function validateObject(object, schema) {

    if (schema.$id) {

        if (ajv.getSchema(schema.$id)) {
            return ajv.validate(schema.$id, object);
        } else {
            return ajv.valueOf(schema, object);
        }
    } else {
        //TODO should never happen anyway... but could produce memory leaks if it would happen.
        return ajv.valueOf(schema, object);
    }
}

let databaseTableSchemas = [];