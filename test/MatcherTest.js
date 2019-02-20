var assert  = require('assert'),
    Matcher = require('../src/Matcher.js');

describe('Matcher', function() {

    describe('contains()', function() {

        it('should return false with a bad input address', function() {
            var matcher = new Matcher([ '192.168.1.2/32', '2a05:d07c:2000::/40' ]);

            assert.ok(!matcher.contains('0.0.0.192.168.1.2'));
            assert.ok(!matcher.contains('xxx:d07c:2000::'));
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

            assert.ok(matcher.contains('192.168.1.0'));
            assert.ok(matcher.contains('192.168.1.1'));
            assert.ok(matcher.contains('192.168.1.2'));
            assert.ok(matcher.contains('192.168.1.3'));
            assert.ok(!matcher.contains('192.168.1.4'));
        });

        it('should return true if an IPv4 matches a /24 network range', function() {
            var matcher = new Matcher([ '192.168.1.0/24' ]);

            assert.ok(!matcher.contains('192.168.0.1'));
            assert.ok(!matcher.contains('192.168.0.254'));

            assert.ok(!matcher.contains('192.168.2.1'));
            assert.ok(!matcher.contains('192.168.2.254'));

            assert.ok(matcher.contains('192.168.1.0'));
            assert.ok(matcher.contains('192.168.1.1'));
            assert.ok(matcher.contains('192.168.1.128'));
            assert.ok(matcher.contains('192.168.1.254'));
            assert.ok(matcher.contains('192.168.1.255'));
        });

        it('should return true if an IPv4 matches a /16 network range', function() {
            var matcher = new Matcher([ '192.168.1.0/16' ]);

            assert.ok(matcher.contains('192.168.0.0'));
            assert.ok(matcher.contains('192.168.0.1'));
            assert.ok(matcher.contains('192.168.0.254'));

            assert.ok(matcher.contains('192.168.128.1'));
            assert.ok(matcher.contains('192.168.128.254'));

            assert.ok(matcher.contains('192.168.255.1'));
            assert.ok(matcher.contains('192.168.255.254'));
            assert.ok(matcher.contains('192.168.255.255'));

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

        it('should return true if an IPv4 matches a 0.0.0.0 range', function() {
            var matcher = new Matcher([ '0.0.0.0/24' ]);

            assert.ok(!matcher.contains('192.168.2.1'));
            assert.ok(!matcher.contains('192.168.2.254'));

            assert.ok(matcher.contains('0.0.0.0'));
            assert.ok(matcher.contains('0.0.0.10'));
            assert.ok(matcher.contains('0.0.0.254'));
        });

        it('should return true if an IPv6 matches a /128 network range', function() {
            var matcher = new Matcher([ '2a05:d07c:2000:0:0:0:0:1/128' ]);

            assert.ok(!matcher.contains('2a05:d07c:2000:0:0:0:0:0'));
            assert.ok(matcher.contains('2a05:d07c:2000:0:0:0:0:1'));
            assert.ok(!matcher.contains('2a05:d07c:2000:0:0:0:0:2'));
        });

        it('should return true if an IPv6 matches a /120 network range', function() {
            var matcher = new Matcher([ '2a05:d07c:2000:0:0:0:0:1/120' ]);

            assert.ok(matcher.contains('2a05:d07c:2000:0:0:0:0:0'));
            assert.ok(matcher.contains('2a05:d07c:2000:0:0:0:0:1'));
            assert.ok(matcher.contains('2a05:d07c:2000:0:0:0:0:ff'));
            assert.ok(!matcher.contains('2a05:d07c:2000:0:0:0:0:ffff'));
        });

        it('should return true if an IPv6 matches multiple /128 network ranges', function() {
            var matcher = new Matcher([ '2a05:d07c:2000:0:0:0:0:1/128', '2a05:d07c:2000:0:0:0:0:2/128' ]);

            assert.ok(!matcher.contains('2a05:d07c:2000:0:0:0:0:0'));
            assert.ok(matcher.contains('2a05:d07c:2000:0:0:0:0:1'));
            assert.ok(matcher.contains('2a05:d07c:2000:0:0:0:0:2'));
            assert.ok(!matcher.contains('2a05:d07c:2000:0:0:0:0:3'));
        });

        it('should return true if an IPv6 matches overlapping network ranges', function() {
            var matcher = new Matcher([ '2a05:d07c:2000:0:0:0:0:0/120', '2a05:d07c:2000:0:0:0:0:0/110' ]);

            assert.ok(!matcher.contains('2a05:d07c:2000:0:0:0:4:0'));

            assert.ok(matcher.contains('2a05:d07c:2000:0:0:0:0:0'));
            assert.ok(matcher.contains('2a05:d07c:2000:0:0:0:0:ff'));
            assert.ok(matcher.contains('2a05:d07c:2000:0:0:0:1:0'));
            assert.ok(matcher.contains('2a05:d07c:2000:0:0:0:3:ffff'));
        });

        it('should support mixed IPv4 and IPv6 network ranges', function() {
            var matcher = new Matcher([ '2a05:d07c:2000:0:0:0:0:0/120', '2a05:d07c:2000:0:0:0:0:0/110', '192.168.1.0/24', '192.168.2.3/32', '192.168.3.2/32' ]);

            assert.ok(!matcher.contains('2a05:d07c:2000:0:0:0:4:0'));

            assert.ok(matcher.contains('2a05:d07c:2000:0:0:0:0:0'));
            assert.ok(matcher.contains('2a05:d07c:2000:0:0:0:0:ff'));
            assert.ok(matcher.contains('2a05:d07c:2000:0:0:0:1:0'));
            assert.ok(matcher.contains('2a05:d07c:2000:0:0:0:3:ffff'));

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

        it('should support IPv4 detection in a IPv6 network range', function() {
            var matcher = new Matcher([ '0:0:0:0:0:ffff:102:304/128' ]);

            assert.ok(!matcher.contains('1.2.3.3'));
            assert.ok(matcher.contains('1.2.3.4'));
            assert.ok(!matcher.contains('1.2.3.5'));
        });

        it('should support IPv6 detection in a IPv4 network range', function() {
            var matcher = new Matcher([ '1.2.3.4/32' ]);

            assert.ok(!matcher.contains('0:0:0:0:0:ffff:102:303'));
            assert.ok(matcher.contains('0:0:0:0:0:ffff:102:304'));
            assert.ok(!matcher.contains('0:0:0:0:0:ffff:102:305'));
        });

        it('should support IPv4 detection in a IPv6 network range spanning outside the IPv4 space', function() {
            var matcher = new Matcher([ '0:0:0:0:0:0:0:0/64' ]);

            assert.ok(matcher.contains('0.0.0.0'));
            assert.ok(matcher.contains('255.255.255.255'));

            assert.ok(matcher.contains('0:0:0:0:0:0:0:0'));
            assert.ok(matcher.contains('0:0:0:0:ffff:ffff:ffff:ffff'));
            assert.ok(!matcher.contains('0:0:0:1000:ffff:ffff:ffff:ffff'));
        });
    });


    describe('containsAny()', function() {

        it('should return true if any of input IPv4 addresses matches ranges', function() {
            var matcher = new Matcher([ '192.168.1.0/24', '192.168.2.3/32', '192.168.3.2/32' ]);

            assert.ok(!matcher.containsAny([ '192.168.2.1' ]));
            assert.ok(!matcher.containsAny([ '192.168.2.1', '192.168.3.3' ]));

            assert.ok(matcher.containsAny([ '192.168.2.1', '192.168.3.3', '192.168.2.3' ]));
        });

        it('should return true if any of input IPv6 addresses matches ranges', function() {
            var matcher = new Matcher([ '2a05:d07c:2000::/40' ]);

            assert.ok(!matcher.containsAny([ '2a05:d07c:1000:0:0:0:0:0' ]));
            assert.ok(!matcher.containsAny([ '2a05:d07c:1000:0:0:0:0:0', '2a05:d07c:3000:0:0:0:0:0' ]));

            assert.ok(matcher.containsAny([ '2a05:d07c:1000:0:0:0:0:0', '2a05:d07c:2000:0:0:0:0:0', '2a05:d07c:3000:0:0:0:0:0' ]));
        });
    });


    describe('addNetworkClass()', function() {

        it('should add an IPv4 cidr to the matcher', function() {
            var matcher = new Matcher();
            assert.ok(!matcher.contains('192.168.1.3'));

            matcher.addNetworkClass('192.168.1.1/24');
            assert.ok(matcher.contains('192.168.1.3'));
        });

        it('should add an IPv6 cidr to the matcher', function() {
            var matcher = new Matcher();
            assert.ok(!matcher.contains('2a05:d07c:2000:0:0:0:0:1'));

            matcher.addNetworkClass('2a05:d07c:2000::/40');
            assert.ok(matcher.contains('2a05:d07c:2000:0:0:0:0:1'));
        });

        it('should throw an error if the input network class is not in the CIDR notation', function() {
            var matcher = new Matcher();

            try {
                matcher.addNetworkClass('192.168.1.2');
                fail("should throw an Error");
            } catch(err) {
                assert.equal("Invalid argument: <addr>/<prefix> expected", err.message);
            }
        });
    });

});
