const fs = require( 'fs' );

const TestRunner = require( 'jest-runner' );
const { parse } = require( 'jest-docblock' );

const ARG_PREFIX = '--group=';

class GroupRunner extends TestRunner {

	runTests( tests, watcher, onStart, onResult, onFailure, options ) {
		const groups = [];
		process.argv.forEach( ( arg ) => {
			if ( arg.startsWith( ARG_PREFIX ) ) {
				groups.push( arg.substring( ARG_PREFIX.length ) );
			}
		} );

		const filteredTests = groups.length === 0 ? tests : tests.filter( ( test ) => {
			const parsed = parse( fs.readFileSync( test.path, 'utf8' ) );
			if ( parsed.group ) {
				const parsedGroup = Array.isArray( parsed.group ) ? parsed.group : [ parsed.group ];
				for ( let i = 0, len = parsedGroup.length; i < len; i++ ) {
					if ( typeof parsedGroup[i] === 'string' && groups.find( ( group ) => parsedGroup[i].startsWith( group ) ) ) {
						return true;
					}
				}
			}

			return false;
		} );

		return super.runTests( filteredTests, watcher, onStart, onResult, onFailure, options );
	}

}

module.exports = GroupRunner;
