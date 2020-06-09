let DatabaseConnectionBase =  require("./database-connection-base");

class PostrgreSQLConnection extends DatabaseConnectionBase{
    constructor(){
        super();
    }


    async init(configuration){

        return new Promise(function (resolve,reject) {


            let mysql = require('mysql');

            connection = mysql.createConnection({
                host: "localhost",
                user: "root",
                password: "",
                database: "easyreading"
            });

            connection.connect(function (err) {
                if (err) throw err;

                console.log("connected");
                resolve(true);
            });

        });


    }

    async executeSQL(sql, parameters){
        return new Promise(function (resolve,reject) {
            connection.query(sql, parameters, function (err, result) {
                if (err) throw err;
                resolve(result);
                console.log("Result: " + result);
            });
        });

    }




    getTableDescription(tableName,columnDescription,uniqueKeys){

        let description = "CREATE TABLE IF NOT EXISTS "+tableName+" (";
        description+="id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,";
        description+="user_id INT NOT NULL";
        for(let col in columnDescription){
            description+=","+columnDescription[col];
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

            // TEXT/BLOB CANNOT HAVE A DEFAULT VALUE
            return fieldname+" TEXT"; //+getDefaultValueOfSpecification(specification);

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

}

let connection = null;

function getDefaultValueOfSpecification(specification) {
    if(typeof specification.default !== "undefined"){
        return ' DEFAULT "'+specification.default+'"';
    }
    return "";
}

module.exports = PostrgreSQLConnection;