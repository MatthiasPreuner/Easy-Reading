let descriptionEntryCreator = {
    entryType : {
        SUB_HEADING: "SUB_HEADING",
        PARAGRAPH: "PARAGRAPH",
        TEXT:"TEXT",
        LIST_ITEM: "LIST_ITEM",
        ORDER_LIST_ITEM: "ORDERED_LIST_ITEM",
        IMAGE: "IMAGE",
    },
    createSubHeadingEntry(componentOrEngine,id,subHeading){
        return {
            id: descriptionEntryCreator.createUniqueID(componentOrEngine,id),
            type:descriptionEntryCreator.entryType.SUB_HEADING,
            content: subHeading,
        }
    },
    createTextEntry(componentOrEngine,id,text){
        return {
            id: descriptionEntryCreator.createUniqueID(componentOrEngine,id),
            type:descriptionEntryCreator.entryType.TEXT,
            content: text,
        }
    },
    createParagraphEntry(componentOrEngine,id,paragraph) {
        return {
            id: descriptionEntryCreator.createUniqueID(componentOrEngine,id),
            type: descriptionEntryCreator.entryType.PARAGRAPH,
            content: paragraph,
        }
    },
    createListItemEntry(componentOrEngine,id,listItemText) {
        return {
            id: descriptionEntryCreator.createUniqueID(componentOrEngine,id),
            type: descriptionEntryCreator.entryType.LIST_ITEM,
            content: listItemText,
        }
    },

    createOrderedListItemEntry(componentOrEngine,id,orderedListItemText) {
        return {
            id: descriptionEntryCreator.createUniqueID(componentOrEngine,id),
            type: descriptionEntryCreator.entryType.ORDER_LIST_ITEM,
            content: orderedListItemText,
        }
    },

    createEntryForImage(componentOrEngine,id,imageURL,altText,cssClass=null){
        return {
            id: descriptionEntryCreator.createUniqueID(componentOrEngine,id),
            type: descriptionEntryCreator.entryType.IMAGE,
            url: descriptionEntryCreator.createURL(componentOrEngine,imageURL),
            content: altText,
            cssClass: cssClass
        }

    },
    createUniqueID(componentOrEngine,id){
        if(componentOrEngine.componentCategory){

            //Component
            return componentOrEngine.componentCategory+"_"+componentOrEngine.id+"_"+id;

        }else{

            //Function
            return "engine_"+componentOrEngine.id+"_"+id;

        }

    },

    createURL(componentOrEngine,url) {
        if (componentOrEngine.componentCategory) {
            //Component
            return componentOrEngine.copyFileToWeb(url);
        } else {

            //Engine
            return componentOrEngine.copyFileToWeb(url);

        }
    }


};

module.exports = descriptionEntryCreator;
