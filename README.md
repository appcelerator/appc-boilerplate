# Appc Boilerplate

A collection of Node.js project templates to get you up and running quickly.

## Features

 * Support for ES2015/ES2016 using Babel
 * Writes sourcemaps for debugging and stack traces
 * ESLint for static analysis and code style
 * API documentation via ESDoc
 * Unit tests using Mocha
 * Code coverage using Istanbul
 * Unit test assertions using Chai and Sinon

> Note: some templates require Node.js 4 or newer. Support for Node.js 0.10 and
  0.12 can be achieved using `babel-preset-es2015` instead of
  `babel-preset-nodejs-lts`.

## Gulp Tasks

 * `gulp build` or `npm run build`

   Cleans the `dist` directory, lints your code, transpiles your code using
   Babel, and writes sourcemaps.

 * `gulp test` or `npm test`

   Runs your unit tests using Mocha and displays the report.

 * `gulp coverage` or `npm run coverage`

   Same as `gulp test` except it instruments your code with Istanbul, then
   runs the tests and displays a summary. Writes lcov report (JSON and HTML
   formatted) to the `coverage` directory.

 * `gulp clean`

   Removes all generated files such as transpiled code, sourcemaps, API docs,
   and code coverage results.

 * `gulp lint-src` and `gulp lint-test`

   Lints your source and unit tests.

 * `gulp docs` or `npm run docs`

   Generates API docs into the `docs` directory.

## Getting Started

Here's a general list of how to use these project templates:

  1. Copy the entire template directory somewhere and rename the directory to
     the name of your project
  2. Edit the `package.json` and update the `name` and git repository name
  3. Run `git init`
  4. Run `npm install`
  5. Write your code in the `src` directory
  6. Run `gulp test` or `gulp coverage`
  7. To publish your package to NPM, run `npm publish` which will trigger the
     `gulp build` task before publishing

## Contributing

Please feel free to add new project templates or fix any issues. Please keep
these project templates consistent. For example, if you add something to
`.gitignore` for one template, add it to all other relevant templates.
