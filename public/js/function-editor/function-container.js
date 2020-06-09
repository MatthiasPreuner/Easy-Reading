class FunctionContainer {
    constructor(functionInfo, id, layer, position) {
        this.id = id;
        this.functionInfo = functionInfo;
        this.layer = layer;
        this.focusVisible = false;
        this.drawElements = [];
        this.inputPortIDCount = 0;
        this.inputPorts = [];
        this.outputPortIDCount = 0;
        this.outputPorts = [];

        this.containerConstants = {
            width: 300,
            height: 400,
            titleMargin: 20,
            titleFontSeize: 30,
            titleContainerHeight: 0,
            portSize: 60,
            configFrameGap: 40,
        };


        this.createComponent(position);
        if(!functionInfo.required){
            this.createDeleteButton();
        }
        this.createInputPorts();
        this.createOutputPorts();

        this.initListeners();

    }

    createComponent(position) {

        this.title = new Konva.Text(
            {
                text: this.functionInfo.name,
                fontSize: this.containerConstants.titleFontSeize,
                fontWeight: 'bold',
                fontFamily: 'Calibri',
                fill: '#000000',
            });


        if (this.title.width() > this.containerConstants.width - this.containerConstants.titleMargin) {
            this.containerConstants.width = this.title.width() + this.containerConstants.titleMargin;

        }
        this.containerConstants.titleContainerHeight = this.title.height() * 2;

        if (this.functionInfo.inputTypes.length > this.functionInfo.outputTypes.length) {
            this.containerConstants.height = this.containerConstants.titleContainerHeight + this.functionInfo.inputTypes.length * this.containerConstants.portSize * 1.5+this.containerConstants.portSize/2;
        } else {
            this.containerConstants.height = this.containerConstants.titleContainerHeight + this.functionInfo.outputTypes.length * this.containerConstants.portSize * 1.5+this.containerConstants.portSize/2;
        }


        this.title.position({
                x: this.containerConstants.width / 2,
                y: this.containerConstants.titleContainerHeight / 2,
            }
        );
        this.title.offset({
            x: this.title.width() / 2,
            y: this.title.height() / 2,
        });

        this.titleRect = new Konva.Rect({
            stroke: '#555',
            strokeWidth: 5,
            fill: '#7a7a7a',
            width: this.containerConstants.width,
            height: this.containerConstants.titleContainerHeight,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: [10, 10],
            shadowOpacity: 0.2,
            cornerRadius: 10
        });

        this.group = new Konva.Group({
            x: position.x,
            y: position.y,
            draggable: true,
        });

        this.backgroundRect = new Konva.Rect({
            stroke: '#555',
            strokeWidth: 5,
            fill: '#ddd',
            width: this.containerConstants.width,
            height: this.containerConstants.height,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: [10, 10],
            shadowOpacity: 0.2,
            cornerRadius: 10
        });




        this.group.add(this.backgroundRect);
        this.group.add(this.titleRect);

        this.group.add(this.title);
        this.layer.add(this.group);


    }

    createInputPorts() {
        for (let i = 0; i < this.functionInfo.inputTypes.length; i++) {

            let currentInputPort = new InputPort(this.functionInfo.inputTypes[i], this.inputPortIDCount, this, {
                x: 0,
                y: this.containerConstants.titleContainerHeight + (i*1.5+1) * this.containerConstants.portSize,
            });
            this.inputPortIDCount++;
            this.inputPorts.push(currentInputPort);
            //  this.group.add(currentInputPort.group);
        }


    }

    createOutputPorts() {
        for (let i = 0; i < this.functionInfo.outputTypes.length; i++) {

            let currentOutputPort = new OutputPort(this.functionInfo.outputTypes[i],this.outputPortIDCount, this, {
                x: this.containerConstants.width,
                y: this.containerConstants.titleContainerHeight + (i + 1) * this.containerConstants.portSize,
            });
            this.outputPortIDCount++;
            this.outputPorts.push(currentOutputPort);
            //     this.group.add(currentInputPort.group);
        }
    }

    createDeleteButton(){

        this.deleteButtonGroup = new Konva.Group({
            x: this.containerConstants.width,
        });

        this.deleteCircle = new Konva.Circle({
            radius: this.containerConstants.portSize/3,
            fill: 'white',
            stroke: 'black',
            strokeWidth: 4,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: [10, 10],
            shadowOpacity: 0.2,
            cornerRadius: 10
        });

        this.deleteCircleLine1 = new Konva.Line({
            points: [-this.containerConstants.portSize/7, -this.containerConstants.portSize/7, this.containerConstants.portSize/7, this.containerConstants.portSize/7],
            stroke: 'black',
            strokeWidth: 4,
            lineCap: 'round',
            lineJoin: 'round'
        });

        this.deleteCircleLine2 = new Konva.Line({
            points: [this.containerConstants.portSize/7, -this.containerConstants.portSize/7, -this.containerConstants.portSize/7, this.containerConstants.portSize/7],
            stroke: 'black',
            strokeWidth: 4,
            lineCap: 'round',
            lineJoin: 'round'
        });
        this.deleteButtonGroup.add(this.deleteCircle);
        this.deleteButtonGroup.add(this.deleteCircleLine1);
        this.deleteButtonGroup.add(this.deleteCircleLine2);
        this.group.add(this.deleteButtonGroup);
    }

    initListeners() {
        let component = this;
        if(this.deleteButtonGroup){
            this.deleteButtonGroup.on('click',function (e) {
                e.cancelBubble = true;
                console.log("deleting");
                component.remove();

            });
        }

        this.group.on('dragstart', function(evt) {

            component.group.moveTo(erfe.dragLayer);
            erfe.componentLayer.batchDraw();

            // component.group.startDrag();
        });
        /*
        this.group.on('dragstart', function () {

            component.group.moveToTop();
            erfe.componentLayer.draw();
            console.log('dragstart');
        });*/
        this.group.on('dragmove', function (e) {


            for (let i = 0; i < component.inputPorts.length; i++) {
                component.inputPorts[i].updateComponentPosition();
            }

            for (let i = 0; i < component.outputPorts.length; i++) {
                component.outputPorts[i].updateComponentPosition();
            }

        });

        this.group.on('dragend',function () {

            component.group.moveTo(erfe.componentLayer);
            erfe.componentLayer.batchDraw();
        });

        this.group.on('click', function(e) {

            //If not cancelled stage will get the click and remove focus
            e.cancelBubble = true;
            erfe.configElement(component);

        });


    }

    remove(){

        for (let i = 0; i < this.outputPorts.length; i++) {
            if(this.outputPorts[i].connected){

                erfe.removeConnection(this.outputPorts[i].connectedInputPort,this.outputPorts[i]);

            }
        }

        for (let i = 0; i < this.inputPorts.length; i++) {
            if(this.inputPorts[i].connected){
                erfe.removeConnection(this.inputPorts[i],this.inputPorts[i].connectedOutputPort);
            }

        }



        this.group.remove();

        erfe.removeFunction(this);


    }

    showFocus(){
        console.log("show focus");
        if(!this.focusVisible){

            this.focusGroup = new Konva.Group();
            this.group.add(this.focusGroup);
            let blueLine = new Konva.Line({
                points: [
                    -this.containerConstants.configFrameGap, -this.containerConstants.configFrameGap,
                    this.containerConstants.width+this.containerConstants.configFrameGap, -this.containerConstants.configFrameGap,
                    this.containerConstants.width+this.containerConstants.configFrameGap, this.containerConstants.height+this.containerConstants.configFrameGap,
                    -this.containerConstants.configFrameGap, this.containerConstants.height+this.containerConstants.configFrameGap,
                    -this.containerConstants.configFrameGap, -this.containerConstants.configFrameGap,
                ],
                stroke: 'blue',
                strokeWidth: 10,
                lineCap: 'round',
                lineJoin: 'round',
                /*
                 * line segments with a length of 29px with a gap
                 * of 20px followed by a line segment of 0.001px (a dot)
                 * followed by a gap of 20px
                 */
                //    dash: [29, 20, 0.001, 20]
            });

            this.focusGroup.add(blueLine);
            this.group.add(this.focusGroup);

            this.focusVisible = true;
        }
    }

    hideFocus(){

        if(this.focusVisible){


            this.focusVisible = false;
            this.focusGroup.remove();
            this.focusGroup = null;
        }

    }

    toJSON(){

        return {
            id: this.id,
            functionInfo: erfe.util.getFunctionInfoForFunction(this.functionInfo),
            position: this.group.position(),
        }
    }

    getOutputPortWithID(id){
        for(let i=0; i < this.outputPorts.length; i++){
            if(this.outputPorts[i].id === id){
                return this.outputPorts[i];
            }
        }
    }

    getInputPortWithID(id){
        for(let i=0; i < this.inputPorts.length; i++){
            if(this.inputPorts[i].id === id){
                return this.inputPorts[i];
            }
        }
    }

}
