/* eslint-disable jest/expect-expect, jest/prefer-expect-assertions */
const fs = require('fs');

const postcss = require('postcss');
const sortLvfha = require('./');

async function run(input, output, opts) {
  const result = await postcss([ sortLvfha(opts), ]).process(input, {
    from: undefined,
  });

  expect(result.css).toStrictEqual(output);
  expect(result.warnings()).toHaveLength(0);
}

describe('postcss-sort-lvfha', () => {
  it('sort stateful pseudo-selector rulesets in correct order after other rulsets', async () => {
    const input = fs.readFileSync('./test/simple.in.css', 'utf8');
    const output = fs.readFileSync('./test/simple.out.css', 'utf8');
    await run(input, output);
  });

  it('sort stateful pseudo-selector rulesets bu keep them inside parent at-rule ruleset', async () => {
    const input = fs.readFileSync('./test/atrule.in.css', 'utf8');
    const output = fs.readFileSync('./test/atrule.out.css', 'utf8');
    await run(input, output);
  });

  it('sort based on options', async () => {
    const input = fs.readFileSync('./test/simple.in.css', 'utf8');
    const output = fs.readFileSync('./test/alt-sort.out.css', 'utf8');
    await run(input, output, {
      order: [ ':link', ':visited', ':hover', ':focus', ':active', ],
    });
  });
});
