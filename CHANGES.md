# Changes

### 2019-07-17 2.1.1
 - Upgraded `mocha`, addressing [code injection vulnerability](https://www.npmjs.com/advisories/813)

### 2019-02-20 2.1.0
 - Optimized IPv4 address against IPv4 CIDRs by a 20x factor

### 2019-02-20 2.0.0
 - **BREAKING CHANGE**: a network class must always be in CIDR notation (ending with `/number`) otherwise will throw an `Error`
 - **BREAKING CHANGE**: removed `Matcher.removeNetworkClass()`
 - Added IPv6 support to `Matcher`
 - Replaced `ip` module dependency with `ip6addr`

### 2017-03-30 1.0.5
 - IMPROVEMENT: replaced `chai` with `assert`, reducing devDependencies size (see [issue #4](https://github.com/pracucci/node-cidr-matcher/issues/4) - thanks to [christian-fei](https://github.com/christian-fei))

### 2017-03-30 1.0.4
 - FIX: correctly handle `0.0.0.0` IP address

### 2016-02-19 1.0.3
 - FIX: network and Broadcast addresses should match (issue #1)
