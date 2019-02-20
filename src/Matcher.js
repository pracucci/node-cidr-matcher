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
    var cidr = ip6addr.createCIDR(input);

    // Add range
    this.ranges.push(cidr);
};

Matcher.prototype.contains = function(addr) {
    // Parse input address
    try {
        addr = ip6addr.parse(addr);
    } catch(err) {
        return false;
    }

    // Fallback to the slower comparison using the native methods
    // provided by the ip6addr module
    for (var i = 0, length = this.ranges.length; i < length; i++) {
        if (this.ranges[i].contains(addr)) {
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
