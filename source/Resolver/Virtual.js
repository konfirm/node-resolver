const AbstractResolver = require('../Abstract/Resolver.js');

/**
 * Resolver for any key
 *
 * @class VirtualResolver
 * @extends {AbstractResolver}
 */
class VirtualResolver extends AbstractResolver {
	/**
	 * Does the resolver match the input
	 *
	 * @param {string} key
	 * @returns {string} matched?
	 * @memberof RequireResolver
	 */
	match(input) {
		return input;
	}
}

module.exports = VirtualResolver;
