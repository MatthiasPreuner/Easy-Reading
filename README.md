# EasyReading-dev

The EasyReading framework acts as a centralized cloud service that hosts the user profile and an extendable amount of engines that can convert content into another easier to understand or alternative form. 

Whenever the user creates a request for translating/annotating/adapting (parts of) content the framework creates a query to the connected content/interaction conversion engines. The conversion engines can be something very basic like a dictionary for loanwords or something very complex like engines that analyse the meaning of a sentence or rearranging display and interaction modalities 
Engines make use of the personal knowledge base (e.g. personal pictures, videos, symbols, text snippets). Besides translating/annotating/adapting proven features for alternative presentation can be used (e.g. TTS). “Easy Reading” therefore is planned to be extendable to include new conversion engines.
 
##  Main Components and Technologies

Node.js: Node.js is a JavaScript runtime environment built on Chrome’s V8 JavaScript engine allowing to build real-time web applications allowing clients and servers to exchange data freely. Node.js acts as centralized server, allowing clients to interact in the following ways:

HTTPS: This is just a normal web-server hosting the JS/CSS files to inject

Websocket: A websocket server that is used to communicate with the extension.
The framework implementation hosts engine and user interface components that can be extended by external researchers and engines:

Engines: These are typically third cloud party services that aid the end users by adapting or converting input into an easier to understand format. Engines have a standardized API making it easy for external researchers or companies to extend the existing solution with their own product.

User interface components: 
-User-Interface: The user interface container as it is presented to the user
-Widget: Each user interface hosts widgets that trigger a function of an engine
-Presentation: Presentation of the result of an engine to the user

##  For developers
Please see: 
- The developer guide (this directory)
- Security review (this directory)

For bugs and discussions we currently have the following addresses:
- Issues with the chrome extension:  https://github.com/IISJKU/easy-reading-chrome-extension/issues
- Issues with the firefox extension: https://github.com/IISJKU/easy-reading-firefox-extension/issues
- Other issues, including problems with support: https://github.com/IISJKU/EasyReading-dev/issues

 Also see:
 - the read me files at the chrome extension:https://github.com/IISJKU/easy-reading-chrome-extension
 - the read me files at the  the firefox extension: https://github.com/IISJKU/easy-reading-firefox-extension


Suggested reading from https://www.easyreading.eu/?page_id=333  includes:
 - The IPR Handbook
 - Easy Reading Handbook
 - Informed consent
 - Checklist for gathering and using  data correctly
 - Checklist for interaction with users during user trials
 - Checklist for system compliance with data regulations
