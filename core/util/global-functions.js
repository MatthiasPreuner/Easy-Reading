module.exports = {
    loadGlobalFunctions : function () {

        global.rootRequire = function(name) {
            return require(require("path").join(__dirname,"../../") + name);
        };

        global.baseDirPath = function(path){
            return require("path").join(require("path").join(__dirname,"../../"), path);
        };

        global.btoa = function (str) {
            return Buffer.from(str).toString('base64');

        };

        global.atob = function (str) {

            return new Buffer.from(str, 'base64').toString();

        }
    }
};