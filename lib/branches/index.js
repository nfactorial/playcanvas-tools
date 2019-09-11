
const APP_API_PATH = '/api/projects/';

const Branches = module.exports = {};

/**
 * Retrieves the identifier for the branch associated with the specified name.
 * @param {PlayCanvasConfig} config - Configuration information for operation.
 * @returns {Promise<string>} The identifier associated with the supplied branch name.
 */
Branches.getBranchId = async function(config) {
    if (config.branchName) {
        const branchInfo = await Branches.listBranches(config);

        for (const info of branchInfo.result) {
            if (info.name === config.branchName) {
                return info.id;
            }
        }

        console.warn(`Could not find branch "${config.branchName}", defaulting to "master". Searched ${branchInfo.result.length} branches.`);
    }

    return undefined;
};

/**
 * Retrieves a list of branches that are available within the project.
 * @param {PlayCanvasConfig} config - Configuration information for operation.
 * @returns {Promise<object>} Description of each Branch available within the PlayCanvas repository.
 */
Branches.listBranches = async function(config) {
    const options = {
        host: config.api,
        port: config.port,
        path: `${APP_API_PATH}${config.projectId}/branches`,
        method: 'GET',
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

                resolve(parsedData);
            });

            response.on('error', reject);
        });
        request.end();
    });
};
