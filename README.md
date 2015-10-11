
# ReactiveMap for Meteor

**Table of contents**

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage](#usage)

## Introduction

The ReactiveMap package introduces a reactive version of the JavaScript [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map) container.

## Installation

```sh
$ meteor add jagi:reactive-map
```

## Usage

All methods are reactive. Values are stored in the original form, so you can also store functions and objects with functions. Objects are stored as references.

```js
var map = new ReactiveMap();
// Or
var map = new ReactiveMap({
  key1: 'value1',
  key2: 'value2'
});

map.set('key', 'value');
map.set({
  key1: 'value1',
  key2: 'value2'
});

map.get('key'); // Returns "value".

map.entries(); // Returns [['key1', 'value1'], ['key2', 'value2']].

map.all(); // Returns {key: "value", key1: "value1", key2: "value2"}.

map.keys(); // Returns ['key', 'key1', 'key2'].

map.values(); // Returns ['value', 'value1', 'value2'].

map.size(); // Returns 3.

map.has('key'); // Return true.

map.delete('key'); // Deletes "key".

map.clear(); // Clears map.
```
