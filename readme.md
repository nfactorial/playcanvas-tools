# PlayCanvas Tools
This package wraps the PlayCanvas REST API providing scripting support tools for interacting with the playcanvas server.
## Installation
Install the package using npm with:
```
npm install --save @nfactorial/playcanvas-tools
```
## Usage
Most usage of the PlayCanvas REST API requires an organisation account, within your organisation
create an access token. This is required in order to access the REST API.
### Downloading Project
```javascript
const PlayCanvasTools = require('@nfactorial/playcanvas-tools');

await PlayCanvasTools.download('my_package.zip', projectId, 'my_project_name', accessToken, [scenes]);
 
```
