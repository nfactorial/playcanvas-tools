const https = require('https');
const Job = require('./lib/job');
const Download = require('./lib/download');

const DEFAULT_HOST_ADDRESS = 'playcanvas.com';
const DEFAULT_HOST_PORT = 443;

const Tools = module.exports = {
    HOST_ADDRESS: DEFAULT_HOST_ADDRESS,
    HOST_PORT: DEFAULT_HOST_PORT,
};

/**
 * @typedef {object} PlayCanvasConfig
 * @property {string} api - End-point for the PlayCanvas REST API.
 * @property {number} port - The port number to communicate on, when invoking the play-canvas API.
 * @property {object} https - HTTPS module to be used for network communication.
 * @property {number} projectId - Identifier of the project being accessed.
 * @property {string} projectName - Name of the project being accessed.
 * @property {string} accessToken - Organization access token for use with API calls.
 * @property {string} branchName - Name of the branch to be accessed, if not specified then master will be used.
 */

/**
 * Downloads the specified project from the play-canvas server.
 * @param {string} targetPath - Path and name where the downloaded zip file will be stored.
 * @param {number} projectId - Identifier of the project to be downloaded.
 * @param {string} projectName - Name of the project to be downloaded.
 * @param {string} accessToken - Organization access token allowing access rights for the download operation.
 * @param {number[]} scenes - List of scenes to be downloaded included within the downloaded package.
 * @param {string=} branchName - Name of the branch to download, if not specified then master will be used.
 * @returns {Promise<string>}
 */
Tools.download = async function(targetPath, projectId, projectName, accessToken, scenes, branchName) {
    if (!targetPath || typeof targetPath !== 'string')
        throw new Error('A valid target path must be supplied');

    if (typeof projectId !== 'number')
        throw new Error('Invalid project id, must be a numeric value');

    const config = {
        api: Tools.HOST_ADDRESS,
        port: Tools.HOST_PORT,
        https,
        projectId,
        projectName,
        accessToken,
        branchName,
    };

    const jobId = await Job.createDownload(config, scenes);
    const jobInfo = await Job.wait(config, jobId);

    return Download(config, targetPath, jobInfo.data.download_url)
};
