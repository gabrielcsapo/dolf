# optics

> 🕶  diffing strings with expert vision


[![Npm Version](https://img.shields.io/npm/v/optics.svg)](https://www.npmjs.com/package/optics)
[![Build Status](https://travis-ci.org/gabrielcsapo/optics.svg?branch=master)](https://travis-ci.org/gabrielcsapo/optics)
[![Coverage Status](https://lcov-server.gabrielcsapo.com/badge/github%2Ecom/gabrielcsapo/optics.svg)](https://lcov-server.gabrielcsapo.com/coverage/github%2Ecom/gabrielcsapo/optics)
[![Dependency Status](https://starbuck.gabrielcsapo.com/badge/github/gabrielcsapo/optics/status.svg)](https://starbuck.gabrielcsapo.com/github/gabrielcsapo/optics)
[![devDependency Status](https://starbuck.gabrielcsapo.com/badge/github/gabrielcsapo/optics/dev-status.svg)](https://starbuck.gabrielcsapo.com/github/gabrielcsapo/optics#info=devDependencies)
[![npm](https://img.shields.io/npm/dt/optics.svg)]()
[![npm](https://img.shields.io/npm/dm/optics.svg)]()

## TOC

<!-- TOC depthFrom:3 depthTo:6 withLinks:1 updateOnSave:1 orderedList:0 -->

- [Installation](#installation)
- [Usage](#usage)
	- [diff](#diff)
			- [arguments](#arguments)
			- [returns](#returns)
		- [Usage](#usage)
	- [splitDiff](#splitdiff)
		- [Usage](#usage)
	- [combinedDiff](#combineddiff)
		- [Usage](#usage)

<!-- /TOC -->

### Installation

```
npm install optics --save
```

### Usage

```js
const Optics = require('optics');

const source = `
  hello world

  how are you?

  what is up?
`

const patch = `
  hello world

  you are who?

  what is up?
`

const _diff = new Optics(source, patch)
```

Given an Optics instance you can now do the following to view it.

- splitDiff
- combinedDiff
- diff

#### diff

> diff takes the following arguments passed an object
 >`{ isCondensed = false, padding = 4 }`

###### arguments
- isCondensed (boolean): this controls if the diff output is trimmed of unnecessary text that hasn't chnaged or not.
- padding (integer): this is used if isCondensed is set to true to control how much of that unnecessary is preserved in the output.
###### returns
- combined (string): a combined view of both removed and added values to the string
- removed (string): only outputs the removed values and the original values of the diff
- added (string): only outputs the added values and the original values of the diff
- totalLines (integer): the total number of lines (the max value between patch and source in order to get an even output)
- maxLineLength (integer): the longest string value

##### Usage

```js
const _diff = new Optics(source, patch);

_diff.diff({ isCondensed: true, padding: 7 })
```

#### splitDiff

> takes the same arguments that [diff](#diff) does.

##### Usage

```js
const _diff = new Optics(source, patch);

_diff.splitDiff({ isCondensed: true, padding: 7 });
```

> outputs (ansii colors will output if your output supports it)

```
[0]                         | [0]                            
[1]            hello world  | [1]            hello world     
[2]                         | [2]                            
[3] -          how are you? | [3] +          you are who?
[4]                         | [4]                            
[5]            what is up?  | [5]            what is up?     
[6]                         | [6]                            
```

#### combinedDiff

> takes the same arguments that [diff](#diff) does.


##### Usage

```js
const _diff = new Optics(source, patch);

_diff.combinedDiff({ isCondensed: true, padding: 7 });
```

> outputs (ansii colors will output if your output supports it)

```
[0]    
[1]            hello world
[2]    
[3] -          how are you?
[3] +          you are who?
[4]    
[5]            what is up?
[6]    
```
