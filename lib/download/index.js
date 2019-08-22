const fs = require('fs');
const URL = require('url');

const PORT = 443;

/**
 * Downloads a file and writes it to the specified output.
 * @param {object} https - The HTTPS module to be used.
 * @param {string} output - Path where we are to output the downloaded file.
 * @param {string} url - Web location of the file to be downloaded.
 * @returns {Promise<*>}
 */
module.exports = async function(https, output, url) {
    if (!output || typeof output !== 'string') {
        throw new Error('Invalid output path');
    }

    if (!url || typeof url !== 'string') {
        throw new Error('Invalid download URL');
    }

    return new Promise((resolve, reject) => {
        const parsedUrl = URL.parse(url);

        const options = {
            host: parsedUrl.hostname,
            path: parsedUrl.path,
            method: 'GET',
            port: PORT,
        };

        const file = fs.createWriteStream(output);

        file.on('finish', () => {
            resolve();
        });

        const request = https.request(options, response => {
            response.pipe(file);
        });
        request.end();
    });
};
