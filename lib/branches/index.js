const http = require('../http');

const APP_API_PATH = '/api/projects/';

const Branches = module.exports = {};

/**
 * Retrieves the identifier for the branch associated with the specified name.
 * @param {PlayCanvasConfig} config - Configuration information for operation.
 * @returns {Promise<string>} The identifier associated with the supplied branch name.
 */
Branches.getBranchId = async function(config) {
    if (config.branchName) {
        let lastBranch = '';

        for (;;) {
            const branchInfo = await Branches.listBranches(config, lastBranch);

            for (const info of branchInfo.result) {
                if (info.name === config.branchName) {
                    return info.id;
                }
            }

            if (!branchInfo.pagination || !branchInfo.pagination.hasMore) {
                throw new Error(`Could not find branch "${config.branchName}". Searched ${branchInfo.result.length} branches.`);
            }

            lastBranch = branchInfo.result[branchInfo.result.length - 1].id;
        }
    }

    return undefined;
};

/**
 * Retrieves a list of branches that are available within the project.
 * @param {PlayCanvasConfig} config - Configuration information for operation.
 * @param {string=} lastBranch - The last branch that was visited during enumeration.
 * @returns {Promise<object>} Description of each Branch available within the PlayCanvas repository.
 */
Branches.listBranches = async function(config, lastBranch) {
    const options = {
        host: config.api,
        port: config.port,
        path: lastBranch ? `${APP_API_PATH}${config.projectId}/branches?skip=${lastBranch}` : `${APP_API_PATH}${config.projectId}/branches`,
        method: http.Method.Get,
        headers: {
            'Content-Type': http.ContentType.ApplicationJson,
            'Authorization': http.createBearer(config.accessToken),
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

                resolve(parsedData);
            });

            response.on('error', reject);
        });
        request.end();
    });
};
