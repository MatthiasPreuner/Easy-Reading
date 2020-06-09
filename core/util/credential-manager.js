const fs = require('fs');
const path = require('path');


let credentialManager = {
    init:function (pathToEnvFile) {

        this.keys ={};

        if(!pathToEnvFile){
            let userHome = require('user-home');

            pathToEnvFile = userHome+"/.easy-reading/credentials";

        }

        try {
            // specifying an encoding returns a string instead of a buffer
            this.keys = parse(fs.readFileSync(pathToEnvFile));

        } catch (e) {
            return { error: e }
        }



    },

    hasKey:function (key) {

        if (process.env[key]) {
            return true;
        }
        return typeof this.keys[key] !== 'undefined';

    },

    getValueForKey:function (key) {

        if (process.env[key]) {
            return process.env[key];
        }

        if(this.hasKey(key)){
            return this.keys[key];
        }
    }

};


/*
 * Parses a string or buffer into an object
 * @param {(string|Buffer)} src - source to be parsed
 * @returns {Object} keys and values from src
*/
function parse (src) {
    const obj = {};

    // convert Buffers before splitting into lines and processing
    src.toString().split('\n').forEach(function (line) {
        // matching "KEY' and 'VAL' in 'KEY=VAL'
        const keyValueArr = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
        // matched?
        if (keyValueArr !== null) {
            const key = keyValueArr[1]

            // default undefined or missing values to empty string
            let value = keyValueArr[2] || ''

            // expand newlines in quoted values
            const len = value ? value.length : 0
            if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
                value = value.replace(/\\n/gm, '\n')
            }

            // remove any surrounding quotes and extra spaces
            value = value.replace(/(^['"]|['"]$)/g, '').trim()

            obj[key] = value
        }
    });

    return obj
}

module.exports = credentialManager;