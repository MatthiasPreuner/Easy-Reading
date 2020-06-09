class OutputPort {
    constructor(outputType, id, component, positionInComponent) {
        console.log(outputType);
        this.drawElements = [];
        this.outputType = outputType;
        this.id = id;
        this.component = component;
        this.positionInComponent = positionInComponent;
        this.connected = false;
        this.connectedInputPort = null;
        this.group = new Konva.Group({
            draggable: true,
            //   x: this.component.group.x() + this.positionInComponent.x,
            //  y: this.component.group.y() + this.positionInComponent.y,
            x: this.positionInComponent.x,
            y: this.positionInComponent.y,
        });
        this.radius = 30;
        this.circle = new Konva.Circle({
            radius: this.radius,
            fill: 'red',
            stroke: 'black',
            strokeWidth: 4,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: [10, 10],
            shadowOpacity: 0.2,
            cornerRadius: 10
        });

        this.connectionLine = new Konva.Line({
            points: [0, 0, 0, 0],
            stroke: 'red',
            strokeWidth: 15,
            lineCap: 'round',
            lineJoin: 'round'
        });

        this.title = new Konva.Text(
            {
                text: this.outputType.outputType.replace(/[a-z]/g, ''),
                fontSize: 30,
                fontWeight: 'bold',
                fontFamily: 'Calibri',
                fill: '#000000',
            });
        this.title.position({
            x: -this.title.width() / 2,
            y: -this.title.height() / 2,
        });

        this.group.add(this.connectionLine);
        this.group.add(this.circle);
        this.group.add(this.title);


        component.group.add(this.group);

        let outputPort = this;
        this.group.on('mousedown', function (evt) {

            outputPort.mouseDown(evt);
            /*
            if (outputPort.connected) {

                let position = erfe.util.getLocalPositionForGlobalPoint(outputPort.component.group, outputPort.group.getAbsolutePosition());
                erfe.removeConnection(outputPort.connectedInputPort, outputPort);
                outputPort.group.position(position);

            }
            component.group.moveTo(erfe.dragLayer);
            outputPort.updateLine();
            outputPort.group.startDrag();
            */


        });

        this.group.on('dragstart', function (evt) {
            outputPort.dragStart(evt);
        });

        this.group.on('dragmove', function (evt) {
            outputPort.dragMove(evt);
        });

        this.group.on('dragend', function (evt) {
            outputPort.dragEnd(evt);
        });


    }

    mouseDown(evt) {
        if (this.connected) {

            let position = erfe.util.getLocalPositionForGlobalPoint(this.component.group, this.group.getAbsolutePosition());
            erfe.removeConnection(this.connectedInputPort, this);
            this.group.position(position);

        }
        this.component.group.moveTo(erfe.dragLayer);

        this.updateLine();
        this.group.startDrag();
    }

    dragStart(evt) {
        this.currentConnectedInputPort = null;
        this.externalComponentPorts = erfe.getAllFreeInputPorts(this.component);
        for (let i = 0; i < this.externalComponentPorts.length; i++) {

            if (!erfe.util.portsAreCompatible(this, this.externalComponentPorts[i])) {
                this.externalComponentPorts[i].markAsConnectAble(false);
            }
        }

        this.component.group.moveToTop();
        erfe.componentLayer.batchDraw();
        evt.cancelBubble = true;
        console.log('dragstart');
    }

    dragMove(evt) {

        let target = evt.target;
        let targetRect = evt.target.getClientRect();

        this.updateLine();

        this.possibleConnectedInputPort = null;
        let outputPortCanBeConnected = false;
        let newConnectedPort = false;
        for (let i = 0; i < this.externalComponentPorts.length; i++) {
            if (erfe.util.portsAreCompatible(this, this.externalComponentPorts[i])) {
                if (erfe.util.getDistance(this.group.getAbsolutePosition(), this.externalComponentPorts[i].group.getAbsolutePosition()) < this.radius * 2) {

                    if (this.currentConnectedInputPort) {
                        if (this.currentConnectedInputPort !== this.externalComponentPorts[i]) {

                            this.currentConnectedInputPort.showConnectInfo(false);
                            this.currentConnectedInputPort.component.group.moveTo(erfe.componentLayer);

                            newConnectedPort = true;
                        }
                    } else {
                        newConnectedPort = true;
                    }


                    this.possibleConnectedInputPort = this.externalComponentPorts[i];
                    this.currentConnectedInputPort = this.externalComponentPorts[i];
                    outputPortCanBeConnected = true;
                    break;
                }
            }

        }

        if (outputPortCanBeConnected) {
            this.showConnectAnimation();

            if (newConnectedPort) {
                this.currentConnectedInputPort.component.group.moveTo(erfe.dragLayer);
                //TODO 
                this.currentConnectedInputPort.component.group.zIndex(0);
                this.currentConnectedInputPort.showConnectInfo(true);
                erfe.componentLayer.batchDraw();
            }

            /*
            TODO make better performance
            if(!outputPort.possibleConnectedInputPort.connectAnimationVisible){
                outputPort.possibleConnectedInputPort.showConnectInfo(true);
                erfe.componentLayer.batchDraw();
            }
            */

        } else {
            this.hideConnectAnimation();
            if (this.currentConnectedInputPort) {
                this.currentConnectedInputPort.showConnectInfo(false);
                this.currentConnectedInputPort.component.group.moveTo(erfe.componentLayer);
                erfe.componentLayer.batchDraw();
                this.currentConnectedInputPort = null;
            }
        }

        evt.cancelBubble = true;
    }

    dragEnd(evt) {
        this.group.position({
            x: this.positionInComponent.x,
            y: this.positionInComponent.y,
        });
        this.updateLine();
        for (let i = 0; i < this.externalComponentPorts.length; i++) {

            if (!erfe.util.portsAreCompatible(this, this.externalComponentPorts[i])) {
                this.externalComponentPorts[i].markAsConnectAble(true);
            }

            /*
            TODO make better performance
            else{
                outputPort.externalComponentPorts[i].showConnectInfo(false);

            }
            */
        }


        if (this.possibleConnectedInputPort) {
            erfe.createConnection(this.possibleConnectedInputPort, this);
            this.possibleConnectedInputPort.component.group.moveTo(erfe.componentLayer);

        }
        this.updateLine();
    }

    connectInputPort(inputPort) {
        this.connectedInputPort = inputPort;
        //  inputPort.connectOutputPort(this);
        this.connected = true;

        this.group.remove();
        this.group.position(this.connectedInputPort.group.position());
        this.connectedInputPort.group.parent.add(this.group);

    }

    disconnectInputPort() {
        this.connected = false;
        //   this.connectedInputPort.disconnectOutputPort();
        this.connectedInputPort = null;

        this.group.remove();
        this.group.position({
            x: this.positionInComponent.x,
            y: this.positionInComponent.y,
        });
        this.component.group.add(this.group);
        this.hideConnectAnimation();
        this.updateLine();
    }

    updateLine() {


        if (this.connected) {

            if (this.connectedInputPort) {

                let absPosition = this.component.group.getAbsolutePosition();
                absPosition.x += this.positionInComponent.x;
                absPosition.y += this.positionInComponent.y;

                let localPosition = erfe.util.getLocalPositionForGlobalPoint(this.group, absPosition);
                this.connectionLine.points([0, 0, localPosition.x, localPosition.y]);
                this.connectedInputPort.component.layer.batchDraw();
            }


        } else {
            this.connectionLine.points([0, 0, -this.group.x() + this.positionInComponent.x, -this.group.y() + this.positionInComponent.y]);
        }
        erfe.dragLayer.batchDraw();


    }

    updateComponentPosition() {

        if (this.connected) {

            this.updateLine();
        }
    }

    showConnectAnimation() {
        this.circle.fill("green");
    }

    hideConnectAnimation() {
        this.circle.fill("red");
    }

}