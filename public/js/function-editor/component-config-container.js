let componentConfigContainer = {

    container : null,
    init:function () {
        this.container = $("#component-config-container");
    },


    showConfigForPort(port){


        this.container.html('<div class="tab">\n' +
            '  <button class="tablinks" onclick="openCity(event, \'London\')">London</button>\n' +
            '  <button class="tablinks" onclick="openCity(event, \'Paris\')">Paris</button>\n' +
            '  <button class="tablinks" onclick="openCity(event, \'Tokyo\')">Tokyo</button>\n' +
            '</div>\n' +
            '\n' +
            '<!-- Tab content -->\n' +
            '<div id="London" class="tabcontent">\n' +
            '  <h3>London</h3>\n' +
            '  <p>London is the capital city of England.</p>\n' +
            '</div>\n' +
            '\n' +
            '<div id="Paris" class="tabcontent">\n' +
            '  <h3>Paris</h3>\n' +
            '  <p>Paris is the capital of France.</p> \n' +
            '</div>\n' +
            '\n' +
            '<div id="Tokyo" class="tabcontent">\n' +
            '  <h3>Tokyo</h3>\n' +
            '  <p>Tokyo is the capital of Japan.</p>\n' +
            '</div>');
    },

    showConfigForFunction(functionContainer){

        let functionInfo = functionContainer.functionInfo;

        let configTabHTML = "<button class=\"tablinks\" id=\"about-config-button\" onclick=\"openTab(event, 'about-config')\">About</button>";
        let configTabBodyHTML = '<div id="about-config" class="tabcontent"><h3>'+functionInfo.name+'</h3><hr><p>'+functionInfo.description+'</p></div>';

        if(functionInfo.inputTypes.length > 0){
            configTabHTML+= "<button class=\"tablinks\" onclick=\"openTab(event, 'input-config')\">Input Ports</button>";
            configTabBodyHTML+= '<div id="input-config" class="tabcontent"><h3>Input Ports</h3><hr>';

            for(let i=0; i < functionInfo.inputTypes.length; i++){

                configTabBodyHTML+=
                    '<div class="port"><h4>'+functionInfo.inputTypes[i].name+'</h4>' +
                        '<strong>Type:</strong>' + functionInfo.inputTypes[i].inputType+'<br>'+
                        '<strong>Description:</strong>' + functionInfo.inputTypes[i].description+
                    '</div>'




            }


            configTabBodyHTML+= '</div>';

        }

        if(functionInfo.outputTypes.length > 0){
            configTabHTML+= "<button class=\"tablinks\" onclick=\"openTab(event, 'output-config')\">Output Ports</button>";
            configTabBodyHTML+= '<div id="output-config" class="tabcontent"><h3>Output Ports</h3><hr>';

            for(let i=0; i < functionInfo.outputTypes.length; i++){

                configTabBodyHTML+=
                    '<div class="port"><h4>'+functionInfo.outputTypes[i].name+'</h4>' +
                    '<strong>Type:</strong>' + functionInfo.outputTypes[i].outputType+'<br>'+
                    '<strong>Description:</strong>' + functionInfo.outputTypes[i].description+
                    '</div>'

            }

            configTabBodyHTML+= '</div>';

        }

        this.container.html('<div class="tab">'+configTabHTML+'</div>'+configTabBodyHTML);

       $("#about-config-button").click();
    }

};


function openTab(evt, tabName) {

    evt.preventDefault();

    // Get all elements with class="tabcontent" and hide them
    let tabContent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    let tabLinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab

    document.getElementById(tabName).style.display = "block";
    evt.target.className += " active";
}