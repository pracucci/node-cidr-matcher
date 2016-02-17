var ip = require('ip');


var Matcher = function(classes) {
    classes = classes || [];

    // Init
    this.ranges = {};

    // Import network classes
    for (var i = 0; i < classes.length; i++) {
        this.addNetworkClass(classes[i]);
    }
};

Matcher.prototype.addNetworkClass = function(cidr) {
    // Ensure the input string is a CIDR
    if (ip.isV4Format(cidr)) {
        cidr += '/32';
    }

    // Check if already added
    if (this.ranges[cidr]) {
        return;
    }

    var info = ip.cidrSubnet(cidr);

    // Add
    if (info) {
        this.ranges[cidr] = [ ip.toLong(info.networkAddress), ip.toLong(info.broadcastAddress) ];
    }
};

Matcher.prototype.removeNetworkClass = function(cidr) {
    if (!cidr) {
        return false;
    }

    // Remove
    delete this.ranges[cidr];
};

Matcher.prototype.contains = function(addr) {
    // Convert to decimal
    addr = ip.toLong(addr);
    if (!addr) {
        return false;
    }

    for (var i in this.ranges) {
        if (this.ranges.hasOwnProperty(i) && addr >= this.ranges[i][0] && addr <= this.ranges[i][1]) {
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
