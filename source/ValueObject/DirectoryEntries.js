const FS = require('fs');

const storage = new WeakMap();
const protect = Symbol('DirectoryEntries');

/**
 * Work with Dirent items obtained by fs.readdir(Sync)
 *
 * @class DirectoryEntries
 */
class DirectoryEntries {
	/**
	 * Creates an instance of DirectoryEntries
	 *
	 * @param {*} path
	 * @memberof DirectoryEntries
	 */
	constructor(path, symbol) {
		if (symbol !== protect) {
			const {
				constructor: { name }
			} = this;

			throw new Error(
				`${name} must be created using ${name}.from('${path}')`
			);
		}

		storage.set(this, { path });
	}

	/**
	 * Determine whether the path provided represents a directory
	 *
	 * @returns {boolean} is directory
	 * @memberof DirectoryEntries
	 */
	isDirectory() {
		const { path } = storage.get(this);

		try {
			return Boolean(path && FS.lstatSync(path).isDirectory());
		} catch (e) {}

		return false;
	}

	/**
	 * Find all matching entries
	 *
	 * @param {function} filter
	 * @returns {array} filtered
	 * @memberof DirectoryEntries
	 */
	find(filter) {
		return [...this].filter(filter).map(({ name }) => name);
	}

	/**
	 * Find a single matching entry
	 *
	 * @param {function} filter
	 * @returns {Dirent?} entry
	 * @memberof DirectoryEntries
	 */
	findOne(filter) {
		for (const entry of this) {
			if (filter(entry)) {
				return entry.name;
			}
		}

		return;
	}

	/**
	 * Symbol.iterator implementation yielding all entry names
	 *
	 * @memberof DirectoryEntries
	 */
	*[Symbol.iterator]() {
		const internal = storage.get(this);
		const { path } = internal;

		if (!('entries' in internal) && this.isDirectory()) {
			internal.entries = FS.readdirSync(path, {
				encoding: 'utf8',
				withFileTypes: true
			});
		}

		const { entries } = internal;

		if (entries) {
			for (let i = 0; i < entries.length; ++i) {
				yield entries[i];
			}
		}
	}

	/**
	 * Obtain a DirectoryEntries instance for the given path
	 *
	 * @static
	 * @param {string} path
	 * @returns {DirectoryEntries} instance
	 * @memberof DirectoryEntries
	 */
	static from(path) {
		if (!storage.has(this)) {
			storage.set(this, new Map());
		}
		const map = storage.get(this);

		if (!map.has(path)) {
			map.set(path, new this(path, protect));
		}

		return map.get(path);
	}
}

module.exports = DirectoryEntries;
