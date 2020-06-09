const hbs = require('hbs');
let speechUtils = require("../../core/util/speech-utils");
let descriptionManager = require("../../core/components/util/description/descriptionManager");
const stringHash = require("string-hash");
hbs.registerHelper("hasRole", function (user, role, options) {
    let userHasRole = false;
    if (user) {

        if (user.roles) {

            if (Array.isArray(user.roles)) {
                if (user.roles.includes(role)) {
                    userHasRole = true;
                }
            }


        }

    }

    return userHasRole ? options.fn(this) : options.inverse(this)
});
hbs.registerHelper('hasValue', function() {
    let args = Array.prototype.slice.call(arguments);

    for(let i=0; i < args.length-1; i++){
        if(args[i] === ""){
            return args[args.length-1].inverse(this);
        }
    }
    return args[args.length-1].fn(this);
});

hbs.registerHelper('componentListNeedsToBeRendered', function(componentList,options) {

    //If component list is empty. e.g function without presentation.
    if(componentList.length === 0){
        return options.inverse(this);
    }

    //Choose between components
    if(componentList.length > 1){
        return options.fn(this);
    }
    let component = componentList[0];

    //Configuration of component present
    if(component.dataSchema && component.dataSchema.properties !== undefined) {
        return options.fn(this);
    }

    //Component has textual description
    if(component.textualDescription.length > 0){
        return options.fn(this);
    }

    return options.inverse(this);

});

hbs.registerHelper('configurationNeedsToBeRendered', function(componentList,options) {
    //At least two components;
    if(componentList.length > 1){
        return options.fn(this);
    }
    //At least one component with configuration
    let component = componentList[0];
    if(component.dataSchema && component.dataSchema.properties !== undefined) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('concat', function () {

    let result = "";

    for(let i in arguments) {
        result += (typeof arguments[i] === "string" ||  typeof arguments[i] === "number") ? arguments[i] : "";
    }

    return result;

});

hbs.registerHelper('chain', function () {
    let helpers = [];
    let args = Array.prototype.slice.call(arguments);
    let argsLength = args.length;
    let index;
    let arg;

    for (index = 0, arg = args[index];
         index < argsLength;
         arg = args[++index]) {
        if (Handlebars.helpers[arg]) {
            helpers.push(Handlebars.helpers[arg]);
        } else {
            args = args.slice(index);
            break;
        }
    }

    while (helpers.length) {
        args = [helpers.pop().apply(Handlebars.helpers, args)];
    }

    return args.shift();
});

hbs.registerHelper('renderTextualDescription',function (textualDescription,lang,index) {



    return renderTextualDescription(textualDescription,lang,index);
});

function renderTextualDescription(textualDescription,lang,index){
    let textualDescriptionHTML = "";
    if(textualDescription){

        let audioElements =[];
        for(let i=0; i < textualDescription.length; i++) {
            let src = speechUtils.getAudioSourceForString(textualDescription[i].id, lang);
            let id = textualDescription[i].id+"_"+index;
            if(src){
                audioElements.push({
                    src: src,
                    elementId:id,
                });
            }
        }
        let audioButtonHTML = createAudioButton(audioElements);

        let lastItemType = "";
        for(let i=0; i < textualDescription.length; i++){
            let id = textualDescription[i].id+"_"+index;
            let nextItemType = "";
            if(i+1 < textualDescription.length){
                nextItemType = textualDescription[i+1].type;
            }

            switch (textualDescription[i].type) {
                case descriptionManager.entryType.PARAGRAPH:
                    textualDescriptionHTML+="<p id='"+id+"'>"+audioButtonHTML+textualDescription[i].translatedContent+"</p>";
                    break;
                case descriptionManager.entryType.IMAGE:
                     if(textualDescription[i].cssClass){
                         textualDescriptionHTML+= audioButtonHTML+'<img id="'+id+'"  src="'+textualDescription[i].url+'" alt="'+textualDescription[i].translatedContent+'" class="'+textualDescription[i].cssClass+'">';
                    }else{
                        textualDescriptionHTML+= audioButtonHTML+'<img id="'+id+'"  src="'+textualDescription[i].url+'" alt="'+textualDescription[i].translatedContent+'">';
                    }

                    break;
                case descriptionManager.entryType.ORDER_LIST_ITEM:
                    if(lastItemType !== descriptionManager.entryType.ORDER_LIST_ITEM){
                        if(audioButtonHTML !== ""){
                            textualDescriptionHTML+= audioButtonHTML;
                        }
                        textualDescriptionHTML+="<ol>";
                    }
                    textualDescriptionHTML+="<li id='"+id+"'>"+textualDescription[i].translatedContent+"</li>";

                    if(nextItemType  !== descriptionManager.entryType.ORDER_LIST_ITEM){
                        textualDescriptionHTML+="</ol>";
                    }

                    break;
                case descriptionManager.entryType.LIST_ITEM:
                    if(lastItemType !== descriptionManager.entryType.ORDER_LIST_ITEM){
                        if(audioButtonHTML !== ""){
                            textualDescriptionHTML+=audioButtonHTML;
                        }
                        textualDescriptionHTML+="<ul>";
                    }
                    textualDescriptionHTML+="<li id='"+id+"'>"+textualDescription[i].translatedContent+"</li>";

                    if(nextItemType  !== descriptionManager.entryType.ORDER_LIST_ITEM){
                        textualDescriptionHTML+="</ul>";
                    }
                    break;
                case descriptionManager.entryType.SUB_HEADING:
                    textualDescriptionHTML+="<h2 id='"+id+"'>"+audioButtonHTML+textualDescription[i].translatedContent+"</h2>";
                    break;
                case descriptionManager.entryType.TEXT:
                    textualDescriptionHTML+="<span id='"+id+"'>"+audioButtonHTML+textualDescription[i].translatedContent+"</span>";
                    break;
                default:

                    break;
            }

            lastItemType = textualDescription[i].type;

            audioButtonHTML = "";


        }


    }

    return textualDescriptionHTML;

}

hbs.registerHelper('createTTSButton', function (speechElements,lang) {
    let args = Array.prototype.slice.call(arguments);

    speechElements = speechElements.replace(" ", "").split(",");



    let audioElements = [];


    for (let i = 0; i < speechElements.length; i++) {

        let element = speechElements[i].split(":");

        let src = speechUtils.getAudioSourceForString(element[0], lang);
        if(element.length>1){
            audioElements.push({
                src: src,
                elementId: element[1]
            });
        }else{
            audioElements.push({
                src: src,
                elementId: element[0]
            });
        }



    }


    return createAudioButton(audioElements);
});

function createAudioButton(audioElements){
    audioElements = btoa(JSON.stringify(audioElements));
    return ' <button type="button" class="er-audio-player" data-audio-elements="'+audioElements+'">' +
        '<img src="/images/setup/text-to-speech.png" alt="play audio">' +
        '</button>';
}
hbs.registerHelper('eq', function () {
    const args = Array.prototype.slice.call(arguments, 0, -1);
    return args.every(function (expression) {
        return args[0] === expression;
    });
});
hbs.registerHelper('ifEquals', function (arg1, arg2, options) {
    if (typeof arg1 === 'undefined' && arg2 === null) {
        return options.fn(this);
    }
    if (typeof arg2 === 'undefined' && arg1 === null) {
        return options.fn(this);
    }
    return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
});

hbs.registerHelper('ifNotEquals', function (arg1, arg2, options) {
    if (typeof arg1 === 'undefined' && arg2 === null) {
        return options.inverse(this);
    }
    if (typeof arg2 === 'undefined' && arg1 === null) {
        return options.inverse(this);
    }
    return (arg1 !== arg2) ? options.fn(this) : options.inverse(this);
});



hbs.registerHelper('convertToString', function (data) {
    return JSON.stringify(data)
});

hbs.registerHelper('capitalizeFirst', function (text) {
    return new hbs.SafeString(
        text.charAt(0).toUpperCase() + text.slice(1)
    );
});

hbs.registerHelper('capitalizeWords', function (text) {
    return new hbs.SafeString(
        text.replace(/(?:^|\s)\S/g, function (a) {
            return a.toUpperCase();
        })
    );
});

hbs.registerHelper('addEnableCheckBox', function (tool, index) {
    let form = createCheckBox(tool.enable, index)
    return new hbs.SafeString(form)
});

hbs.registerHelper('addEnableCheckBoxLabel', function (title, icon, index) {
    let form = createCheckBoxLabel(title, icon, index)
    return new hbs.SafeString(form)
});

hbs.registerHelper('addInputField', function (tool, index,lang) {
    let form = "";
    if (tool.dataSchema.properties) {
        form += createInputFields(tool, index,lang)
    }
    return new hbs.SafeString(form)
});

hbs.registerHelper('checklength', function (v1, v2, options) {
    'use strict';
    if (v1.length <= v2) {
        return options.fn(this);
    }
    return options.inverse(this);
});

hbs.registerHelper('createTextualDescriptionForComponentList', function (componentList,functionId,type,activeComponent,lang,index) {

    if(componentList.length === 1){

        return new hbs.SafeString(renderTextualDescription(componentList[0].textualDescription,lang,index));
    }else{
        let html = '<div class="textual-description-container">';
        for(let i=0; i < componentList.length; i++){


            if(componentList[i] === activeComponent.source){
                html+='<div class="textual-description" id="'+createComponentTextualDescriptionIdentifier(componentList[i],functionId,type)+'">';
            }else{
                html+='<div class="textual-description" id="'+createComponentTextualDescriptionIdentifier(componentList[i],functionId,type)+'" style="display: none">';
            }

            html+=renderTextualDescription(componentList[i].textualDescription,lang,index);
            html+='</div>';
        }

        html+='</div>';

        return new hbs.SafeString(html);
    }

});

function createComponentTextualDescriptionIdentifier(component, functionId, type){
    return type+"_"+functionId+"_"+component.id+"_description";
}

hbs.registerHelper('createConfigFormForComponentList', function (componentList, functionId, type, activeComponent, title,lang,index) {

    let html = "";
    //Return if empty component list. e.g engine with void output has 0 presentations
    if (componentList.length === 0) {
        return html;
    }
    let currentComponent = componentList[0];
    if (activeComponent.source != null) {
        currentComponent = activeComponent.source;
    }


    let fieldId = "widget_" + type + "_" + functionId;
    let inputID = createInputID(functionId, type);

    if (componentList.length === 1) {
        html = '<div id="' + fieldId + '" class="inputField">';

        html += '<input type="hidden" class="component-select" name="' + inputID + '" id="' + inputID + '" value="' + componentList[0].id + '">';

        if (componentList[0].dataSchema) {

            prepareComponent(componentList[0], functionId, activeComponent);
            html += createConfigFormForComponent(componentList[0],lang);
        }
        html += '</div>';
        return new hbs.SafeString(html);

    } else {

        html = '<fieldset id="' + fieldId + '"><legend>' + title + '</legend>';
        for (let i = 0; i < componentList.length; i++) {


            html += '<div class="inputField">';
            let inputIDRadio = inputID + '-' + i;

            if (componentList[i].id === activeComponent.source.id) {
                html += '<input type="radio" class="component-select" name="' + inputID + '" id="' + inputIDRadio + '" value="' + componentList[i].id + '"  data-textual-description="'+createComponentTextualDescriptionIdentifier(componentList[i],functionId,type)+'"  checked> <label for="' + inputIDRadio + '">' + componentList[i].name + '</label> ';
            } else {
                html += '<input type="radio"  class="component-select" name="' + inputID + '" id="' + inputIDRadio + '" value="' + componentList[i].id + '" data-textual-description="'+createComponentTextualDescriptionIdentifier(componentList[i],functionId,type)+'" > <label for="' + inputIDRadio + '">' + componentList[i].name + '</label> ';
            }

            if (componentList[i].dataSchema) {

                prepareComponent(componentList[i], functionId, activeComponent);
                html += createConfigFormForComponent(componentList[i],lang);
            }

            html += '</div>'
        }

        html += "</fieldset>";
        return new hbs.SafeString(html);
    }
});

function prepareComponent(component, functionId, activeComponent) {
    component.componentID = functionId + "_" + component.componentID;

    if (activeComponent.configuration != null && activeComponent.source != null && component.id === activeComponent.source.id) {
        component.configuration = activeComponent.configuration;
    } else {
        component.configuration = component.getDefaultConfiguration().configuration;
    }
}

hbs.registerHelper('createConfigFormForComponent', function (component,lang) {
    return createConfigFormForComponent(component,lang);
});

function createConfigFormForComponent(component,lang) {
    let componentID = component.componentID + "_" + component.id;

    let html = "";

    if (component.dataSchema && component.dataSchema.properties !== undefined) {

        Object.keys(component.dataSchema.properties).forEach(function (key, index) {

            let schema = component.dataSchema.properties[key];
            let currentValue = null;
            if (component.configuration) {
                if (component.configuration.hasOwnProperty(key)) {
                    currentValue = component.configuration[key];
                }
            }


            let propertyInfo = {
                propertyName: key,
                schema: schema,
                componentID: componentID,
                currentValue: currentValue,
                fieldId: key,
                iconsForSchemaProperties: component.iconsForSchemaProperties,
            };

            html = html + createInputFieldForSchemaProperty(propertyInfo,lang);
        });
    }

    return new hbs.SafeString(html);
}

function createInputFieldForSchemaProperty(propertyInfo,lang) {

    switch (propertyInfo.schema.type) {

        case "integer": {
            return createInputFieldForIntegerSchema(propertyInfo,lang);
        }
        case "string" : {
            return createInputFieldForStringProperty(propertyInfo,lang);
        }
    }
}

function createInputFieldForIntegerSchema(propertyInfo,lang) {

    let inputID = createInputID(propertyInfo.componentID, propertyInfo.propertyName);
    let currentValue = "";
    if (propertyInfo.currentValue) {

        currentValue = 'value="' + propertyInfo.currentValue + '"';

    }
    let iconHTML ="";
    let icon = getIconForProperty(propertyInfo.iconsForSchemaProperties,propertyInfo.propertyName);

    if(icon){
        iconHTML = createIconHTML(icon);
    }

    let labelID = inputID+"_label";
    let audioElements = [];
    audioElements.push({
        src: speechUtils.getAudioSourceForString(propertyInfo.schema.originalTitle, lang),
        elementId: labelID
    });
    let audioButtonHTML = createAudioButton(audioElements);

    let describedByAttribute = "";
    let describedByAttributeSpan = "";
    let html = '<div class="inputField">'

    if (propertyInfo.schema.description) {
        let describedBySpanID = inputID + "_description";
        describedByAttribute = ' aria-describedby="' + describedBySpanID + '"';
        describedByAttributeSpan = '<br><span id="' + describedBySpanID + '">' + propertyInfo.schema.description + '</span>';
    }

    if (typeof propertyInfo.schema.maximum !== "undefined" && typeof propertyInfo.schema.minimum !== "undefined") {
        html += '<label for="' + inputID + '">'+audioButtonHTML + propertyInfo.schema.title + '</label><input type="range" name="' + inputID + '" id="' + inputID + '" ' + currentValue + ' min="' + propertyInfo.schema.minimum + '" max="100"' + describedByAttribute + '>';
    } else {
        html += '<label for="' + inputID + '">'+audioButtonHTML + propertyInfo.schema.title + '</label><input type="number" name="' + inputID + '" id="' + inputID + '" ' + currentValue + describedByAttribute + '>';
    }

    html+=iconHTML;

    return html + describedByAttributeSpan + '</div>'
}

function createInputFieldForStringProperty(propertyInfo,lang) {
    let inputID = createInputID(propertyInfo.componentID, propertyInfo.propertyName);

    let describedByAttribute = "";
    let describedByAttributeSpan = "";
    if (propertyInfo.schema.description) {

        let describedBySpanID = inputID + "_description";
        describedByAttribute = ' aria-describedby="' + describedBySpanID + '"';
        describedByAttributeSpan = '<br><span id="' + describedBySpanID + '">' + propertyInfo.schema.description + '</span>';
    }


    if (typeof propertyInfo.schema.enum !== "undefined") {
        //Return hidden if input field = 1
        if (propertyInfo.schema.enum.length === 1) {


            let html = '<div id="' + propertyInfo.fieldId + '" class="inputField">';

            let inputIDRadio = inputID + '-0';

            if (propertyInfo.currentValue === propertyInfo.schema.enum[0]) {
                html += '<input type="hidden" name="' + inputID + '" id="' + inputIDRadio + '" value="' + propertyInfo.schema.enum[0] + '" checked> <label for="' + inputIDRadio + '">' + propertyInfo.schema.translatedEnum[0] + '</label> ';
            } else {
                html += '<input type="hidden" name="' + inputID + '" id="' + inputIDRadio + '" value="' + propertyInfo.schema.enum[0] + '"> <label for="' + inputIDRadio + '">' + propertyInfo.schema.translatedEnum[0] + '</label> ';
            }

            if (propertyInfo.schema.enumSubComponent !== undefined) {
                if (propertyInfo.schema.enumSubComponent[0] !== undefined) {
                    html += createConfigFormForComponent(propertyInfo.schema.enumSubComponent[0])
                }
            }

            return html += '</div>'

            //Return combo if more then 4 options
        } else if (propertyInfo.schema.enum.length > 4) {

            let html = '<div class="inputField"><label>' + propertyInfo.schema.title + '<select name="' + inputID + '" id="' + inputID + '"' + describedByAttribute + '>';
            for (let i = 0; i < propertyInfo.schema.enum.length; i++) {

                if (propertyInfo.currentValue === propertyInfo.schema.enum[i]) {
                    html += "<option selected value='" + propertyInfo.schema.enum[i] + "'>" + propertyInfo.schema.translatedEnum[i] + "</option>";
                } else {
                    html += "<option value='" + propertyInfo.schema.enum[i] + "'>" + propertyInfo.schema.translatedEnum[i] + "</option>";
                }

            }

            return html + "</select></label></div>" + describedByAttributeSpan;
            //Return radio if less then 4 options
        } else {
            let audioElements = [];


            let labelID = inputID+"_label";
            audioElements.push({
                src: speechUtils.getAudioSourceForString(propertyInfo.schema.originalTitle, lang),
                elementId: labelID
            });
            let startHtml = '<fieldset id="' + propertyInfo.fieldId + '"><legend id="'+labelID+'" ' + describedByAttribute + '>';
            let endHtml =  propertyInfo.schema.title + '</legend>';

            for (let i = 0; i < propertyInfo.schema.enum.length; i++) {

                endHtml += '<div class="inputField">';

                let inputIDRadio = inputID + '-' + i;

                let iconHTML ="";
                let icon = getIconForPropertyValue(propertyInfo.iconsForSchemaProperties,propertyInfo.propertyName,propertyInfo.schema.enum[i]);

                if(icon){
                    iconHTML = createIconHTML(icon);
                }

                if (propertyInfo.currentValue === propertyInfo.schema.enum[i]) {
                    endHtml += '<input type="radio" name="' + inputID + '" id="' + inputIDRadio + '" value="' + propertyInfo.schema.enum[i] + '" checked> <label id="'+inputIDRadio+'_label" for="' + inputIDRadio + '">' + propertyInfo.schema.translatedEnum[i] + ' '+iconHTML+'</label> ';
                } else {
                    endHtml += '<input type="radio" name="' + inputID + '" id="' + inputIDRadio + '" value="' + propertyInfo.schema.enum[i] + '"> <label id="'+inputIDRadio+'_label" for="' + inputIDRadio + '">' + propertyInfo.schema.translatedEnum[i]+ ' '+iconHTML+'</label> ';
                }

                if (propertyInfo.schema.enumSubComponent !== undefined) {
                    if (propertyInfo.schema.enumSubComponent[i] !== undefined) {
                        endHtml += createConfigFormForComponent(propertyInfo.schema.enumSubComponent[i])
                    }
                }

                endHtml += '</div>';

                let src = speechUtils.getAudioSourceForString(propertyInfo.schema.enum[i], lang);
                audioElements.push({
                    src: src,
                    elementId: inputIDRadio+"_label"
                });
            }

            let button = createAudioButton(audioElements);

            return startHtml+button+endHtml + "</fieldset>" + describedByAttributeSpan;
        }
    } else {
        let html = '<div class="inputField">'
        let type = "text";

        if (propertyInfo.schema.format == "color") {
            type = "color";
        }

        if (propertyInfo.currentValue) {
            html += '<label for="' + inputID + '">' + propertyInfo.schema.title + '</label><input type="' + type + '" name="' + inputID + '" id="' + inputID + '" value="' + propertyInfo.currentValue + '" required>';
        } else {
            html += '<label for="' + inputID + '">' + propertyInfo.schema.title + '</label><input type="' + type + '" name="' + inputID + '" id="' + inputID + '" required>';
        }

        return html + describedByAttributeSpan + '</div>'
    }
}

function createInputID(component, propertyName) {
    return component + "_" + propertyName;

}

function createCheckBox(isChecked, index) {
    let checked = isChecked ? 'checked' : '';
    let id = 'enable-' + index;
    return `<input data-control-type="enable" id="${id}" type="checkbox" onclick="prepareUpdate('${index}', false)" ${checked}/>`;
}

function createCheckBoxLabel(text, icon, index) {
    let checkboxId = 'enable-' + index;
    let id = checkboxId + '-label';
    return `<label class="tool-card-title-select-name" id="${id}" for="${checkboxId}"><span class="bg-image" style="background-image: url('${icon}')"></span>${text}</label>`;
}

function createInputFields(tool, index,lang) {
    let inputFields = ''
    const configurationDataOptions = tool.configurationDataOptions;

    if (configurationDataOptions && configurationDataOptions.length > 0) {
        configurationDataOptions.forEach(configurationDataOption => {
            switch (configurationDataOption.type.toLowerCase()) {
                case 'colorcombination':
                    inputFields += createInputOptionsForColorCombination(configurationDataOption, tool, index,lang);
                    break;
                case 'colorpicker':
                    inputFields += createInputFieldForProperty(configurationDataOption.dataSchemaProerty, tool, index, "color",lang);
                    break;
                case 'singleselectlist':
                    inputFields += createInputFieldForSingleSelectList(configurationDataOption, tool, index,lang);
                    break;
                case 'text':
                    inputFields += createInputFieldForProperty(configurationDataOption.dataSchemaProerty, tool, index, "text", lang);
                    break;
            }
        });
    } else {
        inputFields += createInputFieldForProperty(Object.keys(tool.dataSchema.properties), tool, index, "text",lang);
    }

    return inputFields
}

function getDataSchemaProertyByConfigurableDataOptionProerty(propertyMapping, configurableDataOptionProerty) {
    const mapping = propertyMapping.filter(map => map.configurableDataOptionProerty === configurableDataOptionProerty);
    return mapping[0].dataSchemaProerty;
}

function isRequired(tool, configProperties) {

    let isRequired = false;
    if (tool.dataSchema.required && tool.dataSchema.required.length > 0) {
        tool.dataSchema.required.forEach(requiredProperty => {
            const matchedProperty = configProperties.filter(property => {
                return (property.toLowerCase() === requiredProperty.toLowerCase());
            });
            if (matchedProperty.length > 0)
                isRequired = true;
        });
    }
    return isRequired;
}

function createInputOptionsForColorCombination(configurationDataOption, tool, index,lang) {

    let config = tool.config[0];
    const translation = tool.configurationDataOptionTranslations;
    const labelTranslaoin = translation[configurationDataOption.type];
    const id = tool.id + '-' + index
    let inputField = ''
    const configProperties = configurationDataOption.propertyMapping.map(property => property.dataSchemaProerty);
    const required = (isRequired(tool, configProperties)) ? 'required' : ''
    const configurableDataOption = configurationDataOption.configurableDataOption;
    const propertyMapping = configurationDataOption.propertyMapping;
    const dataSchemaPFontColorroerty = getDataSchemaProertyByConfigurableDataOptionProerty(propertyMapping, 'text-color');
    const dataSchemaPbackgroundColorroerty = getDataSchemaProertyByConfigurableDataOptionProerty(propertyMapping, 'background-color');
    if (!config) {
        config = {};
        config[dataSchemaPFontColorroerty] = tool.dataSchema.properties[dataSchemaPFontColorroerty].default;
        config[dataSchemaPbackgroundColorroerty] = tool.dataSchema.properties[dataSchemaPbackgroundColorroerty].default;
    }
    let labelIDI18N = tool.engineId+"."+tool.engineVersion+"."+tool.id+".data-option.colorCombination.label";

    let audioElements = [];

     let src = speechUtils.getAudioSourceForString(labelIDI18N, lang);
     labelIDI18N = stringHash(labelIDI18N);
     if(src){
         audioElements.push({
             src: src,
             elementId: labelIDI18N
         });
     }



     let audioButton = createAudioButton(audioElements);
    inputField += `<div data-option-type='${configurationDataOption.type}' class='config-data-option-${configurationDataOption.type}'><p id="${labelIDI18N}">${audioButton}${labelTranslaoin}</p><ul>`;
    configurableDataOption.forEach(dataOption => {
        const fontColor = dataOption['text-color'];
        const backgroundColor = dataOption['background-color'];
        const label = dataOption.label;
        const configData = {};
        configData[dataSchemaPFontColorroerty] = fontColor;
        configData[dataSchemaPbackgroundColorroerty] = backgroundColor;

        let checked = "";
        if ((fontColor.localeCompare(config[dataSchemaPFontColorroerty], undefined, {sensitivity: 'base'}) === 0)
            && (backgroundColor.localeCompare(config[dataSchemaPbackgroundColorroerty], undefined, {sensitivity: 'base'}) === 0)) {
            checked = "checked";
        }

        inputField += `<li class="${configurationDataOption.type}-option-container"><div>
                        <label style="color: ${fontColor}; background-color: ${backgroundColor}">
                           <input type="radio" name="${id}" value='${JSON.stringify(configData)}' ${checked} ${required}>
                           ${label}                           
                        </label>
                     </div></li>`;
    });
    inputField += "</ul></div>";

    return inputField
}

function createInputFieldForProperty(dataSchemaProerty, tool, index, type,lang) {

    let inputField = '';
    const config = tool.config[0];
    const translation = tool.configurationDataOptionTranslations;

    if (dataSchemaProerty && dataSchemaProerty.length > 0) {
        dataSchemaProerty.forEach(property => {

            const required = (isRequired(tool, [property])) ? 'required' : '';
            const prePopulatedValue = getPrePopulatedValue(tool.dataSchema.properties[property], config, property);
            const labelTranslaoin = translation[property];

            const id = property + '-' + index;
            inputField += `<div data-option-type='property' class='config-data-option-property'><label for='${id}'>${labelTranslaoin}</label><input id='${id}' type='${type}' value='${prePopulatedValue}' ${required}/></div>`;
        });
    }

    return inputField;
}

function getIconForProperty(iconsForSchema,property){
    for(let i=0; i<iconsForSchema.length; i++){

        if(iconsForSchema[i].type === "propertyIcon" && iconsForSchema[i].property === property){
            return iconsForSchema[i];
        }

    }
}

function getIconForPropertyValue(iconsForSchema,property,value){
    for(let i=0; i<iconsForSchema.length; i++){

        if(iconsForSchema[i].type === "propertyValueIcon" && iconsForSchema[i].property === property && iconsForSchema[i].value === value){
            return iconsForSchema[i];
        }

    }
}

function createIconHTML(icon) {

    return  '<img src="'+icon.url+'" alt="" class="'+icon.cssClass+'">';;
}

function createInputFieldForSingleSelectList(configurationDataOption, tool, index,lang) {

    let widget = "radio";
    if(widget === "radio"){
        let inputField = '';
        const config = tool.config[0];
        const translation = tool.configurationDataOptionTranslations;
        const configurableDataOption = configurationDataOption.configurableDataOption;

        if (configurationDataOption.dataSchemaProerty && configurationDataOption.dataSchemaProerty.length > 0) {
            configurationDataOption.dataSchemaProerty.forEach(dataSchemaProerty => {

                const required = (isRequired(tool, [dataSchemaProerty])) ? 'required' : '';
                const prePopulatedValue = getPrePopulatedValue(tool.dataSchema.properties[dataSchemaProerty], config, dataSchemaProerty);
                const id = dataSchemaProerty + '-' + index;
                const translatedLabel = translation[dataSchemaProerty];
                const translatedOptions = translation[dataSchemaProerty + "Options"];



                let audioElements =[];
                let i18nIDForProperty = tool.engineId+"."+tool.engineVersion+"."+tool.id+".data-option.property."+dataSchemaProerty+".label";
                let src = speechUtils.getAudioSourceForString(i18nIDForProperty, lang);
                if(src){
                    audioElements.push({
                        src: src,
                        elementId: stringHash(i18nIDForProperty),
                    });
                }
                let i18nIDForOptions = tool.engineId+"."+tool.engineVersion+"."+tool.id+".data-option.singleSelectList.optionList.";
                configurableDataOption.forEach(dataOption => {
                    src = speechUtils.getAudioSourceForString(i18nIDForOptions+dataOption.label, lang);
                    if(src){
                        audioElements.push({
                            src: src,
                            elementId: stringHash(i18nIDForOptions+dataOption.label),
                        });
                    }
                });
                //"aws-polly-tts.1.0.tts.data-option.property.language.label"
                //"aws-polly-tts.1.0.tts.data-option.singleSelectList.optionList.English": "Englisch",


                let audioButtonHTML = createAudioButton(audioElements);


                inputField += `<fieldset data-option-type='${configurationDataOption.type}' class='config-data-option-${configurationDataOption.type}'>
                <legend id="${stringHash(i18nIDForProperty)}">${audioButtonHTML}${translatedLabel}</legend>
             
                <div class="${configurationDataOption.type}-option-container">`;
                configurableDataOption.forEach(dataOption => {

                    let iconHTML = "";
                    let icon = getIconForPropertyValue(tool.iconsForSchemaProperties,dataSchemaProerty,dataOption.value);
                    if(icon){
                        iconHTML = createIconHTML(icon);
                    }
                    let optionID  = stringHash(i18nIDForOptions+dataOption.label);

                    if (typeof prePopulatedValue === "boolean") {

                        const isSelected = (prePopulatedValue === dataOption.value) ? 'checked' : '';
                        inputField += '<label id="'+optionID+'"><input type="radio" name="'+id+'" value="' + dataOption.value + '" ' + isSelected + '><span class="input-label">' + translatedOptions[dataOption.label] +'</span>'+iconHTML+ '</label>';


                    } else {
                        const isSelected = (prePopulatedValue.toLowerCase() === dataOption.value.toLowerCase()) ? 'checked' : '';
                        inputField += '<label id="'+optionID+'"><input type="radio" id="'+optionID+'" name="'+id+'" value="' + dataOption.value + '" ' + isSelected + '><span class="input-label">' + translatedOptions[dataOption.label] +'</span>'+ iconHTML+ '</label>';
                    }


                });
                inputField += '</div>' +
                    '</fieldset>';
            });
        }

        return inputField;
    }else{
        let inputField = '';
        const config = tool.config[0];
        const translation = tool.configurationDataOptionTranslations;
        const configurableDataOption = configurationDataOption.configurableDataOption;

        if (configurationDataOption.dataSchemaProerty && configurationDataOption.dataSchemaProerty.length > 0) {
            configurationDataOption.dataSchemaProerty.forEach(dataSchemaProerty => {

                const required = (isRequired(tool, [dataSchemaProerty])) ? 'required' : '';
                const prePopulatedValue = getPrePopulatedValue(tool.dataSchema.properties[dataSchemaProerty], config, dataSchemaProerty);
                const id = dataSchemaProerty + '-' + index;
                const translatedLabel = translation[dataSchemaProerty];
                const translatedOptions = translation[dataSchemaProerty + "Options"];




                inputField += `<div data-option-type='${configurationDataOption.type}' class='config-data-option-${configurationDataOption.type}'><label for='${id}'>${translatedLabel}</label>
            <select id='${id}' class="${configurationDataOption.type}-option-container">`;
                configurableDataOption.forEach(dataOption => {

                    if (typeof prePopulatedValue === "boolean") {

                        const isSelected = (prePopulatedValue === dataOption.value) ? 'selected' : '';
                        inputField += '<option value="' + dataOption.value + '" ' + isSelected + '>' + translatedOptions[dataOption.label] + '</option>';


                    } else {
                        const isSelected = (prePopulatedValue.toLowerCase() === dataOption.value.toLowerCase()) ? 'selected' : '';
                        inputField += '<option value="' + dataOption.value + '" ' + isSelected + '>' + translatedOptions[dataOption.label] + '</option>';
                    }


                });
                inputField += '</select>' +
                    '</div>';
            });
        }

        return inputField;
    }

}

function createInputFieldForRadioSelection(configurationDataOption, tool, index) {

    let inputField = '';
    const config = tool.config[0];
    const translation = tool.configurationDataOptionTranslations;
    const configurableDataOption = configurationDataOption.configurableDataOption;

    if (configurationDataOption.dataSchemaProerty && configurationDataOption.dataSchemaProerty.length > 0) {
        configurationDataOption.dataSchemaProerty.forEach(dataSchemaProerty => {

            const required = (isRequired(tool, [dataSchemaProerty])) ? 'required' : '';
            const prePopulatedValue = getPrePopulatedValue(tool.dataSchema.properties[dataSchemaProerty], config, dataSchemaProerty);
            const id = dataSchemaProerty + '-' + index;
            const labelTranslaoin = translation[dataSchemaProerty];
            const optionsTranslaoin = translation[dataSchemaProerty + "Options"];




            inputField += `<div data-option-type='${configurationDataOption.type}' class='config-data-option-${configurationDataOption.type}'><label for='${id}'>${labelTranslaoin}</label><select id='${id}' class="${configurationDataOption.type}-option-container">`;
            configurableDataOption.forEach(dataOption => {

                if (typeof prePopulatedValue === "boolean") {

                    const isSelected = (prePopulatedValue === dataOption.value) ? 'selected' : '';
                    inputField += '<option value="' + dataOption.value + '" ' + isSelected + '>' + optionsTranslaoin[dataOption.label] + '</option>';


                } else {
                    const isSelected = (prePopulatedValue.toLowerCase() === dataOption.value.toLowerCase()) ? 'selected' : '';
                    inputField += '<option value="' + dataOption.value + '" ' + isSelected + '>' + optionsTranslaoin[dataOption.label] + '</option>';
                }


            });
            inputField += '</select></div>';
        });
    }

    return inputField;
}


function getPrePopulatedValue(property, config, key) {
    if (config) {
        let value = config[key]
        if (value) {

            //Stored as tiny int in database...
            if (property.type === "boolean") {
                if (value === 1 || value === true) {
                    return true;
                } else {
                    return false;
                }
            }
            return value
        }
    }
    return property.default
}

module.exports = hbs;