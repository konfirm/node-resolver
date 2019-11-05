/* global source, describe, it, each, expect */

const Path = require('path');
const VirtualResolver = source('Resolver/Virtual');
const AbstractResolver = source('Abstract/Resolver');

describe('Resolver/Virtual', () => {
	const sample = 'virt';

	it('is a function', (next) => {
		expect(VirtualResolver).to.be.function();

		next();
	});

	it('is an AbstractResolver', (next) => {
		expect(VirtualResolver.prototype).to.be.instanceOf(AbstractResolver);

		next();
	});

	it('has path property', (next) => {
		const instance = new VirtualResolver(sample);

		expect(instance.path).to.equal([sample]);

		next();
	});

	it('use descends into sub virtuals', (next) => {
		let instance = new VirtualResolver(sample);
		const path = [sample];

		for (let i = 0; i < 100; ++i) {
			const key = `nest${i}`;
			path.push(key);

			instance = instance.use(key);

			expect(instance).to.be.instanceOf(VirtualResolver);
			expect(instance.path).to.equal(path);
		}

		next();
	});

	it('implements Symbol.match', (next) => {
		const instance = new VirtualResolver(sample);

		for (let i = 0; i < 100; ++i) {
			const key = `nest${i}`;

			expect(key.match(instance)).to.equal(key);
		}

		next();
	});

	it('implements Symbol.iterator as generator', (next) => {
		const instance = new VirtualResolver(sample);

		expect(instance[Symbol.iterator]).to.be.object();
		expect(instance[Symbol.iterator].constructor).to.be.function();
		expect(instance[Symbol.iterator].constructor.name).to.equal(
			'GeneratorFunction'
		);

		expect([...instance]).to.have.length(0);

		next();
	});
});
