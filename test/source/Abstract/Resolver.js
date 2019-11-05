/* global source, describe, it, each, expect */

const Path = require('path');
const AbstractResolver = source('Abstract/Resolver');

describe('Abstract/Resolver', () => {
	const sample = Path.join(__dirname, '..', '..', 'sample');

	it('is a function', (next) => {
		expect(AbstractResolver).to.be.function();

		next();
	});

	it('constructs', (next) => {
		const one = new AbstractResolver();
		const two = new AbstractResolver('.');

		expect(one).to.be.instanceOf(AbstractResolver);
		expect(two).to.be.instanceOf(AbstractResolver);

		expect(one.path).to.equal([]);
		expect(two.path).to.equal(['.']);

		next();
	});

	it('implements Symbol.match', (next) => {
		const instance = new AbstractResolver('foo');

		expect(instance[Symbol.match]).to.be.function();

		next();
	});

	it('implements match', (next) => {
		const instance = new AbstractResolver('foo');

		expect(instance.match).to.be.function();

		next();
	});

	it('never matches', (next) => {
		const instance = new AbstractResolver('foo');

		expect(instance.match('foo')).to.be.undefined();
		expect('foo'.match(instance)).to.be.undefined();

		next();
	});

	it('implements Symbol.iterator', (next) => {
		const instance = new AbstractResolver('foo');

		expect(instance[Symbol.iterator]).to.be.object();
		expect(instance[Symbol.iterator].constructor).to.be.function();
		expect(instance[Symbol.iterator].constructor.name).to.equal(
			'GeneratorFunction'
		);

		expect([...instance]).to.have.length(0);

		next();
	});

	it('never iterates', (next) => {
		const instance = new AbstractResolver('foo');

		expect([...instance]).to.have.length(0);

		next();
	});

	it('implements use', (next) => {
		const foo = new AbstractResolver('foo');
		const bar = foo.use('bar');
		const baz = bar.use('baz');

		expect(foo.path).to.equal(['foo']);
		expect(bar.path).to.equal(['foo', 'bar']);
		expect(baz.path).to.equal(['foo', 'bar', 'baz']);

		next();
	});
});
