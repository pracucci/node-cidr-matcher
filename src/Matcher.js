var ip6addr = require('ip6addr');


var Matcher = function(classes) {
    classes = classes || [];

    // Init
    this.ranges = [];

    // Import network classes
    for (var i = 0; i < classes.length; i++) {
        this.addNetworkClass(classes[i]);
    }
};

Matcher.prototype.addNetworkClass = function(input) {
    var cidr    = ip6addr.createCIDR(input);
    var v4First = null;
    var v4Last  = null;

    // Try to get the first and last IPv4 in the range (it will throw
    // an Error if the CIDR it's outside the IPv4 network space)
    try {
        v4First = cidr.address().toLong();
        v4Last  = cidr.broadcast().toLong();
    } catch(ignored) {}

    // Add range
    this.ranges.push({
        cidr:    cidr,
        v4First: v4First,
        v4Last:  v4Last
    });
};

Matcher.prototype.contains = function(addr) {
    // Parse input address
    try {
        addr = ip6addr.parse(addr);
    } catch(err) {
        return false;
    }

    // Optimization: if it's an IPv4, we compare only the numeric version
    // of the first/last address. We wrap it in a try/catch because addr.toLong()
    // may throw an exception (even if it shouldn't because we check the kind())
    if (addr.kind() === "ipv4") {
        try {
            var numericAddr = addr.toLong();

            for (var i = 0, length = this.ranges.length; i < length; i++) {
                var range = this.ranges[i];

                if (range.v4First !== null && range.v4Last !== null && range.v4First <= numericAddr && range.v4Last >= numericAddr) {
                    return true;
                }
            }

            return false;
        } catch(ignored) {}
    }

    // Fallback to the slower comparison using the native methods
    // provided by the ip6addr module
    for (var i = 0, length = this.ranges.length; i < length; i++) {
        if (this.ranges[i].cidr.contains(addr)) {
            return true;
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
