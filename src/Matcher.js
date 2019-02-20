var ip6addr = require('ip6addr');


var Matcher = function(classes) {
    classes = classes || [];

    // Init
    this.ranges = {
        "ipv4": [],
        "ipv6": [],
    };

    // Import network classes
    for (var i = 0; i < classes.length; i++) {
        this.addNetworkClass(classes[i]);
    }
};

Matcher.prototype.addNetworkClass = function(input) {
    var cidr = ip6addr.createCIDR(input);

    // Detect if the input network class fits in the IPv4 address space.
    // If it doesn't an Error will be thrown and we'll add it to the IPv6
    // ranges in the catch block.
    try {
        var firstNumericAddr = cidr.address().toLong();
        var lastNumericAddr  = cidr.broadcast().toLong();

        this.ranges["ipv4"].push({
            cidr:  cidr,
            first: firstNumericAddr,
            last:  lastNumericAddr,
        });
    } catch(err) {
        // We've been unable to convert first/last address it to Long,
        // so it means it spans over the IPv6 address space
        this.ranges["ipv6"].push({
            cidr: cidr
        });
    }
};

Matcher.prototype.contains = function(addr) {
    // Parse input address
    try {
        addr = ip6addr.parse(addr);
    } catch(err) {
        return false;
    }

    var ipv4Ranges = this.ranges["ipv4"];
    var ipv6Ranges = this.ranges["ipv6"];

    // Check if the input address is within any IPv4 network range.
    // We detect if the input address is an IPv4. If yes, we can run an optimized
    // version which compares the IPv4 network ranges by numeric comparison.
    if (ipv4Ranges.length > 0) {
        if (addr.kind() === "ipv4") {
            var numericAddr = addr.toLong();

            for (var i = 0, length = ipv4Ranges.length; i < length; i++) {
                if (ipv4Ranges[i].first <= numericAddr && ipv4Ranges[i].last >= numericAddr) {
                    return true;
                }
            }
        } else {
            for (var i = 0, length = ipv4Ranges.length; i < length; i++) {
                if (ipv4Ranges[i].cidr.contains(addr)) {
                    return true;
                }
            }
        }
    }

    // Check if the input address is within any IPv6 network range
    if (ipv6Ranges.length > 0) {
        for (var i = 0, length = ipv6Ranges.length; i < length; i++) {
            if (ipv6Ranges[i].cidr.contains(addr)) {
                return true;
            }
        }
    }

    return false;
};

Matcher.prototype.containsAny = function(addrs) {
    for (var i in addrs) {
        if (addrs.hasOwnProperty(i) && this.contains(addrs[i])) {
            return true;
        }
    }

    return false;
};

module.exports = Matcher;
