const fs = require( 'fs' );

const TestRunner = require( 'jest-runner' );
const { parse } = require( 'jest-docblock' );

const ARG_PREFIX = '--group=';

class GroupRunner extends TestRunner {

	getGroups( args ) {
		const groups = [];

		args.forEach( ( arg ) => {
			if ( arg.startsWith( ARG_PREFIX ) ) {
				groups.push( arg.substring( ARG_PREFIX.length ) );
			}
		} );

		return groups;
	}

	filterTest( groups, test ) {
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
	}

	filterTests( args, tests ) {
		const groups = this.getGroups( args );
		return groups.length
			? tests.filter( this.filterTest.bind( this, groups ) )
			: tests;
	}

	runTests( tests, watcher, onStart, onResult, onFailure, options ) {
		return super.runTests(
			this.filterTests( process.argv, tests ),
			watcher,
			onStart,
			onResult,
			onFailure,
			options,
		);
	}

}

module.exports = GroupRunner;
