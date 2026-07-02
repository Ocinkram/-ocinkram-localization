import { personalCTA } from "./src/data/labels/personal.js";
import { businessCTA } from "./src/data/labels/business.js";
import { CTA_TYPES } from "./src/constants/ctaTypes.js";
import { CTA_PURPOSES } from "./src/constants/purposes.js";
import { EH_PERSONAS } from "./src/constants/personas.js";
import { BUSINESS_SUBSCRIPTIONS } from "./src/constants/subscriptions.js";

const EXPECTED_CTA_TYPE_COUNT = Object.keys(CTA_TYPES).length;
const EXPECTED_CTA_TYPE_KEYS = Object.values(CTA_TYPES).sort();
const EXPECTED_PURPOSE_COUNT = Object.keys(CTA_PURPOSES).length;
const EXPECTED_PURPOSE_KEYS = Object.values(CTA_PURPOSES).sort();
const EXPECTED_PERSONA_KEYS = Object.values(EH_PERSONAS).sort();
const EXPECTED_SUBSCRIPTION_KEYS = Object.values(BUSINESS_SUBSCRIPTIONS).sort();

let passed = 0;
let failed = 0;

function fail(label, details) {
  failed += 1;
  console.error(`FAIL: ${label}`);
  if (details) {
    console.error(`  ${details}`);
  }
}

function pass(label) {
  passed += 1;
  void label;
}

function assertSameKeys(actualKeys, expectedKeys, label) {
  const actual = [...actualKeys].sort();
  const expected = [...expectedKeys].sort();

  if (
    actual.length === expected.length &&
    actual.every((key, index) => key === expected[index])
  ) {
    pass(label);
    return true;
  }

  fail(
    label,
    `expected keys [${expected.join(", ")}], got [${actual.join(", ")}]`,
  );
  return false;
}

function assertPurposeObject(purposeNode, label) {
  const keys = Object.keys(purposeNode);

  if (keys.length !== EXPECTED_PURPOSE_COUNT) {
    fail(
      label,
      `expected ${EXPECTED_PURPOSE_COUNT} purpose entries, got ${keys.length}`,
    );
    return;
  }

  assertSameKeys(keys, EXPECTED_PURPOSE_KEYS, `${label} — purpose keys`);
}

function validateCtaTypeKeys(tree, label) {
  const ctaTypeKeys = Object.keys(tree);

  if (ctaTypeKeys.length !== EXPECTED_CTA_TYPE_COUNT) {
    fail(
      label,
      `expected ${EXPECTED_CTA_TYPE_COUNT} cta types, got ${ctaTypeKeys.length}`,
    );
    return false;
  }

  assertSameKeys(ctaTypeKeys, EXPECTED_CTA_TYPE_KEYS, `${label} — cta type keys`);
  return true;
}

export function validatePersonalLabels(tree = personalCTA) {
  if (!validateCtaTypeKeys(tree, "personal")) {
    return;
  }

  for (const [ctaType, personaTree] of Object.entries(tree)) {
    const personaKeys = Object.keys(personaTree);

    if (personaKeys.length !== EXPECTED_PERSONA_KEYS.length) {
      fail(
        `personal.${ctaType}`,
        `expected ${EXPECTED_PERSONA_KEYS.length} personas, got ${personaKeys.length}`,
      );
      continue;
    }

    assertSameKeys(
      personaKeys,
      EXPECTED_PERSONA_KEYS,
      `personal.${ctaType} — persona keys`,
    );

    for (const [persona, purposeNode] of Object.entries(personaTree)) {
      assertPurposeObject(
        purposeNode,
        `personal.${ctaType}.${persona}`,
      );
    }
  }
}

export function validateBusinessLabels(tree = businessCTA) {
  if (!validateCtaTypeKeys(tree, "business")) {
    return;
  }

  for (const [ctaType, subscriptionTree] of Object.entries(tree)) {
    const subscriptionKeys = Object.keys(subscriptionTree);

    if (subscriptionKeys.length !== EXPECTED_SUBSCRIPTION_KEYS.length) {
      fail(
        `business.${ctaType}`,
        `expected ${EXPECTED_SUBSCRIPTION_KEYS.length} subscriptions, got ${subscriptionKeys.length}`,
      );
      continue;
    }

    assertSameKeys(
      subscriptionKeys,
      EXPECTED_SUBSCRIPTION_KEYS,
      `business.${ctaType} — subscription keys`,
    );

    for (const [subscription, personaTree] of Object.entries(subscriptionTree)) {
      const personaKeys = Object.keys(personaTree);

      if (personaKeys.length !== EXPECTED_PERSONA_KEYS.length) {
        fail(
          `business.${ctaType}.${subscription}`,
          `expected ${EXPECTED_PERSONA_KEYS.length} personas, got ${personaKeys.length}`,
        );
        continue;
      }

      assertSameKeys(
        personaKeys,
        EXPECTED_PERSONA_KEYS,
        `business.${ctaType}.${subscription} — persona keys`,
      );

      for (const [persona, purposeNode] of Object.entries(personaTree)) {
        assertPurposeObject(
          purposeNode,
          `business.${ctaType}.${subscription}.${persona}`,
        );
      }
    }
  }
}

validatePersonalLabels();
validateBusinessLabels();

console.log(`Object count tests: ${passed} passed, ${failed} failed`);

if (failed > 0) {
  process.exit(1);
}
