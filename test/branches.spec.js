const MockHttps = require('./https.mock');
const Branches = require('../lib/branches');
const Http = require('../lib/http');

const TEST_PORT = 1337;
const TEST_HOST = 'mydomain.com';

describe('listBranches', function() {
    it('Should correctly request branch data from the server', async function(done) {
        const https = new MockHttps();

        const result = await Branches.listBranches(config);

        expect(https.requestCount).to.be(1);
        expect(https.port).to.be(TEST_PORT);
        expect(https.host).to.be(TEST_HOST);
        expect(https.method).to.be(Http.Method.Get);
        expect(https.headers.Authorization).to.exist();
        expect(https.headers['Content-Type']).to.be(Http.ContentType.ApplicationJson);

        done();
    });
});
