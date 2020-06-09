function validateConfiguration(combinedFunction) {

    try{

        //Must have a minimum of 3 to be valid
        if(combinedFunction.functions.length < 3){
            return false;
        }

        //Must have a minimum of 4 to be valid
        if(combinedFunction.connections.length < 2){
            return false;
        }


        const connections = [...combinedFunction.connections];


        let startFunction = combinedFunction.functions[0];
        let endFunction = combinedFunction.functions[1];


        let endFound = false;
        let nextFunction = startFunction;
        while(nextFunction = findNextConnection(nextFunction,combinedFunction.functions,connections)){


            if(nextFunction === endFunction){
                endFound = true;
                break;
            }


        }

        if(!endFound){
            return false;
        }






        return true;

    }catch (exception){
        return false;
    }



}

function findNextConnection(func,functions, connections){

    for(let i=0; i < connections.length; i++){

        if(connections[i].outputPort.functionID === func.id){

            for(let j=0; j<functions.length; j++){

                if(functions[j].id === connections[i].inputPort.functionID){

                    return functions[j];
                }
            }
        }

    }

}

module.exports.validateConfiguration = validateConfiguration;

function isEquivalent(a, b,bCoversA=false) {
    // Create arrays of property names
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);


    if(!bCoversA){
        // If number of properties is different,
        // objects are not equivalent
        if (aProps.length !== bProps.length) {
            return false;
        }

    }

    for (let i = 0; i < aProps.length; i++) {
        let propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

