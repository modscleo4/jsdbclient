const assert = require('assert');
const {describe, it, before, after} = require('mocha');

describe('Client', function () {
    describe('Connection', () => {
        it('Should return a new Connection instance', () => {
            assert.doesNotThrow(() => {
                new Connection('jsdb://jsdbadmin:jsdbadmin@localhost:6637/jsdb?encode=utf-8');
            });
        });
    });
});
