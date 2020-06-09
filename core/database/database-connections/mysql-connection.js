let DatabaseConnectionBase =  require("./database-connection-base");

class MysqlConnection extends DatabaseConnectionBase{
    constructor(){
        super();
        this.connection = null;
    }


    async init(configuration){
        let MySQLConnection  = this;
        return new Promise(function (resolve,reject) {


            let mysql = require('mysql');
            MySQLConnection.connection = mysql.createConnection({
                host: configuration.host,
                port: configuration.port,
                user: configuration.user,
                password: configuration.password,
                database: configuration.database
            });

            MySQLConnection.connection.connect(function (err) {
                if (err){
                    reject(err);
                }else{

                    console.log("connected");
                    resolve();
                }

            });

            setInterval(function () {
                MySQLConnection.connection.query('SELECT 1',function (error, results, fields) {
                    if (error) throw error;

                });
            }, 5000);

        });

    }


    createInsertSQL(request){

        let sql = "INSERT INTO "+request.tableName+" (";

        for(let i=0; i < request.columnValues.length; i++){
            sql+=request.columnValues[i].column;
            if(i < request.columnValues.length-1){
                sql+=",";
            }

        }

        sql+=")VALUES(";

        for(let i=0; i < request.columnValues.length; i++){
            sql+=this.getFormattedValue(request.columnValues[i]);
            if(i < request.columnValues.length-1){
                sql+=",";
            }
        }
        sql+=");";

        return sql;

    }

    createInsertOrUpdateSQL(request){
        let sql = "INSERT INTO "+request.tableName+" (";

        for(let i=0; i < request.columnValues.length; i++){
            sql+=request.columnValues[i].column;
            if(i < request.columnValues.length-1){
                sql+=",";
            }

        }

        sql+=")VALUES(";

        for(let i=0; i < request.columnValues.length; i++){
            sql+=this.getFormattedValue(request.columnValues[i]);
            if(i < request.columnValues.length-1){
                sql+=",";
            }
        }

        sql+=") ON DUPLICATE KEY UPDATE " ;

        let columnValues = [];
        for(let i=0; i < request.columnValues.length; i++){
            if (request.columnValues[i].column !== "id") {
                columnValues.push(request.columnValues[i]);
            }
        }

        for(let i=0; i < columnValues.length; i++){
            sql+=columnValues[i].column+"="+this.getFormattedValue(columnValues[i]);
            if(i < columnValues.length - 1){
                sql+=", ";
            }
        }
        sql+=";";
        sql+=";";

        return sql;
    }

    createUpdateSQL(request){

        let sql = "UPDATE "+request.tableName+" SET ";

        for(let i=0; i < request.columnValues.length; i++){
            if(request.columnValues[i].column !== "id") {
                sql+=request.columnValues[i].column+" = "+this.getFormattedValue(request.columnValues[i]);
                sql+=", ";
            }


        }
        if(request.columnValues.length > 0 ){
            sql = sql.substring(0, sql.length-2);
        }
        if(request.conditions.length > 0){
            sql+=" WHERE ";
            for(let i = 0; i < request.conditions.length; i++){

                if(typeof request.conditions[i][2] === "string"){

                    sql+=request.conditions[i][0]+" "+request.conditions[i][1]+" '"+request.conditions[i][2]+"'";
                }else{

                    sql+=request.conditions[i][0]+" "+request.conditions[i][1]+" "+request.conditions[i][2];

                }

                if(i < request.conditions.length-1){
                    sql+=" AND ";
                }
            }
        }else{
            throw Error("UPDATE without creating a where clause or providing row id");

        }

        return sql;

    }

    createSelectSQL(request){

        let selector = "*";
        if(request.selectors.length !== 0){

            //TODO

        }

        let sql = "SELECT "+selector+" FROM "+request.tableName;

        if(request.conditions.length > 0){
            sql+=" WHERE ";
        }

        for(let i = 0; i < request.conditions.length; i++){

            if(typeof request.conditions[i][2] === "string"){

                sql+=request.conditions[i][0]+" "+request.conditions[i][1]+" '"+request.conditions[i][2]+"'";
            }else{

                sql+=request.conditions[i][0]+" "+request.conditions[i][1]+" "+request.conditions[i][2];

            }

            if(i < request.conditions.length-1){
                sql+=" AND ";
            }
        }

        if(request.orders.length > 0){
            sql+=" ORDER BY ";
        }

        for(let i=0; i < request.orders.length; i++){

            sql+=request.orders[i].columnName+" "+request.orders[i].direction;
            if(i < request.orders.length-1){
                sql+=", ";
            }

        }

        return sql;
    }

    createDeleteSQL(request){


        let sql = "DELETE FROM "+request.tableName;

        if(request.conditions.length > 0){
            sql+=" WHERE ";
        }

        for(let i = 0; i < request.conditions.length; i++){

            if(typeof request.conditions[i][2] === "string"){

                sql+=request.conditions[i][0]+" "+request.conditions[i][1]+" '"+request.conditions[i][2]+"'";
            }else{

                sql+=request.conditions[i][0]+" "+request.conditions[i][1]+" "+request.conditions[i][2];

            }

            if(i < request.conditions.length-1){
                sql+=" AND ";
            }
        }


        return sql;
    }

    insert(tableName,fields,values){

        let sql = "INSERT INTO "+tableName+" (";
        for(let i = 0; i <fields.size; i++){
            sql+=fields[i];
            if(i < fields.size-1){
                sql+=",";
            }
        }

        sql+=")VALUES(";

        for(let i=0; i < values.size; i++){
            sql+="'"+values[i]+"'";
            if(i < values.size-1){
                sql+=",";
            }
        }
        sql+=");";

        return this.executeSQL(sql);

    }


    async executeSQL(sql, parameters){
        //console.log("Executing:"+sql);
        //console.log("parameters:"+JSON.stringify(parameters));

        let MySQLConnection = this;
        return new Promise(function (resolve,reject) {
            MySQLConnection.connection.query(sql, parameters, function (err, result) {
                if (err) {
                    console.log("Error: " + err);
                    reject(err);
                } else {
                    //console.log("Result: " + result);

                    resolve(
                        {result:result,
                            id:result.insertId,
                    });
                }
            });
        });

    }


    async tableExists(tableName) {
        let result = await this.executeSQL("SHOW TABLES LIKE '" + tableName + "'");
        return result.result.length > 0
    }

    async columnExists(tableName, columnName) {
        let result = await this.executeSQL("SHOW COLUMNS FROM " + tableName + " LIKE '"+ columnName +"'");
        return result.result.length > 0
    }

    getTableDescription(tableName,columnDescription,uniqueKeys){

        let description = "CREATE TABLE IF NOT EXISTS "+tableName+" (";
        description+="id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY";
    //    description+="user_id INT NOT NULL";
        for(let col in columnDescription){
            description+="," + columnDescription[col];
        }

        if (uniqueKeys !== undefined && uniqueKeys.length > 0) {
            for(let uniqueKey of uniqueKeys) {
                description+=","+ "UNIQUE KEY("+uniqueKey.join(",")+") "
            }
        }        
        description+=")";

        return description;


    }

    getColumnDescriptionForString(fieldname,specification){


        //Special cases of string
        if(typeof specification.format !== "undefined"){

            switch(specification.format){
                case "date-time":{
                    return fieldname+" DATETIME"+getDefaultValueOfSpecification(specification);
                }
                case "color":
                case "email": {
                    return fieldname+" VARCHAR (255)"+getDefaultValueOfSpecification(specification);
                }
                case "hostname" :
                case "ipv4":
                case "ipv6":
                case "uri":{
                   // TEXT/BLOB CANNOT HAVE A DEFAULT VALUE
                    return fieldname+" TEXT"; //+getDefaultValueOfSpecification(specification);
                }
                default:
                    throw "Format not supported:"+specification.format;

            }

        }else{

            if(typeof specification.maxLength !== "undefined"){
                return fieldname+" VARCHAR("+specification.maxLength+")"+getDefaultValueOfSpecification(specification);
            }

            // TEXT/BLOB CANNOT HAVE A DEFAULT VALUE
            return fieldname+" TEXT"; //+getDefaultValueOfSpecification(specification);

        }
    }

    getTableColumnDescriptions(tableName) {
        return "SHOW FULL columns FROM " + tableName;
    }

    getColumnDescription(tableName,columnDescription){
        let desc_sql = "ALTER TABLE " + tableName;
        desc_sql += " ADD COLUMN " + columnDescription;
        return desc_sql;
    }

    dropColumnDescription(tableName, columnName) {
        return "ALTER TABLE " + tableName + " DROP COLUMN " + columnName;
    }

    getTableColumnDefaultValue(tableName, columnName) {
        return "SELECT DEFAULT(" + columnName + ") FROM (SELECT 1) AS dummy LEFT JOIN " + tableName + " ON True LIMIT 1"
    }

    getUpdateNullValues(tableName, columnName, defaultValue, columnType) {
        let sql_value = "";
        if (columnType === "string") {
            sql_value = "'" + defaultValue + "'";
        } else if (columnType === "boolean") {
            if (defaultValue === true || defaultValue === '1' || defaultValue === 'true') {
                sql_value = 'true';
            } else {
                sql_value = 'false';
            }
        } else {
            return "";
        }
        return "UPDATE " + tableName + " SET " + columnName + " = " + sql_value + " WHERE " + columnName +
            " IS NULL"
    }

    getColumnDescriptionForNumber(fieldname,specification){
        return fieldname+" FLOAT"+getDefaultValueOfSpecification(specification);
    }

    getColumnDescriptionForInteger(fieldname,specification){
        return fieldname+" INT"+getDefaultValueOfSpecification(specification);

    }

    getColumnDescriptionForBool(fieldname,specification){
        //THERE ARE NO DEFAULT VALUES FOR BOOL
        return fieldname+" BOOLEAN";
    }

    async areColumnTypesCompatible(type1, type2) {
        let compatible = false;
        let type1_norm = type1.toLowerCase();
        let type2_norm = type2.toLowerCase();
        if (type1_norm !== type2_norm) {
            let str_types = ["string", "varchar", "text", "char", "binary", "varbinary", "tinyblob", "blob",
                "mediumblob", "longblob", "enum", "row"];
            let int_types = ["int(", "integer", "tinyint", "smallint", "mediumint", "bigint", "auto_increment"];
            let number_types = ["float", "dec", "numeric", "fixed", "double", "real"];
            let bool_types = ["boolean", "tinyint(1)", "bit"];
            let date_types = ["date", "time", "year"];
            let all_types = [str_types, int_types, number_types, bool_types, date_types];
            for (let i=0; i<all_types.length; i++) {
                compatible = all_types[i].some(x => type1_norm.startsWith(x)) &&
                    all_types[i].some(x => type2_norm.startsWith(x));
                if (compatible) {
                    break;
                }
            }
        } else {
            compatible = true;
        }
        return compatible
    }


    getFormattedValue(columnValue){

        if(columnValue.value === null || typeof columnValue.value === "undefined") {
            return "NULL";
        }

        switch(columnValue.type){
            case "boolean":{
                return columnValue.value;
            }
            case "number" : {
                return columnValue.value;
            }

            case "integer" : {
                return columnValue.value;
            }

            case "string" : {
                return "'"+columnValue.value+"'";
            }

            default : {
                return columnValue.value;
            }
        }
    }


}

let connection = null;

function getDefaultValueOfSpecification(specification) {
    if(typeof specification.default !== "undefined"){
        return ' DEFAULT "'+specification.default+'"';
    }
    return "";
}

module.exports = MysqlConnection;