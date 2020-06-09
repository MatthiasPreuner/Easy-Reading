class FunctionConnection{
    constructor(inputPort, outputPort){
        this.inputPort = inputPort;
        this.outputPort = outputPort;

        this.inputPort.connectOutputPort(this.outputPort);
        this.inputPort.functionConnection = this;
        this.outputPort.connectInputPort(this.inputPort);
        this.outputPort.functionConnection = this;
        this.outputPort.updateLine();


    }


    remove(){

        this.outputPort.disconnectInputPort();
        this.outputPort.functionConnection = null;
        this.inputPort.disconnectOutputPort();
        this.inputPort.functionConnection = null;
    }


    toJson(){

        return {
            inputPort: {
                functionID: this.inputPort.component.id,
                portID: this.inputPort.id,

            },
            outputPort:{
              functionID: this.outputPort.component.id,
              portID: this.outputPort.id,
            }
        }

    }




}