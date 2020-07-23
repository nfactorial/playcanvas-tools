# PlayCanvas Tools

This package wraps the PlayCanvas REST API providing scripting support tools for interacting with the playcanvas server.

The GitHub URL for this project is <https://github.com/nfactorial/playcanvas-tools>

## Installation

Install the package using npm with:

```bash
npm install --save @nfactorial/playcanvas-tools
```

## Configuration
By default, PlayCanvas-Tools communicates with the PlayCanvas server located at https://playcanvas.com however
you may change this address  via the HOST_ADDRESS property of the PlayCanvas-Tools library if needed:
```javascript
const PlayCanvasTools = require('@nfactorial/playcanvas-tools');

PlayCanvasTools.HOST_ADDRESS = 'alternate-server.com';
```
PlayCanvas tools communicates via the SSL port 443, if your server expects communication via a different port you
may configure this with the HOST_PORT property:
```javascript
const PlayCanvasTools = require('@nfactorial/playcanvas-tools');

PlayCanvasTools.HOST_PORT = 80;
```
## Usage

Most usage of the PlayCanvas REST API requires an organisation account, within your organisation
create an access token. This is required in order to access the REST API.

### Examples
#### Downloading a Project Package
PlayCanvas Tools provides support for downloading a project package from the playcanvas service using the
asynchronous download method.
```javascript
// Download a Project from PlayCanvas as my_package.zip.
// You will need to know the projectID for your project, and the accessToken.
// The scenes you wish to download should be specified in the [scenes] array.
const PlayCanvasTools = require('@nfactorial/playcanvas-tools');

await PlayCanvasTools.download('my_package.zip', projectId, 'my_project_name', accessToken, [scenes]);
```
