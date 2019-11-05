const storage = new WeakMap();

/**
 * Abstract Resolver implementation
 *
 * @class AbstractResolver
 */
class AbstractResolver {
	/**
	 * Creates an instance of AbstractResolver
	 *
	 * @param {*} [path]
	 * @memberof AbstractResolver
	 */
	constructor(...path) {
		storage.set(this, { path });
	}

	/**
	 * The normalized path of the Resolver
	 *
	 * @readonly
	 * @memberof AbstractResolver
	 */
	get path() {
		const { path } = storage.get(this);

		return path.slice();
	}

	/**
	 * Create a new Resolver for the given key
	 *
	 * @param {string} key
	 * @returns {AbstractResolver} resolver
	 * @memberof AbstractResolver
	 */
	use(key) {
		const { path, constructor: Ctor } = this;

		return new Ctor(...path, key);
	}

	/**
	 * Does the resolver match with the key
	 *
	 * @param {*} key
	 * @memberof AbstractResolver
	 */
	match(key) {}

	/**
	 * Symbol.match implementation
	 *
	 * @param {string} input
	 * @returns {undefined} no match
	 * @memberof AbstractResolver
	 */
	[Symbol.match](input) {
		return this.match(input);
	}

	/**
	 * Symbol.iterator generator implementation
	 *
	 * @memberof AbstractResolver
	 */
	*[Symbol.iterator]() {}
}

module.exports = AbstractResolver;
