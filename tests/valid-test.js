/**
 * This test should always run.
 *
 * @group valid
 */

describe( 'Valid Test', () => {
	it( 'should always run', () => {
		expect( 1 ).toBe( 1 );
		expect( process.env.JEST_GROUP_VALID ).not.toBeFalsy();
	} );
} );
