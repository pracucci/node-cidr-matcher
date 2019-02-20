# CIDR Matcher

Fast CIDR matcher. Given an input IPv4 or IPv6 address, it checks if it's inside a set of IP ranges, expressed in CIDR notation. This module is based upon the great [ip6addr](https://github.com/joyent/node-ip6addr) module.


## Installation

###  npm
```shell
npm install cidr-matcher
```

### git

```shell
git clone https://github.com/pracucci/node-cidr-matcher.git
```


## Usage

```js

var CIDRMatcher = require('cidr-matcher');

var matcher = new CIDRMatcher([ '2a05:d07c:2000:0:0:0:0:0/120', '192.168.1.0/24', '192.168.2.3/32', '192.168.3.2/32' ]);

matcher.contains('192.168.1.1'); // returns true
matcher.contains('192.168.1.2'); // returns true

matcher.contains('192.168.2.1'); // returns true
matcher.contains('192.168.2.2'); // returns false

matcher.contains('192.168.3.1'); // returns false
matcher.contains('192.168.3.2'); // returns false

matcher.containsAny([ '192.168.1.1', '192.168.1.2' ]); // return true
matcher.containsAny([ '192.168.2.1', '192.168.2.2' ]); // return true
matcher.containsAny([ '192.168.3.1', '192.168.3.2' ]); // return false

assert.ok(matcher.contains('2a05:d07c:2000:0:0:0:0:0'));  // return true
assert.ok(matcher.contains('2a05:d07c:2000:0:0:0:0:ff')); // return true
assert.ok(matcher.contains('2a05:d07c:3000:0:0:0:0:0'));  // return false

// You can also add / remove network classes on-the-fly
matcher.addNetworkClass('192.168.5.0/24');
matcher.contains('192.168.5.1'); // returns true

matcher.removeNetworkClass('192.168.5.0/24');
matcher.contains('192.168.5.1'); // returns false
```


## Benchmark

The following table shows the execution of `benchmark/` across different versions of this module and other modules you can find on npm. Each benchmark is **executed with a random set of 25000 IP addresses**, where each IP is checked against each network range (CIDR) in the test dataset.

| Module           | Version | Dataset               | Execution time |
| ---------------- | ------- | --------------------- | -------------- |
| _This one_       | `2.0.0` | AWS IPv4 (1385 CIDRs) | `228 ms`       |
| _This one_       | `2.0.0` | AWS IPv6 (474 CIDRs)  | `1799 ms`      |
| _This one_       | `1.0.5` | AWS IPv4 (1385 CIDRs) | `2895 ms` (_without IPv4 over IPv6 support_) |
| _This one_       | `1.0.5` | AWS IPv6 (474 CIDRs)  | _Unsupported_  |
| `is-in-subnet`   | `1.9.0` | AWS IPv4 (1385 CIDRs) | `96106 ms`     |
| `is-in-subnet`   | `1.9.0` | AWS IPv6 (474 CIDRs)  | `33482 ms`     |
| `ip-range-check` | `0.0.2` | AWS IPv4 (1385 CIDRs) | `390134 ms`    |
| `ip-range-check` | `0.0.2` | AWS IPv6 (474 CIDRs)  | `73083 ms`     |

_If you're aware of any other module that implements the IP in CIDR and you wanna see it benchmarked, please open an Issue or submit a PR._


## Contribute

### Run tests

```shell
npm test
```


### License

This software is licensed under the MIT License.

Copyright (c) 2015, Marco Pracucci <marco@pracucci.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
