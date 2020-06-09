class HoverButton extends WidgetBase {

    constructor(functionInfo, userInterface, targetID, configuration) {
        super(functionInfo, userInterface, targetID, configuration);

        this.active = false;
        this.timeout = null;
        this.outputTypeClass = null;
        this.requestInProgress = false;
        this.widgetID = 'er_single_choice_button_' + this.widgetID;
        $("#" + targetID).append("<button id='" + this.widgetID + "' class='easy-reading-hover easy-reading-button'><img src='" + functionInfo.source.defaultIconURL + "' title='" + functionInfo.source.name + ": " + functionInfo.source.description + "'> </button>");

        this.enable();
        globalEventListener.addWidgetActivatedListeners(this);
    }


    enable() {
        $("#" + this.widgetID).on("click", this, this.onWidgetClicked);

    }

    disable() {
        $("#" + this.widgetID).off("click", this, this.onWidgetClicked);
        globalEventListener.removeWidgetActivatedListeners(this);

    }

    activateWidget() {
        $("#" + this.widgetID).addClass("er-button-active");
        globalEventListener.addMouseMoveListener(this);
        globalEventListener.widgetActivated(this);
        this.clearTimeout();
        this.active = true;

    }

    deactivateWidget(manual = true) {
        super.deactivateWidget(manual);
        $("#" + this.widgetID).removeClass("er-button-active");

        globalEventListener.removeMouseMoveListener(this);
        this.active = false;
        this.clearTimeout();
    }

    onWidgetClicked(e) {
        if (e.data.active) {
            e.data.deactivateWidget(true);
        } else {
            e.data.activateWidget();
        }
    }
    onMouseMove(e) {

        this.clearTimeout();
        this.pageX = e.pageX;
        this.pageY = e.pageY;
        let button = this;
        this.timeout = setTimeout(function () {


            if (button.requestInProgress) {
                return;
            }
            try{
                pageUtils.removeDisplayUnderPosition(button.pageX,button.pageY);
                let word = pageUtils.getWordUnderPosition(button.pageX,button.pageY);

                if(word){
                    button.requestInProgress = true;
                    easyReading.busyAnimation.startAnimation();
                    if (!button.filterUserInterfaceElements(word)) {
                        requestManager.createRequest(button, word, e);
                    }
                }
            }catch (e) {
                console.log(e);
            }


            button.timeout = null;
        }, 2000);
    }

    clearTimeout(){
        if (this.timeout) {
            clearTimeout(this.timeout);
            this.timeout = null;
        }
    }

    filterUserInterfaceElements(element) {
        return $(element).parents('.easy-reading-interface').length;
    }


    requestFinished() {
        super.requestFinished();
        easyReading.busyAnimation.stopAnimation();
        this.requestInProgress = false;
    }

    remove() {
        if (this.active) {
            this.deactivateWidget(false);
        }
        this.disable();
        $("#" + this.widgetID).remove();

    }
}