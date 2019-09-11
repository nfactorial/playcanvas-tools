const http = require('../http');

const ASSET_API_PATH = '/api/assets';

const Asset = module.exports = {};

/**
 * Retrieves the identifier for the branch associated with the specified name.
 * @param {PlayCanvasConfig} config - Configuration information for the operation.
 * @param {string} branchId - The identifier of the branch the asset will be created within. NOTE: This is *not* the branch name.
 * @returns {Promise<string>} The identifier associated with the supplied branch name.
 */
Asset.create  = async function(config, branchId) {
    const options = {
        host: config.api,
        port: config.port,
        path: `${ASSET_API_PATH}${config.projectId}/branches`,
        method: http.Method.Get,
        headers: {
            'Content-Type': http.ContentType.ApplicationJson,
            'Authorization': http.createBearer(config.accessToken),
        },
    };
};

