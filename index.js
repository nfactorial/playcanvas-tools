const https = require('https');
const Job = require('./lib/job');
const Download = require('./lib/download');

const Tools = module.exports = {};

/**
 * Downloads the specified project from the play-canvas server.
 * @param {string} targetPath - Path and name where the downloaded zip file will be stored.
 * @param {number} projectId - Identifier of the project to be downloaded.
 * @param {string} projectName - Name of the project to be downloaded.
 * @param {string} accessToken - Organization access token allowing access rights for the download operation.
 * @param {number[]} scenes - List of scenes to be downloaded included within the downloaded package.
 * @returns {Promise<string>}
 */
Tools.download = async function(targetPath, projectId, projectName, accessToken, scenes) {
    if (!targetPath || typeof targetPath !== 'string')
        throw new Error('A valid target path must be supplied');

    if (typeof projectId !== 'number')
        throw new Error('Invalid project id, must be a numeric value');

    const jobId = await Job.createDownload(https, projectId, projectName, accessToken, scenes);
    const jobInfo = await Job.wait(https, accessToken, jobId);

    return Download(https, targetPath, jobInfo.data.download_url)
};
