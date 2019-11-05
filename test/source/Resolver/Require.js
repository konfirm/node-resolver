/* global source, describe, it, each, expect */

const Path = require('path');
const RequireResolver = source('Resolver/Require');
const AbstractResolver = source('Abstract/Resolver');

describe('Resolver/Require', () => {
	const sample = Path.join(__dirname, '..', '..', 'sample');

	it('is a function', (next) => {
		expect(RequireResolver).to.be.function();

		next();
	});

	it('is an AbstractResolver', (next) => {
		expect(RequireResolver.prototype).to.be.instanceOf(AbstractResolver);

		next();
	});

	it('has path property', (next) => {
		const instance = new RequireResolver(sample);

		expect(instance.path).to.equal([sample]);

		next();
	});

	describe('Matching', () => {
		const instance = new RequireResolver(sample);

		it('implements match', (next) => {
			expect(instance.match('Core')).to.equal('Core');

			const core = instance.use('Core');

			expect(core.match('One')).to.equal('One.js');
			expect(core.match('Two')).to.equal('Two.js');
			expect(core.match('Three')).to.be.undefined();

			next();
		});

		it('implements Symbol.match', (next) => {
			expect('Core'.match(instance)).to.equal('Core');

			const core = instance.use('Core');

			expect('One'.match(core)).to.equal('One.js');
			expect('Two'.match(core)).to.equal('Two.js');
			expect('Three'.match(core)).to.be.undefined();

			next();
		});

		[
			{ type: 'integer', value: 123 },
			{ type: 'float', value: Math.PI },
			{ type: 'Infinity', value: Infinity },
			{ type: 'null', value: null },
			{ type: 'undefined' },
			{ type: 'bool (false)', value: false },
			{ type: 'bool (true)', value: true },
			{ type: 'Symbol', value: Symbol('sample') }
		].forEach(({ type, value }) => {
			it(`not ${type}`, (next) => {
				expect(instance.match(value)).to.be.undefined();

				next();
			});
		});
	});

	it('use descends into sub Requires', (next) => {
		const instance = new RequireResolver(sample);
		const core = instance.use('Core');

		expect(core).to.be.instanceOf(RequireResolver);

		const one = core.use('One');
		expect(one).to.be.string();
		expect(one).to.equal('Core/One');

		const two = core.use('Two');
		expect(two).to.be.string();
		expect(two).to.equal('Core/Two');

		next();
	});

	it('implements Symbol.iterator as generator', (next) => {
		const instance = new RequireResolver(sample);

		expect(instance[Symbol.iterator]).to.be.object();
		expect(instance[Symbol.iterator].constructor).to.be.function();
		expect(instance[Symbol.iterator].constructor.name).to.equal(
			'GeneratorFunction'
		);

		expect([...instance]).to.have.length(2);
		expect([...instance]).to.equal(['Core', 'Project']);

		next();
	});
});
