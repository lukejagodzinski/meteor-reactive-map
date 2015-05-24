
# ReactiveMap for Meteor

## Table of Contents

- [About](#about)
- [Installation](#installation)
- [Usage](#usage)

## About

## Installation

```sh
$ meteor add jagi:reactive-map
```

## Usage

```js
var map = new ReactiveMap();

map.set('key', 'value');
map.set({
  key1: 'value1',
  key2: 'value2'
});

map.get('key'); // Returns "value".

map.all(); // Returns { key: "value", key1: "value1", key2: "value2" }.

map.size; // Returns 3.

map.has('key'); // Return true.

map.delete('key'); // Deletes "key".

map.clear(); // Clears map.
```
