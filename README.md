# CIDR Matcher

Fast CIDR matcher. Given an input IPv4 address, it checks if it's inside a set of IP ranges, expressed in CIDR notation. This module is based upon the great [node-ip](https://github.com/indutny/node-ip.git) module.


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

var matcher = new CIDRMatcher([ '192.168.1.0/24', '192.168.2.1/32' ]);

matcher.contains('192.168.1.1'); // returns true
matcher.contains('192.168.1.2'); // returns true

matcher.contains('192.168.2.1'); // returns true
matcher.contains('192.168.2.2'); // returns false

matcher.contains('192.168.3.1'); // returns false
matcher.contains('192.168.3.2'); // returns false

matcher.containsAny([ '192.168.1.1', '192.168.1.2' ]); // return true
matcher.containsAny([ '192.168.2.1', '192.168.2.2' ]); // return true
matcher.containsAny([ '192.168.3.1', '192.168.3.2' ]); // return false


// You can also add / remove network classes on-the-fly
matcher.addNetworkClass('192.168.5.0/24');
matcher.contains('192.168.5.1'); // returns true

matcher.removeNetworkClass('192.168.5.0/24');
matcher.contains('192.168.5.1'); // returns false
```


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
