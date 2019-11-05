const AbstractResolver = require('./Abstract/Resolver.js');
const VirtualResolver = require('./Resolver/Virtual.js');
const RequireResolver = require('./Resolver/Require.js');

module.exports = {
	AbstractResolver,
	VirtualResolver,
	RequireResolver
};
