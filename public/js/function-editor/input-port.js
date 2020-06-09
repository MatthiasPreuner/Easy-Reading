

class InputPort {
    constructor(inputType, id, component, positionInComponent) {

        this.drawElements = [];
        this.inputType = inputType;
        this.id = id;
        this.component = component;
        this.positionInComponent = positionInComponent;
        this.connectAnimationVisible = false;

        this.group = new Konva.Group({
            x: this.positionInComponent.x,
            y: this.positionInComponent.y,
        });
        this.connected = false;
        this.connectedInputPort = null;
        this.radius = 30;
        this.circle = new Konva.Circle({
            radius: this.radius,
            fill: 'yellow',
            stroke: 'black',
            strokeWidth: 4,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: [10, 10],
            shadowOpacity: 0.2,
            cornerRadius: 10,
        });

        this.title = new Konva.Text(
            {
                text: this.inputType.inputType.replace(/[a-z]/g, ''),
                fontSize: 30,
                fontWeight: 'bold',
                fontFamily: 'Calibri',
                fill: '#000000',
            });
        this.title.position({
            x:-this.title.width()/2,
            y:-this.title.height()/2,
        });

        this.group.add(this.circle);
        this.group.add(this.title);

        component.group.add(this.group);

        let inputPort = this;
        this.group.on('click', function(event) {
            if(!inputPort.connected){
                event.cancelBubble = true;
                erfe.configElement(inputPort);
            }

        });
    }

    connectOutputPort(outputPort){
        this.connected = true;
        this.connectedOutputPort = outputPort;
    }

    disconnectOutputPort(){
        this.connected = false;
        this.connectedOutputPort = null;
        this.showConnectInfo(false);
    }

    updateComponentPosition() {

        if(this.connected){
            this.connectedOutputPort.updateLine();
        }

    }


    showConnectInfo(canConnect) {
        if (canConnect) {
            this.circle.fill("green");
            this.connectAnimationVisible = true;
        } else {
            this.connectAnimationVisible = false;
            this.circle.fill("yellow");
        }
    }

    markAsConnectAble(isConnectAble){
        if(isConnectAble){

            //this.group.opacity(1);
            this.group.scale({ x: 1, y: 1 });
          //  this.group.show();


        }else{

            this.group.scale({ x: 0.5, y: 0.5 });
           // this.group.opacity(0.3);
          //  this.circle.opacity(0.4);
        //    this.group.hide();
        }
    }

    /*
    moveToDragRegion(moveToDragRegion){
        console.log("Move to   "+moveToDragRegion);
        if(moveToDragRegion){
            this.group.position(this.group.getAbsolutePosition());
            this.group.moveTo(erfe.dragLayer);
        }else{
            this.group.position(this.positionInComponent);
            this.group.moveTo(this.component.group);
        }

    }*/


}
