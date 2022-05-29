const fs = require( 'fs' );

const JestRunner = require( 'jest-runner' );
const { parse } = require( 'jest-docblock' );

const TestRunner = Object.prototype.hasOwnProperty.call( JestRunner, 'default' ) ? JestRunner.default : JestRunner;

const ARG_PREFIX = '--group=';
const REGEX_PREFIX = '--regex=';

class GroupRunner extends TestRunner {

	static getGroups( args ) {
		const includeGroups = [];
		const excludeGroups = [];
		const includeRegexes = [];
		const excludeRegexes = [];

		args.forEach( ( arg ) => {
			if ( arg.startsWith( ARG_PREFIX ) ) {
				const group = arg.substring( ARG_PREFIX.length );
				if ( group.startsWith( '-' ) ) {
					excludeGroups.push( group.substring( 1 ) );
				} else {
					includeGroups.push( group );
				}
			} else if ( arg.startsWith( REGEX_PREFIX ) ) {
				const regex = arg.substring( REGEX_PREFIX.length );
				if ( regex.startsWith( '-' ) ) {
					excludeRegexes.push( regex.substring( 1 ) );
				} else {
					includeRegexes.push( regex );
				}
			}
		} );

		return {
			includeGroups,
			excludeGroups,
			includeRegexes,
			excludeRegexes,
		};
	}

	static filterTest( {
		includeGroups, excludeGroups, includeRegexes, excludeRegexes,
	}, test ) {
		let found = includeGroups.length === 0;
		const parsed = parse( fs.readFileSync( test.path, 'utf8' ) );
		if ( parsed.group ) {
			const parsedGroup = Array.isArray( parsed.group ) ? parsed.group : [parsed.group];
			for ( let i = 0, len = parsedGroup.length; i < len; i++ ) {
				if ( typeof parsedGroup[i] === 'string' ) {
					if ( excludeGroups.find( ( group ) => parsedGroup[i].startsWith( group ) ) ) {
						found = false;
						break;
					}
					if ( excludeRegexes.find(
						( regex ) => new RegExp( regex ).test( parsedGroup[i] ),
					) ) {
						found = false;
						break;
					}

					if ( includeGroups.find( ( group ) => parsedGroup[i].startsWith( group ) ) ) {
						found = true;
					} else if ( includeRegexes.find(
						( regex ) => new RegExp( regex ).test( parsedGroup[i] ),
					) ) {
						found = true;
					}
				}
			}
		}

		return found;
	}

	runTests( tests, watcher, onStart, onResult, onFailure, options ) {
		const groups = GroupRunner.getGroups( process.argv );

		groups.includeGroups.forEach( ( group ) => {
			if ( groups.excludeGroups.includes( group ) ) {
				return;
			}

			const name = group.replace( /\W/g, '_' ).toUpperCase();
			process.env[`JEST_GROUP_${ name }`] = '1';
		} );

		return super.runTests(
			groups.includeGroups.length > 0 || groups.excludeGroups.length > 0
			|| groups.includeRegexes.length > 0 || groups.excludeRegexes > 0
				? tests.filter( ( test ) => GroupRunner.filterTest( groups, test ) )
				: tests,
			watcher,
			onStart,
			onResult,
			onFailure,
			options,
		);
	}

}

module.exports = GroupRunner;
