let erfe = {
    screenConstants: {
        stageWidth: 3000,
        stageHeight: 2000,
    },
    currentFunctions: [],
    functionConnections: [],
    currentFunctionID: 1,
    init: function () {
        this.functions = engineFunctions;
        this.commonFunction = commonFunctions;

        erMenu.init(this.functions);
        componentConfigContainer.init();

        $("#large-container").css("width", erfe.screenConstants.stageWidth);
        $("#large-container").css("height", erfe.screenConstants.stageHeight);

        this.stage = new Konva.Stage({
            container: 'container',
            width: window.innerWidth,
            height: window.innerHeight
        });

        this.componentLayer = new Konva.Layer();
        this.stage.add(this.componentLayer);
        this.dragLayer = new Konva.Layer();
        this.stage.add(this.dragLayer);

        this.initResize();
        this.initScroll();

        this.insertFunction(input, {x: 100, y: 100});
        this.insertFunction(output, {x: 600, y: 100});
        this.stage.on('click', function (e) {
            erfe.hideAllFocus();
            erfe.stage.batchDraw();
        });

        this.stage.getContainer().style.backgroundColor = "#c1d5ff";

        let functionToLoad = $("#customFunctionToLoad").data("functiondata");

        if (functionToLoad){
            $("#function-title").val(functionToLoad.title);
            $("#function-description").val(functionToLoad.description);
            $("#erfeFunctionId").val(functionToLoad.id);

            let functionInfo = JSON.parse(functionToLoad.function_code);

            erfe.loadJson(functionInfo);
        }
    },
    initResize: function () {
        let scrollContainer = document.getElementById('scroll-container');
        scrollContainer.addEventListener('scroll', function () {
            let dx = scrollContainer.scrollLeft;
            let dy = scrollContainer.scrollTop;
            erfe.stage.container().style.transform =
                'translate(' + dx + 'px, ' + dy + 'px)';
            erfe.stage.x(-dx);
            erfe.stage.y(-dy);
            erfe.stage.batchDraw();
        });

    },
    initScroll: function () {
        let fitStageIntoParentContainerFunction = function () {
            let container = document.querySelector('#stage-parent');

            // now we need to fit stage into parent
            let containerWidth = container.offsetWidth;
            // to do this we need to scale the stage
            let scale = containerWidth / window.innerWidth;

            erfe.stage.width(window.innerWidth * scale);
            erfe.stage.height(window.innerHeight * scale);
            erfe.stage.scale({x: scale, y: scale});
            erfe.stage.batchDraw();
        };

        fitStageIntoParentContainerFunction();
        // adapt the stage on any window resize
        window.addEventListener('resize', fitStageIntoParentContainerFunction);
    },
    getAllInputPorts: function (excludedComponent) {

        let allInputPorts = [];

        for (let i = 0; i < this.currentFunctions.length; i++) {
            if (excludedComponent) {


                if (excludedComponent === this.currentFunctions[i]) {
                    continue;
                }
            }

            for (let k = 0; k < this.currentFunctions[i].inputPorts.length; k++) {
                allInputPorts.push(this.currentFunctions[i].inputPorts[k]);
            }
        }

        return allInputPorts;
    },

    getAllFreeInputPorts: function (exludedComponent) {
        let allInputPorts = erfe.getAllInputPorts(exludedComponent);
        let allFreeInputPorts = [];
        for (let i = 0; i < allInputPorts.length; i++) {
            if (!allInputPorts[i].connected) {

                allFreeInputPorts.push(allInputPorts[i]);
            }
        }

        return allFreeInputPorts;

    },


    getAllOutputPorts: function (excludedComponent) {

        let allOutputPorts = [];

        for (let i = 0; i < this.currentFunctions.length; i++) {
            if (excludedComponent) {

                console.log(excludedComponent.group._id, this.currentFunctions[i].group._id);
                if (excludedComponent === this.currentFunctions[i]) {
                    continue;
                }
            }

            for (let k = 0; k < this.currentFunctions[i].outputPorts.length; k++) {

                allOutputPorts.push(this.currentFunctions[i].outputPorts[k]);

            }
        }

        return allOutputPorts;
    },

    configElement: function (element) {

        if (element.constructor.name === "FunctionContainer") {

            componentConfigContainer.showConfigForFunction(element);
        } else {


            componentConfigContainer.showConfigForPort(element);
        }

        for (let i = 0; i < this.currentFunctions.length; i++) {
            if (this.currentFunctions[i] === element) {
                this.currentFunctions[i].showFocus();

            } else {

                this.currentFunctions[i].hideFocus();
            }
        }

        console.log("conf");
        erfe.stage.batchDraw();
        erfe.componentLayer.batchDraw();
        erfe.dragLayer.batchDraw();


    },

    addFunction: function (func) {
        this.currentFunctions.push(func);
        this.componentLayer.draw();
        this.dragLayer.draw();
    },

    removeFunction: function (func) {

        for (let i = 0; i < this.currentFunctions.length; i++) {
            if (func === this.currentFunctions[i]) {
                this.currentFunctions.splice(i, 1);
                break;
            }

        }
        erfe.stage.batchDraw();
    },

    executeCommand: function (commandName) {

        if (commandName === "save") {

            let erfeJson = erfe.toJson();

            let title = $("#function-title").val();
            if(!title){
                title = "some title";
            }

            let description = $("#function-description").val();
            if(!description){
                description = "some description";
            }
            let completeJSON =  {
                json: erfeJson,
                title: title,
                description: description,
            };

            $('#erfeSubmit').val(JSON.stringify({
                type: "functionSubmit",
                functionCode: completeJSON,
            }));
            $("#submit").submit();
        } else if (commandName === "new") {
            $('#erfeSubmit').val(JSON.stringify({
                type: "command",
                command: "new"
            }));
            $("#submit").submit();

        }else if(commandName === "exit"){
            $('#erfeSubmit').val(JSON.stringify({
                type: "command",
                command: "exit"
            }));
            $("#submit").submit();
        }
        console.log("Executing command:" + commandName);
    },

    insertFunctionByJSON: function (json) {
        if(json.functionInfo.type === "staticFunction"){
            erfe.insertFunctionByID(json.functionInfo.functionID, json.position, json.id);
        }else{
            erfe.insertFunctionWithInformation(json.functionInfo,json.position, json.id)
        }
        console.log(json);

    },

    insertFunctionWithInformation(functionInformation, pos, id) {
        let func = erfe.util.getFunctionByInfo(functionInformation);
        erfe.insertFunction(func, pos, id);
    },
    insertFunctionByID: function (functionID, pos, id) {
        let func = erfe.util.getFunctionByID(functionID);

        erfe.insertFunction(func, pos, id);
    },

    insertFunction: function (func, pos, id) {

        if (!pos) {
            pos = {
                x: erfe.stage.x() * -1 + erfe.stage.width() / 4,
                y: erfe.stage.y() * -1 + erfe.stage.height() / 4,
            };

        }

        if (!id) {
            id = erfe.currentFunctionID;
            erfe.currentFunctionID++;
        }

        let functionContainer = new FunctionContainer(func, id, erfe.componentLayer, pos);
        this.addFunction(functionContainer);
    },

    hideAllFocus: function () {
        for (let i = 0; i < this.currentFunctions.length; i++) {
            this.currentFunctions[i].hideFocus();
        }
    },

    createConnection: function (inputPort, outputPort) {
        let newConnection = new FunctionConnection(inputPort, outputPort);
        this.functionConnections.push(newConnection);
    },

    removeConnection: function (inputPort, outputPort) {

        let index = -1;
        index = erfe.util.getIndexOfFunctionConnection(inputPort, outputPort);

        if (index !== -1) {
            erfe.functionConnections[index].remove();

            erfe.functionConnections.splice(index, 1);
        }
    },

    toJson: function () {

        let functionJSON = [];
        for (let i = 0; i < erfe.currentFunctions.length; i++) {

            functionJSON.push(erfe.currentFunctions[i].toJSON());

        }


        let connectionJSON = [];
        for (let i = 0; i < erfe.functionConnections.length; i++) {

            connectionJSON.push(erfe.functionConnections[i].toJson());
        }


        console.log(JSON.stringify({
            functions: functionJSON,
            connections: connectionJSON,
        }));

        return{
            functions: functionJSON,
            connections: connectionJSON,
        };

    },

    loadJson: function (configuration) {
        erfe.clear();




        let maxFunctionId = 0;
        for (let i = 0; i < configuration.functions.length; i++) {
            erfe.insertFunctionByJSON(configuration.functions[i]);
            if(maxFunctionId < configuration.functions[i].id){
                maxFunctionId = configuration.functions[i].id;
            }
        }
        this.currentFunctionID = maxFunctionId+1;



        for (let i = 0; i < configuration.connections.length; i++) {

            let inputPort = erfe.getFunctionWithID(configuration.connections[i].inputPort.functionID).getInputPortWithID(configuration.connections[i].inputPort.portID);
            let outputPort = erfe.getFunctionWithID(configuration.connections[i].outputPort.functionID).getOutputPortWithID(configuration.connections[i].outputPort.portID);

            erfe.createConnection(inputPort, outputPort);
        }


        erfe.componentLayer.draw();
        erfe.dragLayer.draw();
        erfe.stage.draw();

    },

    clear: function () {

        for (let i = erfe.currentFunctions.length - 1; i >= 0; i--) {
            erfe.currentFunctions[i].remove();
        }

        erfe.stage.draw();


    },

    getFunctionWithID: function (id) {
        for (let i = 0; i < erfe.currentFunctions.length; i++) {
            if (erfe.currentFunctions[i].id === id) {
                return erfe.currentFunctions[i];
            }
        }
    },


    util: {
        getDistance: function (point1, point2) {

            return Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2));
        },

        getLocalPositionForGlobalPoint: function (element, point) {

            let global = element.getAbsolutePosition();
            return {
                x: point.x - global.x,
                y: point.y - global.y,
            };

        },

        getFunctionByID: function (id) {
            for (let i = 0; i < erfe.functions.length; i++) {
                if (erfe.functions[i].id === id) {
                    return erfe.functions[i];
                }
            }
            for (let i = 0; i < erfe.commonFunction.length; i++) {
                if (erfe.commonFunction[i].id === id) {
                    return erfe.commonFunction[i];
                }
            }


        },

        getFunctionByInfo(functionInfo) {

            for (let i = 0; i < erfe.functions.length; i++) {
                if (erfe.functions[i].engine === functionInfo.engineID) {

                    for (let j = 0; j < erfe.functions[i].versions.length; j++) {

                        if (erfe.functions[i].versions[j].version === functionInfo.version) {

                            for (let k = 0; k < erfe.functions[i].versions[j].functions.length; k++) {


                                if (erfe.functions[i].versions[j].functions[k].id === functionInfo.functionID) {
                                    return erfe.functions[i].versions[j].functions[k];
                                }

                            }

                        }

                    }
                }

            }
        },

        getFunctionInfoForFunction(func) {
            for (let i = 0; i < erfe.functions.length; i++) {
                for (let j = 0; j < erfe.functions[i].versions.length; j++) {
                    for (let k = 0; k < erfe.functions[i].versions[j].functions.length; k++) {
                        let test = erfe.functions[i].versions[j].functions[k];
                        if (erfe.functions[i].versions[j].functions[k] === func) {


                            return {
                                type: "engineFunction",
                                engineID: erfe.functions[i].engine,
                                version: erfe.functions[i].versions[j].version,
                                functionID: erfe.functions[i].versions[j].functions[k].id,

                            };

                        }

                    }

                }

            }

            return {
                type: "staticFunction",
                functionID: func.id,

            }
        },

        portsAreCompatible: function (outputPort, inputPort) {

            if (outputPort.outputType.outputType === "ALL" || inputPort.inputType.inputType === "ALL") {
                return true;
            }

            return outputPort.outputType.outputType === inputPort.inputType.inputType;
        },
        getIndexOfFunctionConnection: function (inputPort, outputPort) {

            for (let i = 0; i < erfe.functionConnections.length; i++) {
                if (erfe.functionConnections[i].inputPort === inputPort && erfe.functionConnections[i].outputPort === outputPort) {
                    return i;
                }
            }
        }
    }
};







