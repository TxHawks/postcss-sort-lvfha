const postcss = require('postcss');

const lvfhaRegex = /:(?:link|visited|focus|hover|active)/i;

module.exports = postcss.plugin(
  'postcss-sort-lvfha',
  (
    { order, } = { order: [ ':link', ':visited', ':focus', ':hover', ':active', ], }
  ) => root => {
    const handleAtRules = createAtRuleHandler(root, order);

    sortStatefull(root, order);
    handleAtRules('supports');
    handleAtRules('media');
  }
);

////////////////////////////////////////////////////////////////////////
//                               UTILS                                //
////////////////////////////////////////////////////////////////////////

function sortStatefull(root, order) {
  const statefulRules = makeStatefulRulesObject();

  root.each(rule => {
    const { selector, } = rule;
    function handlesRule(state) {
      statefulRules[state].append(rule.clone());
      rule.remove();
    }

    // Only iterate over rules with stateful selectors
    if (isLvfha(selector)) {
      if (isActive(selector)) handlesRule(':active');
      else if (isHover(selector)) handlesRule(':hover');
      else if (isFocus(selector)) handlesRule(':focus');
      else if (isVisited(selector)) handlesRule(':visited');
      else if (isLink(selector)) handlesRule(':link');
    }
  });

  order.forEach(state => {
    const rules = statefulRules[state].nodes;
    if (rules.length) rules.forEach(rule => root.append(rule.clone()));
  });
}

function createAtRuleHandler(root, order) {
  return function atRuleHandler(atRuleType) {
    const atRules = {};

    // Merge identical groups together
    root.walkAtRules(atRuleType, atRule => {
      const { params, name, } = atRule;
      const atRuleId = name + params;

      if (!atRules[atRuleId]) {
        atRules[atRuleId] = postcss.atRule({
          name,
          params,
        });
      }

      atRule.nodes.forEach(node => {
        atRules[atRuleId].append(node.clone());
      });

      atRule.remove();
    });

    Object.keys(atRules).forEach(atRule => {
      // Sort rules inside `@suppors` blocks
      sortStatefull(atRules[atRule], order);

      // Append sorted at rule back into stylesheet
      root.append(atRules[atRule]);
    });
  };
}

function isLvfha(selector) {
  return lvfhaRegex.test(selector);
}
function isLink(selector) {
  return selector.includes(':link');
}
function isVisited(selector) {
  return selector.includes(':visited');
}
function isFocus(selector) {
  return selector.includes(':focus');
}
function isHover(selector) {
  return selector.includes(':hover');
}
function isActive(selector) {
  return selector.includes(':active');
}

function makeStatefulRulesObject() {
  return {
    ':link': postcss.root(),
    ':visited': postcss.root(),
    ':focus': postcss.root(),
    ':hover': postcss.root(),
    ':active': postcss.root(),
  };
}
