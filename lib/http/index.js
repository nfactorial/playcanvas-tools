
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
        ApplicationJson: 'application/json'
    },
    createBearer: function(accessToken) {
        return `Bearer ${accessToken}`;
    },
};
