# PlayCanvas Tools

This package wraps the PlayCanvas REST API providing scripting support tools for interacting with the playcanvas server.

The GitHub URL for this project is <https://github.com/SlipstreamPhil/playcanvas-tools>

## Installation

Install the package using npm with:

```bash
npm install --save @nfactorial/playcanvas-tools
```

## Usage

Most usage of the PlayCanvas REST API requires an organisation account, within your organisation
create an access token. This is required in order to access the REST API.

### Examples

```javascript
// Download a Project from PlayCanvas, as my_package.zip.
// You will need to know the projectID for your project, and the accedToken.
// The scenes you wish to download should be specified in the [scenes] array.
const PlayCanvasTools = require('@nfactorial/playcanvas-tools');

await PlayCanvasTools.download('my_package.zip', projectId, 'my_project_name', accessToken, [scenes]);
```
