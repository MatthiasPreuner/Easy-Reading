let helperFunctions = {

    //Not tested
    isExternalUrl:function (url,location) {
        let match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
        if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== locationl) {

            return true;
        }

        if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":("+{"http:":80,"https:":443}[location]+")?$"), "") !== location) {
            return true;

        }

        return false;
    },

    isUrlAbsolute:function(url) {
        return url.indexOf('//') === 0 ? true : url.indexOf('://') === -1 ? false : url.indexOf('.') === -1 ? false : url.indexOf('/') === -1 ? false : url.indexOf(':') > url.indexOf('/') ? false : url.indexOf('://') < url.indexOf('.') ? true : false;
    },
    
    arrayInArray: function (needle, haystack) {
        let in_array = false;
        for (let i=0; i<haystack.length; i++) {
            let elem = haystack[i];
            if (elem === needle) {
                in_array = true;
            } else if (elem.length === needle.length) {
                in_array = true;
                for (let j=0; j<elem.length; j++) {
                    if (elem[j] !== needle[j]) {
                        in_array = false;
                        break;
                    }
                }
            }
            if (in_array) {
                break;
            }
        }
        return in_array;
    }

};

module.exports = helperFunctions;

