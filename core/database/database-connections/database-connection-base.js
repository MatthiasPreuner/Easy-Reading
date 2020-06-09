class DatabaseConnectionBase {
    constructor(){

    }

    async init(callback) {


    }

    async executeSQL(sql, parameters) {

    }

    async tableExists(tableName) {

    }

    async columnExists(tableName, columnName) {

    }

    getTableColumnDescriptions(tableName) {

    }


    getTableDescription(tableName,fields, uniqueKeys) {

    }

    getColumnDescription(tableName,columnDescription,uniqueKeys) {

    }

    dropColumnDescription(tableName, columnName) {

    }

    getTableColumnDefaultValue(tableName, columnName) {

    }

    getUpdateNullValues(tableName, columnName, defaultValue, columnType) {

    }

    createInsertSQL(request) {

    }

    createInsertOrUpdateSQL(request){

    }


    createUpdateSQL(request) {

    }
    createSelectSQL(request) {

    }

    createDeleteSQL(request) {

    }

    getColumnDescriptionForString(fieldname,specification){


        //Special cases of string
        if(typeof specification.format !== "undefined"){

            switch(specification.format){
                case "date-time":{
                    return fieldname+" DATETIME"+getDefaultValueOfSpecification(specification);
                }
                case "email": {
                    return fieldname+" VARCHAR (255)"+getDefaultValueOfSpecification(specification);
                }
                case "hostname" :
                case "ipv4":
                case "ipv6":
                case "uri":{
                    return fieldname+" TEXT"+getDefaultValueOfSpecification(specification);
                }
                default:
                    throw "Format not supported:"+specification.format;

            }

        }else{

            return fieldname+" TEXT"+getDefaultValueOfSpecification(specification);

        }
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

    }

    getFormattedValue(columnValues){

    }



}




let connection = null;



module.exports = DatabaseConnectionBase;