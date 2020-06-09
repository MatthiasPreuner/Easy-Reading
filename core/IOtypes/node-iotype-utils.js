/**
 * Utility methods for handling I/O Types
 * @Class ioTypeUtils
 */

let ioTypes = require("./iotypes");

let nodeIoTypeUtils = {
    /**
     * Converts an object to a specific IOType instance
     * @param ioObject
     * @returns IOType instance
     */
    toIOTypeInstance(ioObject) {

        let IOret = new ioTypes.IOTypes.IOType();
        if (typeof(ioObject) === "object" && ioObject.name !== undefined) {
            switch (ioObject.name) {
                case 'VoidIOType':
                    IOret = new ioTypes.IOTypes.VoidIOType();
                    break;
                case 'Word':
                    IOret = new ioTypes.IOTypes.Word(ioObject.word, ioObject.lang,ioObject.sentenceStart,ioObject.sentenceEnd);
                    break;
                case 'Sentence':
                    IOret = new ioTypes.IOTypes.Sentence(ioObject.sentence, ioObject.lang);
                    break;
                case 'Paragraph':
                    IOret = new ioTypes.IOTypes.Paragraph(ioObject.paragraph,ioObject.lang);
                    break;
                case 'AnnotatedParagraph':
                    IOret = new ioTypes.IOTypes.AnnotatedParagraph(ioObject.paragraph,ioObject.annotations, ioObject.lang);
                    break;
                case 'ImageIOType':
                    IOret = new ioTypes.IOTypes.ImageIOType(ioObject.url, ioObject.alt, ioObject.title);
                    break;
                case 'AudioType':
                    IOret = new ioTypes.IOTypes.AudioType(ioObject.mp3URL, ioObject.speechMarkURL, ioObject.speechMarks);
                    break;
                case 'JavaScriptType':
                    IOret = new ioTypes.IOTypes.JavaScriptType(ioObject.script);
                    break;
                case 'URLType':
                    IOret = new ioTypes.IOTypes.URLType(ioObject.url, ioObject.target);
                    break;
                case 'ContentReplacement':
                    IOret = new ioTypes.IOTypes.ContentReplacement(ioObject.replacements,ioObject.lang);
                    break;
                case 'Error':
                    IOret = new ioTypes.IOTypes.Error(ioObject.message,ioObject.type,ioObject.name,ioObject.description);
                    break;
                case 'NoResult':
                    IOret = new ioTypes.IOTypes.NoResult(ioObject.message, ioObject.name,ioObject.description);
                    break;
            }
        } else {
            return ioObject; // Backwards compatibility
        }
        return IOret;
    },
};

module.exports = nodeIoTypeUtils;