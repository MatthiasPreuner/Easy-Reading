let authenticationManager = {

    authentications: [],
    startUp: function () {
        let authDir = baseDirPath("components/authentication/");


        let authManager = this;

        let fs = require('fs');
        fs.readdirSync(authDir).forEach(function (authenticationDir) {


            let authenticationClassDir = authDir+"/"+authenticationDir+"/authentication";

            let authenticationClass = require(authenticationClassDir);
            let authentication = new authenticationClass();

            authManager.authentications.push({
                key: authenticationDir,
                auth: authentication,
            })
        });
    },
    
    getToken:function (key, callback) {
        for(let i=0; i < this.authentications.length; i++){

            if(this.authentications[i].key === key){
                this.authentications[i].auth.getToken(callback)
            }

        }
    }

};

module.exports = authenticationManager;


