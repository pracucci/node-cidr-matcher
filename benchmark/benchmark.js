const CIDRMatcherMaster = require("../src/Matcher");
const CIDRMatcher105    = require("cidr-matcher");
const { isInSubnet }    = require("is-in-subnet");
const ipRangeCheck      = require("ip-range-check");


function generateRandomIPv4() {
    return "" +
        Math.floor(Math.random() * 255) + "." +
        Math.floor(Math.random() * 255) + "." +
        Math.floor(Math.random() * 255) + "." +
        Math.floor(Math.random() * 255);
}

function generateRandomIPv6() {
    const parts = [... new Array(8)].map(() => {
        return Number(Math.floor(Math.random() * 65535)).toString(16);
    });

    return parts.join(":");
}

function trackExecutionTimeMs(func) {
    const startTime = process.hrtime();

    func();

    const elapsedTime   = process.hrtime(startTime);
    const elapsedTimeMs = (elapsedTime[0] * 1000) + Math.round(elapsedTime[1] / 1000000);

    return elapsedTimeMs;
}


// Load Amazon CIDRs
const cidrsV4 = require("./amazon-cidrs.json").prefixes.map((item) => item.ip_prefix);
const cidrsV6 = require("./amazon-cidrs.json").ipv6_prefixes.map((item) => item.ipv6_prefix);

// Generate input fixtures
const numFixtures = 25000;
const randomV4Set = [... new Array(numFixtures)].map(() => generateRandomIPv4());
const randomV6Set = [... new Array(numFixtures)].map(() => generateRandomIPv6());


// Print datasets info
console.log("DATASETS");
console.log(`- ipv4: contains ${cidrsV4.length} CIDRs`);
console.log(`- ipv6: contains ${cidrsV6.length} CIDRs`);
console.log("");

// Run benchmark
function runBenchmark(moduleName, moduleVersion, datasetName, func) {
    const cidrs = datasetName === "ipv4" ? cidrsV4 : cidrsV6;
    const ips   = datasetName === "ipv4" ? randomV4Set : randomV6Set;

    const executionTime = trackExecutionTimeMs(() => {
        func(cidrs, ips);
    });

    console.log(`${moduleName} v. ${moduleVersion} against ${datasetName} dataset: ${executionTime} ms`);
}

console.log("BENCHMARK");

runBenchmark("node-cidr-matcher", "master", "ipv4", (cidrs, ips) => {
    let matcher = new CIDRMatcherMaster(cidrs);
    for (let i = 0; i < ips.length; i++) {
        matcher.contains(ips[i]);
    }
});

runBenchmark("node-cidr-matcher", "1.0.5", "ipv4", (cidrs, ips) => {
    let matcher = new CIDRMatcher105(cidrs);
    for (let i = 0; i < ips.length; i++) {
        matcher.contains(ips[i]);
    }
});

runBenchmark("node-cidr-matcher", "master", "ipv6", (cidrs, ips) => {
    let matcher = new CIDRMatcherMaster(cidrs);
    for (let i = 0; i < ips.length; i++) {
        matcher.contains(ips[i]);
    }
});

runBenchmark("is-in-subnet", "1.9.0", "ipv4", (cidrs, ips) => {
    for (let i = 0; i < ips.length; i++) {
        isInSubnet(ips[i], cidrs);
    }
});

runBenchmark("is-in-subnet", "1.9.0", "ipv6", (cidrs, ips) => {
    for (let i = 0; i < ips.length; i++) {
        isInSubnet(ips[i], cidrs);
    }
});

runBenchmark("ip-range-check", "0.0.2", "ipv4", (cidrs, ips) => {
    for (let i = 0; i < ips.length; i++) {
        ipRangeCheck(ips[i], cidrs);
    }
});

runBenchmark("ip-range-check", "0.0.2", "ipv6", (cidrs, ips) => {
    for (let i = 0; i < ips.length; i++) {
        ipRangeCheck(ips[i], cidrs);
    }
});
