const { random, lorem } = require( 'faker' );

const GroupRunner = require( '../index' );

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

function getBaseCliArgs( num = 0 ) {
	const argv = ['/usr/bin/node', '/path/to/node_modules/.bin/jest'];
	for ( let i = 0; i < num; i++ ) {
		argv.push( jestArgs[i] );
	}

	return argv;
}

test( 'getGroups', () => {
	const groups = {
		include: [],
		exclude: [],
	};

	const argv = getBaseCliArgs( random.number( { min: 0, max: jestArgs.length } ) );

	for ( let i = 0, num = random.number( { min: 1, max: 4 } ); i < num; i++ ) {
		const exclude = random.boolean();
		const sign = exclude ? '-' : '';
		const group = lorem.slug();

		argv.push( `--group=${ sign }${ group }` );

		if ( exclude ) {
			groups.exclude.push( group );
		} else {
			groups.include.push( group );
		}
	}

	expect( GroupRunner.getGroups( argv ) ).toEqual( groups );
} );

test( 'filterTests - no groups', () => {
	const argv = getBaseCliArgs();
	const tests = random.words( random.number( { min: 1, max: 10 } ) );
	expect( GroupRunner.filterTests( argv, tests ) ).toEqual( tests );
} );
