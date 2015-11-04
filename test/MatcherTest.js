var assert  = require('chai').assert,
    Matcher = require('../src/Matcher.js');


describe('Matcher', function() {

    describe('contains()', function() {

        it('should return true if an IPv4 matches a single IP address', function() {
            var matcher = new Matcher([ '192.168.1.2' ]);

            assert.ok(!matcher.contains('192.168.1.1'));
            assert.ok(matcher.contains('192.168.1.2'));
            assert.ok(!matcher.contains('192.168.1.3'));
        });

        it('should return true if an IPv4 matches a /32 network range', function() {
            var matcher = new Matcher([ '192.168.1.2/32' ]);

            assert.ok(!matcher.contains('192.168.1.1'));
            assert.ok(matcher.contains('192.168.1.2'));
            assert.ok(!matcher.contains('192.168.1.3'));
        });

        it('should return true if an IPv4 matches a /30 network range', function() {
            var matcher = new Matcher([ '192.168.1.0/30' ]);

            assert.ok(!matcher.contains('192.168.0.1'));

            // TODO assert.ok(matcher.contains('192.168.1.0'));
            assert.ok(matcher.contains('192.168.1.1'));
            assert.ok(matcher.contains('192.168.1.2'));
            // TODO assert.ok(matcher.contains('192.168.1.3'));
            assert.ok(!matcher.contains('192.168.1.4'));
        });

        it('should return true if an IPv4 matches a /24 network range', function() {
            var matcher = new Matcher([ '192.168.1.0/24' ]);

            assert.ok(!matcher.contains('192.168.0.1'));
            assert.ok(!matcher.contains('192.168.0.254'));

            assert.ok(!matcher.contains('192.168.2.1'));
            assert.ok(!matcher.contains('192.168.2.254'));

            assert.ok(matcher.contains('192.168.1.1'));
            assert.ok(matcher.contains('192.168.1.128'));
            assert.ok(matcher.contains('192.168.1.254'));
        });

        it('should return true if an IPv4 matches a /16 network range', function() {
            var matcher = new Matcher([ '192.168.1.0/16' ]);

            assert.ok(matcher.contains('192.168.0.1'));
            assert.ok(matcher.contains('192.168.0.254'));

            assert.ok(matcher.contains('192.168.128.1'));
            assert.ok(matcher.contains('192.168.128.254'));

            assert.ok(matcher.contains('192.168.255.1'));
            assert.ok(matcher.contains('192.168.255.254'));

            assert.ok(!matcher.contains('192.167.0.1'));
            assert.ok(!matcher.contains('192.169.0.1'));
        });

        it('should return true if an IPv4 matches multiple /32 network ranges', function() {
            var matcher = new Matcher([ '192.168.1.3/32', '192.168.1.2/32' ]);

            assert.ok(!matcher.contains('192.168.1.1'));
            assert.ok(matcher.contains('192.168.1.2'));
            assert.ok(matcher.contains('192.168.1.3'));
            assert.ok(!matcher.contains('192.168.1.4'));
        });

        it('should return true if an IPv4 matches network ranges', function() {
            var matcher = new Matcher([ '192.168.1.0/24', '192.168.2.3/32', '192.168.3.2/32' ]);

            assert.ok(matcher.contains('192.168.1.1'));
            assert.ok(matcher.contains('192.168.1.2'));
            assert.ok(matcher.contains('192.168.1.3'));

            assert.ok(!matcher.contains('192.168.2.1'));
            assert.ok(!matcher.contains('192.168.2.2'));
            assert.ok(matcher.contains('192.168.2.3'));

            assert.ok(!matcher.contains('192.168.3.1'));
            assert.ok(matcher.contains('192.168.3.2'));
            assert.ok(!matcher.contains('192.168.3.3'));
        });

        it('should return true if an IPv4 matches overlapping network ranges', function() {
            var matcher = new Matcher([ '192.168.1.0/24', '192.168.1.3/32', '192.168.1.2/32' ]);

            assert.ok(!matcher.contains('192.168.0.1'));
            assert.ok(!matcher.contains('192.168.0.254'));

            assert.ok(!matcher.contains('192.168.2.1'));
            assert.ok(!matcher.contains('192.168.2.254'));

            assert.ok(matcher.contains('192.168.1.1'));
            assert.ok(matcher.contains('192.168.1.2'));
            assert.ok(matcher.contains('192.168.1.3'));
            assert.ok(matcher.contains('192.168.1.128'));
            assert.ok(matcher.contains('192.168.1.254'));
        });
    });


    describe('containsAny()', function() {

        it('should return true if any of input IPv4 addresses matches ranges', function() {
            var matcher = new Matcher([ '192.168.1.0/24', '192.168.2.3/32', '192.168.3.2/32' ]);

            assert.ok(!matcher.containsAny([ '192.168.2.1' ]));
            assert.ok(!matcher.containsAny([ '192.168.2.1', '192.168.3.3' ]));

            assert.ok(matcher.containsAny([ '192.168.2.1', '192.168.3.3', '192.168.2.3' ]));
        });
    });


    describe('addNetworkClass()', function() {

        it('should add a cidr to the matcher', function() {
            var matcher = new Matcher();
            assert.ok(!matcher.contains('192.168.1.3'));

            matcher.addNetworkClass('192.168.1.1/24');
            assert.ok(matcher.contains('192.168.1.3'));
        });
    });


    describe('removeNetworkClass()', function() {

        it('should remove a previously added cidr from the matcher', function() {
            var matcher = new Matcher(['192.168.1.1/24']);
            assert.ok(matcher.contains('192.168.1.3'));

            matcher.removeNetworkClass('192.168.1.1/24');
            assert.ok(!matcher.contains('192.168.1.3'));
        });
    });

});
