class Tooltip extends Presentation{
    constructor(functionInfo, userInterface,configuration){

        super(functionInfo, userInterface,configuration);

        this.backgroundColor = "#ffffff";

        if(configuration){
            if(configuration.backgroundColor){

                this.backgroundColor = configuration.backgroundColor;
            }
        }

    }
    renderResult(request,result){

        let ioRes = ioTypeUtils.toIOTypeInstance(result.result);
        let resultHTML = ioRes.toHtml();
        let requestID = this.createRequestId();

        if (request.inputType instanceof Word) {
            for(let i=0; i < request.input.textNodes.length;i++){
                if($(request.input.textNodes[i]).parent().hasClass("easy-reading-result")){
                    if($(request.input.textNodes[i]).next().hasClass("easy-reading-result")){
                        $(request.input.textNodes[i]).next().remove();
                    }
                    $(request.input.textNodes[i]).unwrap();
                }
            }

            let span = pageUtils.wrapWordIn(request.input, "span",requestID+ " easy-reading-tooltip "+this.getResultClass(), this.getPresentationAndRequestIdentifier(requestID));
            $( span ).append("<span class='easy-reading-tooltip-text "+this.getResultClass()+"' style='background-color: "+this.backgroundColor+"'>"+resultHTML+"</span>");
        } else if (request.inputType instanceof Paragraph) {

            $( request.input.element).wrap( "<div class='"+requestID +" easy-reading-tooltip "+this.getResultClass()+"' "+this.getPresentationAndRequestIdentifier(requestID)+"></div>" );
            $("."+requestID).append("<span class='easy-reading-tooltip-text easy-reading-result' style='background-color: "+this.backgroundColor+"'>"+resultHTML+"</span>");
        }

        globalEventListener.presentationFinished(this);

    }

    undo(){

    }

    removeResult(requestID){

        let requestElement = $("."+requestID);
        requestElement.find(".easy-reading-tooltip-text").remove();
        let parent = requestElement.parent();
        requestElement.contents().unwrap();
        if(parent.length){
            parent.get(0).normalize();
        }
    }
}