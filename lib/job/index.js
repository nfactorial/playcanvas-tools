const JobStatus = require('./status');
const Branches = require('../branches');

const APP_API_PATH = '/api/apps/';
const JOB_API_PATH = '/api/jobs/';
const JOB_DELAY_PERIOD = 1000;

/**
 * Waits for the specified period of time.
 * @param {number} duration - The time (in milliseconds) to wait.
 * @returns {Promise<undefined>}
 */
async function sleepProcess(duration) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, duration);
    });
}

/**
 * Checks the status of the specified job being performed by the PlayCanvas server.
 * @param {PlayCanvasConfig} config - Configuration information for operation.
 * @param {number[]} scenes - Array of scene identifiers to be contained within the download.
 * @returns {Promise<string>} Identifier of the job that is processing the download request.
 */
async function createDownload(config, scenes) {
    if (!Array.isArray(scenes))
        throw new Error('Cannot create download job without scene list');

    const branchId = config.branchName ? await Branches.getBranchId(config) : undefined;

    const bodyData = {
        scripts_concatenate: true,
        project_id: config.projectId,
        branch_id: branchId,
        name: config.projectName,
        scenes,
    };

    const options = {
        host: config.api,
        port: config.port,
        path: `${APP_API_PATH}download`,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.accessToken}`,
        },
    };

    return new Promise((resolve, reject) => {
        const request = config.https.request(options, response => {
            response.on('data', data => {
                const parsedData = JSON.parse(data);
                if (parsedData.error) {
                    reject(`Failed to download application '${parsedData.error}'`);
                    return;
                }

                resolve(parsedData.id);
            });

            response.on('error', reject);
        });

        request.write(JSON.stringify(bodyData));
        request.end();
    });
}

/**
 * Checks the status of the specified job being performed by the PlayCanvas server.
 * @param {PlayCanvasConfig} config - Configuration information for operation.
 * @param {string} id - Identifier of the job whose status we are checking.
 */
async function queryStatus(config, id) {
    const options = {
        host: config.api,
        path: `${JOB_API_PATH}${id}`,
        method: 'GET',
        port: config.port,
        headers: {
            'Authorization': `Bearer ${config.accessToken}`,
        },
    };

    return new Promise((resolve, reject) => {
        const request = config.https.request(options, response => {
            response.on('data', data => {
                const parsedData = JSON.parse(data);
                if (parsedData.error) {
                    reject(parsedData.error);
                    return;
                }

                resolve(parsedData);
            });

            response.on('error', () => {
                reject('Error communicating with server.');
            });
        });

        request.end();
    });
}

/**
 * Waits for a specified job to be completed on the play-canvas server.
 * @param {PlayCanvasConfig} config - Configuration information for operation.
 * @param {string} id - Identifier of the job whose status we are checking.
 * @returns {Promise<object>} Resolves with the job status.
 */
async function wait(config, id) {
    let result = {
        status: JobStatus.Running,
    };

    while (result.status !== JobStatus.Complete) {
        await sleepProcess(JOB_DELAY_PERIOD);

        result  = await queryStatus(config, id);
        switch (result.status) {
            case JobStatus.Running:
            case JobStatus.Complete:
                break;

            default:
                throw new Error(`Unknown status ${result.status} in play-canvas job`);
        }
    }

    return result;
}

module.exports = {
    createDownload,
    queryStatus,
    wait,
};
