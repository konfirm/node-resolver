# Resolver

Resolver implementations to traverse into structured information

## Installation

`@konfirm/resolver` is a scoped package, which means the scope must be provided for both installation and usage.

### Using [npm][1]

```
$ npm install --save @konfirm/resolver
```

### Using [yarn][2]

```
$ yarn add @konfirm/resolver
```

## Exports

The Resolve module is an object with various exposed classes

| name               | purpose                                                                    |
| ------------------ | -------------------------------------------------------------------------- |
| `AbstractResolver` | Abstract implementation of Resolver, providing the base implementation     |
| `VirtualResolver`  | Implementation which matches everything                                    |
| `RequireResolver`  | Implementation to resolve directories and all files that can be `require`d |

## Usage

A resolver can be used to determine whether a given key can be used reached through traversal. It is up to the implementation to provide meaning to what it is that is resolved.

A tangible resolver is the `RequireResolver`, which is allows for traversal of the filesystem and ultimately the inclusion of files through `require`.

```js
const Path = require('path');
const { RequireResolver } = require('@konfirm/resolver');
const root = new RequireResolve(process.cwd());

//  for this example, a config/application.js file is assumed

//  determine if a directory or (requireable) file exists with the name 'config'
if (root.match('config')) {
	//  'config' exists, so we can use it
	const config = root.use('config');

	//  determine if a directory or (requireable) file exists with the name 'application'
	if (config.match('application')) {
		const application = config.use('application');

		//  the application variable now contains the required config/application.js
	}
}
```

As the Resolvers are able to test whether the provided key is usable, it opens up to the possibility to easily implement traversal mechanisms.

```js
const Path = require('path');
const { RequireResolver } = require('@konfirm/resolver');
const root = new RequireResolve(process.cwd());

function resolve(resolver, path) {
	return path.split(Path.sep).reduce((carry, key) => {
		if (carry && carry.match(key)) {
			return carry.use(key);
		}

		return null;
	}, resolver);
}

const root = new RequireResolver(process.cwd());
const application = resolve(root, 'config/application');
```

## API

All exported Resolvers provide the same base; AbstractResolver

### AbstractResolver

#### `constructor(...path)`

Creates an instance of AbstractResolver. The meaning of `path` and the validity of the values may differ per implementation.

#### `get path`

The path of the Resolver. It reflects the path as it was provided during construction, in order to prevent runtime manipulation the return path is a `slice` of what is stored, which means it cannot be compared using the shallow equality operator (`===`).

#### `use(key)`

Create a new Resolver for the given key. A new instance using the current path + the provided key is created. By default the result is a new instance of the Resolver it was used on.

#### `match(key)`

Can the resolver match the key. Verify whether the provided key can be used to create a new Resolver. The default implementation always results in `undefined`, meaning `use` should not be called.

```js
if (resolver.match('key')) {
	//  able to invoke resolver.use('key')
}
```

#### `[Symbol.match](key)`

[`Symbol.match`][3] implementation. This allows for using the Resolver as argument of a `string` key using [`key.match(resolver)`][4].

_NOTE_ This will only work on keys of type `string`, if you cannot be sure of string values, use `resolver.match` instead.

```js
if ('key'.match(resolver)) {
	//  able to invoke resolver.use('key')
}
```

#### `*[Symbol.iterator]()`

[`Symbol.iterator`][5] generator implementation. Allows the Resolver to be used in a [`for...of`][7] loop. The default implementation does not `yield` any value.

```js
for (const value of resolver) {
	// do something with value
}

//  or, using destructuring
const values = [...resolver];
```

_NOTE_ it is important to look at the implementation specifics on what values are yielded (if any).

### `VirtualResolver`

Unless otherwise stated, the `VirtualResolver` API does not override the `AbstractResolver` implementation.

#### `match(key)`

All keys given to a `VirtualResolver` will be returned as is, therefor allowing everything thrown at it.

```js
console.log(resolver.match('key')); // key
```

#### `[Symbol.match](key)`

As the default `[Symbol.match]` implementation uses the `match` method under the hood, all `string` keys will be matched in full.

```js
console.log('key'.match(resolver)); // key
```

### `RequireResolver`

Unless otherwise stated, the `RequireResolver` API does not override the `AbstractResolver` implementation.

#### `use(key)`

If the key refers to a directory and no file with precedence (according to `require`) exists, calling `use` will create a new `RequireResolver` pointing to that directory. If a file takes precedence the return value of `use` will return the required file.

#### `match(key)`

Try to match the provided key to the path associated with the `RequireResolver`, if a file takes precedence (according to `require`), the name of that file is returned. If there's no matched, `undefined` is returned.

#### `[Symbol.match](key)`

As the default `[Symbol.match]` implementation uses the `match` method under the hood, all `string` keys will provide the full file name that can be used.

#### `*[Symbol.iterator]()`

As any `RequireResolver` instance basically reflects a directory, the iterator implementation can (and will) list all directory entry names as `string` value

## License

MIT License Copyright (c) 2019 Rogier Spieker (Konfirm)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

[1]: https://www.npmjs.com/get-npm
[2]: https://yarnpkg.com/
[3]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/match
[4]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match
[5]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator
[7]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
