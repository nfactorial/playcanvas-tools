const JobStatus = require('./status');

const HOST_ADDRESS = 'playcanvas.com';
const API_PATH = '/api/apps/';
const JOB_DELAY_PERIOD = 1000;
const PORT = 443;

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
 * @param {object} https - The HTTPS module to be used.
 * @param {number} projectId - Identifier of the project we wish to download.
 * @param {string} projectName - Name of the project to be downloaded.
 * @param {string} accessToken - The API token that provides us access to the organization.
 * @param {number[]} scenes - Array of scene identifiers to be contained within the download.
 * @returns {Promise<string>} Identifier of the job that is processing the download request.
 */
async function createDownload(https, projectId, projectName, accessToken, scenes) {
    if (!Array.isArray(scenes))
        throw new Error('Cannot create download job without scene list');

    const bodyData = {
        project_id: projectId,
        name: projectName,
        scenes,
    };

    const options = {
        host: HOST_ADDRESS,
        path: `${API_PATH}download`,
        method: 'POST',
        port: PORT,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
    };

    return new Promise((resolve, reject) => {
        const request = https.request(options, response => {
            response.on('data', data => {
                const parsedData = JSON.parse(data);
                if (parsedData.error) {
                    reject(`Failed to download application '${parsedData.error}'`);
                    return;
                }

                resolve(parsedData.id);
            });

            response.on('error', err => {
                reject(err);
            });
        });

        request.write(JSON.stringify(bodyData));
        request.end();
    });
}

/**
 * Checks the status of the specified job being performed by the PlayCanvas server.
 * @param {object} https - The HTTPS module to be used.
 * @param {string} accessToken - The API token that provides us access to the organization.
 * @param {string} id - Identifier of the job whose status we are checking.
 */
async function queryStatus(https, accessToken, id) {
    const options = {
        host: HOST_ADDRESS,
        path: `${API_PATH}${id}`,
        method: 'GET',
        port: PORT,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    };

    return new Promise((resolve, reject) => {
        const request = https.request(options, response => {
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
 * @param {object} https - The HTTPS module to be used.
 * @param {string} accessToken - The API token that provides us access to the organization.
 * @param {string} id - Identifier of the job whose status we are checking.
 * @returns {Promise<string>} Resolves with the job status.
 */
async function wait(https, accessToken, id) {
    let status = JobStatus.Running;

    while (status !== JobStatus.Complete) {
        await sleepProcess(JOB_DELAY_PERIOD);

        const status = await queryStatus(https, accessToken, id);
        switch (status) {
            case JobStatus.Running:
            case JobStatus.Complete:
                break;

            default:
                throw new Error(`Unknown status ${status} in play-canvas job`);
        }
    }

    return status;
}

module.exports = {
    createDownload,
    queryStatus,
    wait,
};
