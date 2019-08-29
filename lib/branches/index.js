
const HOST_ADDRESS = 'playcanvas.com';
const APP_API_PATH = '/api/projects/';
const PORT = 443;

const Branches = module.exports = {};

/**
 * Retrieves the identifier for the branch associated with the specified name.
 * @param {object} https - HTTPS module to be used for communication with the server.
 * @param {string} projectId - Identifier of the project we wish to access.
 * @param {string} branchName - The name of the branch whose identifier we wish to retrieve.
 * @param {string} accessToken - API access token granting access to the server API.
 * @returns {Promise<string>} The identifier associated with the supplied branch name.
 */
Branches.getBranchId = async function(https, projectId, branchName, accessToken) {
    const branchInfo = await Branches.listBranches(https, projectId, accessToken);

    for (const info of branchInfo.result) {
        if (info.name === branchName) {
            return info.id;
        }
    }

    return undefined;
};

/**
 * Retrieves a list of branches that are available within the project.
 * @param https
 * @param projectId
 * @param accessToken
 * @returns {Promise<Promise<unknown>>}
 */
Branches.listBranches = async function(https, projectId, accessToken) {
    const options = {
        host: HOST_ADDRESS,
        path: `${APP_API_PATH}${projectId}/branches`,
        method: 'GET',
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

                resolve(parsedData);
            });

            response.on('error', reject);
        });
        request.end();
    });
};
