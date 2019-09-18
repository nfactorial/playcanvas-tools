/**
 * This file contains some support definitions to help when using requests over the network.
 */
module.exports = {
    Ports: {
        HTTP: 80,
        SSL: 443,
    },
    Method: {
        Get: 'GET',
        Put: 'PUT',
        Post: 'POST',
        Delete: 'DELETE',
    },
    ContentType: {
        ApplicationJson: 'application/json',
        ApplicationXml: 'application/xml',
    },
    createBearer: function(accessToken) {
        return `Bearer ${accessToken}`;
    },
};
