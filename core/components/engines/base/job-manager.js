class JobManager{
    constructor(customFunction,){

        this.customFunction = customFunction;
        this.startConnections = customFunction.startConnections.slice();
        this.endConnections = customFunction.endConnections.slice();
        this.unfinishedJobs = [];
        this.jobsInProgress = [];
        this.finishedJobs = [];

    }

    createJobs(){
        this.unfinishedJobs = [];
        for(let i = 0; i < this.customFunction.jobs.length; i++){
            this.unfinishedJobs.push({
                input: null,
                job: this.customFunction.jobs[i],
                started: false,
            });
        }
    }


    executeJobs(callback, input, profile,constants){
        this.callback = callback;
        this.input = input;
        this.profile = profile;
        this.constants = constants;

        this.createJobs();
        //start connections should usually be just 1 anyway...
        for(let i=0; i < this.startConnections.length; i++){

            for(let j = this.unfinishedJobs.length -1; j >= 0 ; j--){
                if(this.unfinishedJobs[j].job.functionID === this.startConnections[i].functionID){
                    this.unfinishedJobs[j].input = {
                        input: input,
                        history: [],
                    };
                    this.jobsInProgress.push(this.unfinishedJobs[j]);
                    this.unfinishedJobs.splice(j, 1);
                }
            }
        }

        this.startJobs();
    }

    startJobs(){
        for(let i=0; i < this.jobsInProgress.length; i++){

            if(!this.jobsInProgress[i].started){
                this.jobsInProgress[i].job.started = true;
                this.jobsInProgress[i].job.executeJob(this,this.jobsInProgress[i].input.input,this.profile,this.constants );
            }
        }
    }

    jobFinished(result,job){

        if(result.name === "Error" || result.name === "NoResult"){
            console.log("Error or no result");
            this.callback(result);
            return;
        }

         for(let i=0; i <this.jobsInProgress.length; i++){

            if(this.jobsInProgress[i].job === job){
                this.finishedJobs.push(this.jobsInProgress[i]);
                this.jobsInProgress.splice(i, 1);
                break;
            }
        }



        for(let i=0 ; i < job.inputs.length; i++){
            for(let j=0; j <this.unfinishedJobs.length; j++){

                if(job.inputs[i].functionID === this.unfinishedJobs[j].job.functionID){

                    if(!result.history){
                        this.unfinishedJobs[j].input = {
                            input: result,
                            history: {
                                "job": job.id,
                                "result": result
                            }
                        }
                    }else{
                        result.history.push({
                            "job": job.id,
                            "result": result
                        });
                        this.unfinishedJobs[j].input = {
                            input: result,
                            history: result.history
                        }
                    }
                  //  this.unfinishedJobs[j].input = result.result;

                    this.jobsInProgress.push(this.unfinishedJobs[j]);
                    this.unfinishedJobs.splice(j, 1);
                    break;
                }

            }
        }




        if(this.jobsInProgress.length > 0){
            this.startJobs();

        }else{

            for(let i=0; i < this.endConnections.length; i++) {

                if(this.endConnections[i].functionID === job.functionID ){

                    console.log("finished");
                    this.callback(result);
                }
            }

        }






    }


}

module.exports = JobManager;