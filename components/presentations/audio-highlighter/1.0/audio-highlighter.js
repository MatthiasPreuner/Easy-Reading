let PresentationBase = rootRequire("core/components/presentation/base/presentation-base");
let ioType = rootRequire("core/IOtypes/iotypes");

class AudioHighlighter extends PresentationBase {
    constructor(baseDir){

        super(baseDir);

        this.name = "AudioHighlighter";
        this.description = "Plays audio and highlights current spoken words";
        this.versionDescription = "Initial Version";
        this.scripts = ["presentation/audio-highlighter.js"];
        this.css = ["presentation/audio-highlighter.css"];
        this.assetDirectory= "";
        this.implementationClass = "AudioHighlighter";
        this.outputTypes = [{
            "outputType": ioType.IOTypes.AudioType.className,
            "name": "Output Audio",
            "description": "Audio with optional speech marks to embed",
        }];
    }

    getConfigurationSchema(){
        return {
            "type": "object",
            "properties": {
                "speed": {
                    "$id": "/properties/scope",
                    "type": "string",
                    "enum": ["slow", "normal","fast"],
                    "default": "normal",
                    "title": "Speed",
                    "description": "Defines the speed of the speech",
                }
            },
            "required": [
                "speed"
            ]
        };
    }

    createIconsForSchemaProperties(){
        this.createIconForSchemaPropertyValue("speed","slow","assets/speed_fast.png","radio_button_icon");
        this.createIconForSchemaPropertyValue("speed","normal","assets/speed_normal.png","radio_button_icon");
        this.createIconForSchemaPropertyValue("speed","fast","assets/speed_slow.png","radio_button_icon");

    }



}

module.exports.class = AudioHighlighter;