class ExampleUIImplementation extends UserInterfaceBase {
    constructor(configuration,tabConfiguration) {
        super(configuration,tabConfiguration);
        this.currentToolId = 1;
        this.toolsContainers = [];
    }

    initUI() {
        //Initializes the UI
        let userInterface = this;
        let config = this.configuration;
        $("body").prepend('<div id="example_ui" style="background-color: '+this.configuration.backgroundColor+';"></div>');
    }


    show() {

        $("#example_ui").show();
    }

    hide() {

        $("#example_ui").hide();
    }

    getToolContainerIDForLayout(toolID,layoutConfig,order){

        //Create a container for a tool with
        let currentContainerID = "overlay-container-" + this.currentToolId;
        this.currentToolId++;

        let toolInfo = {
            toolID: toolID,
            containerID: currentContainerID,
        };

        $('#example_ui').append('<div class="example_ui_grid_item" id="'+currentContainerID+'"></div>');
        this.toolsContainers.push(toolInfo);


        return currentContainerID;
    }

    removeContainerForTool(toolID){
        for(let i=0; i < this.toolsContainers.length; i++){
            if(this.toolsContainers[i].toolID === toolID){
                $('#'+this.toolsContainers[i].containerID).remove();
                this.toolsContainers.splice(i,1);
                return;
            }
        }
    }

    remove() {
        $("#example_ui").remove();
    }
}