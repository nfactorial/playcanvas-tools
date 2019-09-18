

class MockHttps {
    constructor() {
        this.requestCount = 0;
    }

    request(options) {
        this.host  = options.host;
        this.port = options.port;
        this.path = options.path;
        this.method = options.method;
        this.headers = Object.assign({}, options.headers);

        this.requestCount++;
    }
}

module.exports = MockHttps;
