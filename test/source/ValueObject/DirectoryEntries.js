/* global source, describe, it, each, expect */

const Path = require('path');
const DirectoryEntries = source('ValueObject/DirectoryEntries');

describe('ValueObject/DirectoryEntries', () => {
	const sample = Path.join(__dirname, '..', '..', 'sample');

	it('is a function', (next) => {
		expect(DirectoryEntries).to.be.function();

		next();
	});

	it('does not allow direct construction', (next) => {
		const message = `DirectoryEntries must be created using DirectoryEntries.from('${sample}')`;
		const symbol = Symbol('DirectoryEntries');

		expect(() => new DirectoryEntries(sample)).to.throw(message);
		expect(() => new DirectoryEntries(sample, symbol)).to.throw(message);

		next();
	});

	it('static path provides (singleton) instances', (next) => {
		const one = DirectoryEntries.from(sample);
		const two = DirectoryEntries.from(sample);

		expect(one).to.be.instanceOf(DirectoryEntries);
		expect(two).to.be.instanceOf(DirectoryEntries);
		expect(one).to.shallow.equal(two);

		next();
	});

	it('can determine whether it provides a directory', (next) => {
		const one = DirectoryEntries.from(sample);
		const two = DirectoryEntries.from('foo');
		const und = DirectoryEntries.from();

		expect(one.isDirectory()).to.be.true();

		expect(two.isDirectory()).to.be.false();
		expect([...two]).to.have.length(0);

		expect(und.isDirectory()).to.be.false();
		expect([...und]).to.have.length(0);

		next();
	});

	it('implements Symbol.iterator as generator', (next) => {
		const instance = DirectoryEntries.from(sample);
		const entries = ['Core', 'Project'];

		expect(instance[Symbol.iterator]).to.be.object();
		expect(instance[Symbol.iterator].constructor).to.be.function();
		expect(instance[Symbol.iterator].constructor.name).to.equal(
			'GeneratorFunction'
		);

		expect([...instance].map(({ name }) => name)).to.equal(entries);

		next();
	});

	it('implements find', (next) => {
		const instance = DirectoryEntries.from(Path.join(sample, 'Core'));

		expect(instance.find((entry) => entry.name === 'Foo')).to.equal([]);
		expect(instance.find((entry) => entry.name === 'Nested')).to.equal([
			'Nested'
		]);
		expect(instance.find((entry) => /\.js$/.test(entry.name))).to.equal([
			'One.js',
			'Two.js'
		]);

		next();
	});

	it('implements findOne', (next) => {
		const instance = DirectoryEntries.from(Path.join(sample, 'Project'));

		expect(
			instance.findOne((entry) => entry.name === 'Foo')
		).to.be.undefined();

		expect(instance.findOne((entry) => entry.name === 'Nested')).to.equal(
			'Nested'
		);

		expect(instance.findOne((entry) => /\.js$/.test(entry.name))).to.equal(
			'One.js'
		);

		next();
	});
});
