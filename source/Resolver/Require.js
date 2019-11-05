const Path = require('path');
const AbstractResolver = require('../Abstract/Resolver.js');
const DirectoryEntries = require('../ValueObject/DirectoryEntries.js');

const storage = new WeakMap();

/**
 * Resolver for a all require-able modules
 *
 * @class RequireResolver
 * @extends {AbstractResolver}
 */
class RequireResolver extends AbstractResolver {
	/**
	 * Creates an instance of RequireResolver
	 *
	 * @param {string} [path]
	 * @memberof RequireResolver
	 */
	constructor(...path) {
		super(...path);

		const location = Path.normalize(Path.join(...path));

		storage.set(this, { entries: DirectoryEntries.from(location) });
	}

	/**
	 * Load the most appropriate file or create a (nested) RequireResolver
	 *
	 * @param {string} key
	 * @returns {*|RequireResolver} resolved
	 * @memberof RequireResolver
	 */
	use(key) {
		const { path } = this;
		const { entries } = storage.get(this);
		const match = key.match(this);
		const file = entries.findOne(
			(entry) => entry.isFile() && entry.name === match
		);

		return file ? require(Path.join(...path, match)) : super.use(key);
	}

	/**
	 * Does the resolver match the input
	 *
	 * @param {string} key
	 * @returns {string} matched?
	 * @memberof RequireResolver
	 */
	match(key) {
		if (typeof key !== 'string') {
			return;
		}

		const { entries } = storage.get(this);
		const { path } = this;

		try {
			return Path.relative(
				Path.join(...path),
				require.resolve(Path.join(...path, key))
			);
		} catch (e) {}

		return entries.findOne(
			(entry) => entry.isDirectory() && entry.name === key
		);
	}

	/**
	 * Symbol.iterator generator implementation, listing all directory entry names
	 *
	 * @memberof RequireResolver
	 */
	*[Symbol.iterator]() {
		const { entries } = storage.get(this);

		for (const entry of entries) {
			yield entry.name;
		}
	}
}

module.exports = RequireResolver;
