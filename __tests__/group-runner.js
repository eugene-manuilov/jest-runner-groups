const { random, lorem } = require( 'faker' );

const GroupRunner = require( '../index' );

describe( 'GroupRunner', () => {
	test( '.getGroups', () => {
		const jestArgs = [
			'--bail',
			'--cache',
			'--changedSince',
			'--ci',
			'--clearCache',
			'--listTests',
			'--notify',
			'--showConfig',
			'--updateSnapshot',
			'--useStderr',
		];

		const argv = ['/usr/bin/node', '/path/to/node_modules/.bin/jest'];
		for ( let i = 0, num = random.number( { min: 0, max: jestArgs.length } ); i < num; i++ ) {
			argv.push( jestArgs[i] );
		}

		const groups = [];
		for ( let i = 0, num = random.number( { min: 1, max: 4 } ); i < num; i++ ) {
			const group = lorem.slug();
			argv.push( `--group=${ group }` );
			groups.push( group );
		}

		expect( GroupRunner.getGroups( argv ) ).toEqual( groups );
	} );
} );
