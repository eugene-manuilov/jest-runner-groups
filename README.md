# jest-runner-groups

[![Version](https://img.shields.io/npm/v/jest-runner-groups.svg)](https://www.npmjs.com/package/jest-runner-groups)
[![Downloads/week](https://img.shields.io/npm/dw/jest-runner-groups.svg)](https://www.npmjs.com/package/jest-runner-groups)
[![License](https://img.shields.io/npm/l/jest-runner-groups.svg)](https://github.com/eugene-manuilov/jest-runner-groups/blob/master/package.json)

A test runner that allows you to tag your tests and execute specific groups of tests with Jest.

## Instalation

```sh-session
npm i -D jest-runner-groups
```

## Usage

To use this runner you need to tag your tests, add this runner to your jest config and update your test command to specify which groups to run.

### Tag your tests

To properly tag your tests, you need to add a docblock with the `@group` tag to every test file you have. For example, your test should look like the following to belong to the `unit/classes/foo` group:

```javascript
/**
 * Tests Foo class
 * 
 * @group unit/classes/foo
 */

import Foo from '../src/Foo';

describe( 'Foo class', () => {
    it( '...', () => {
        ...
    } );

    ...
} );
```

Your tests may have multiple groups per file:

```javascript
/**
 * Admin dashboard tests
 * 
 * @group admin/pages/dashboard
 * @group puppeteer
 * @group acceptance
 */

describe( 'Dashboard page', () => {
    ...
} );
```

### Update Jest config

To make Jest use this runner, you need to update your Jest config and add `groups` runner to it. For example, if your jest config is in the `package.json` file:

```json
{
    "name": "my-package",
    "version": "1.0.0",
    "dependencies": {
    },
    "jest": {
        "runner": "groups"
    }
}
```

Or in the `jest.config.js` file:

```javascript
module.exports = {
    ...
    runner: "groups"
};
```

> Note: There is a confusion between [runner](https://jestjs.io/docs/en/configuration#runner-string) and [testRunner](https://jestjs.io/docs/en/configuration#testrunner-string) options in the jest configuration. The main difference between them is that jest uses `runner` to find and execute all tests, and `testRunner` to execute a particular test file. So, if you want to use `jest-circus`, then add it as `testRunner` along with `"runner": "groups"` option and they will work together.

### Run groups of tests

Once you update your tests and jest config, you can start running tests in groups by using `--group` argument. Just specify a group or groups that you want to run like this:

```sh-session
// using jest executable:
jest --group=unit

// or via npm:
npm test -- --group=unit
```

You can use multiple `--group` arguments to specify multiple groups to run:

```sh-session
npm test -- --group=unit/classes --group=unit/services
```

Also pay attention that if you specify a prefix of a group, then all tests that have a group that starts with that prefix will be executed. In other words, if you run `npm test -- --group=unit` command, then all tests that have a group that starts with `unit` will be executed.

### Exclude groups

If you want to exclude a subgroup from being executed, add minus character to the beginnig of its name. The following example shows how to run all tests in the `foo` group, but exclude `foo/baz` group:

```sh-session
jest --group=foo --group=-foo/baz
```

### Knowing which gruops are running

When you run your tests using jest-runner-groups, you can check which group is currently running by checking the current process environment variables. This can be handy if you want to use different fixtures for different groups or skip a certain functionality for a specific group.

Each group is added with the `JEST_GROUP_` prefix and all non-word characters in the group name are replaced with underscores. For example, if you run the following command:

```sh-session
npm test -- --group=unit/classes --group=unit/services
```

Then you can check groups in your jest tests:

```js
/**
 * Admin dashboard tests
 * 
 * @group unit/classes
 * @group unit/services
 * @group unit/utility
 */

it( '...', () => {
    expect( process.env.JEST_GROUP_UNIT_CLASSES ).toBeTruthy();
    expect( process.env.JEST_GROUP_UNIT_SERVICES ).toBeTruthy();
    expect( process.env.JEST_GROUP_UNIT_UTILITY ).not.toBeTruthy();
} );
```

## Contribute

Want to help or have a suggestion? Open a [new ticket](https://github.com/eugene-manuilov/jest-runner-groups/issues/new) and we can discuss it or submit a pull request.

## License

MIT
