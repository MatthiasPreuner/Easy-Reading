class Job {
    constructor(functionID, engineFunction, connections, configuration) {

        this.functionID = functionID;
        this.engineFunction = engineFunction;
        this.configuration = configuration;
        this.inputs = connections.inputs;
        this.outputs = connections.outputs;
    }

    executeJob(jobManager,input,profile,constants ) {

        let requestFinished = false;

        let ioTypes = require("../../../IOtypes/iotypes");
        let timeout = setTimeout(function () {
            timeout = null;
            jobManager.jobFinished(new ioTypes.IOTypes.Error("Timeout"), this);
        }, 10000);


        let job = this;

        this.engineFunction.engine[this.engineFunction.entryPoint](
            function (result) {

                if (timeout) {
                    console.log("Clearing timeout");
                    clearTimeout(timeout);

                    jobManager.jobFinished(result, job);
                }



            }
        , input, this.configuration,profile,constants);

        console.log("Executing..."+this.engineFunction.engine.id);


    }


}

module.exports = Job;