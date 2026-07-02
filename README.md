# @ocinkram/localization

EH Culture CTA label text for personal and business surfaces. This package returns button label strings only — it does not render UI components.

## What This Package Does

`@ocinkram/localization` provides a single function, `getEHCTA()`, that returns the correct call-to-action (CTA) label based on:

- **CTA type** — e.g. `submit`, `save`, `continue`
- **Surface** — `personal` or `business`
- **Persona** — EH growth personas (`undesirable`, `ordinary`, `potential`, `extraordinary`, `heroic`)
- **Purpose** — context such as `form`, `profile`, `approval`
- **Subscription** — business tier (`free`, `starter`, `growth`, `enterprise`)

All parameters are passed on one options object. Use the exported constants for each value.

## EH Culture Behind the CTA System

EH Culture practices **"Do again"** instead of **"Try again."** CTAs should encourage growth, ownership, excellence, and impact — even when the persona is `undesirable`.

The word `undesirable` is kept because it has internal meaning within EH Culture. Wording should remain positive and growth-oriented, never discouraging.

Labels are exact full strings stored in nested data paths. Each path resolves to the **CTA type's default label** from [`src/data/defaults.js`](src/data/defaults.js) — persona, purpose, and subscription select the path but the label text is defined per CTA type.

## Installation

```bash
npm install @ocinkram/localization
```

## Import

```js
import {
  getEHCTA,
  CTA_TYPES,
  EH_PERSONAS,
  SURFACES,
  BUSINESS_SUBSCRIPTIONS,
  CTA_PURPOSES,
} from "@ocinkram/localization";
```

## Basic Submit Button Example

```jsx
import { getEHCTA, CTA_TYPES, EH_PERSONAS, CTA_PURPOSES } from "@ocinkram/localization";

function SubmitButton() {
  const buttonText = getEHCTA({
    ctaType: CTA_TYPES.SUBMIT,
    persona: EH_PERSONAS.POTENTIAL,
    purpose: CTA_PURPOSES.FORM,
  });

  return (
    <button type="submit">
      {buttonText}
    </button>
  );
}
```

Expected button label: **Submit**

## Personal CTA Example

Personal CTAs resolve by **CTA type + persona + purpose**.

```js
getEHCTA({
  ctaType: CTA_TYPES.SUBMIT,
  surface: SURFACES.PERSONAL,
  persona: EH_PERSONAS.POTENTIAL,
  purpose: CTA_PURPOSES.FORM,
});
// Returns: "Submit"
```

```jsx
import { getEHCTA, CTA_TYPES, EH_PERSONAS, SURFACES, CTA_PURPOSES } from "@ocinkram/localization";

function PersonalSubmitButton() {
  const buttonText = getEHCTA({
    ctaType: CTA_TYPES.SUBMIT,
    surface: SURFACES.PERSONAL,
    persona: EH_PERSONAS.POTENTIAL,
    purpose: CTA_PURPOSES.FORM,
  });

  return <button type="submit">{buttonText}</button>;
}
```

## Business CTA Example

Business CTAs resolve by **CTA type + subscription + persona + purpose**.

```js
getEHCTA({
  ctaType: CTA_TYPES.SUBMIT,
  surface: SURFACES.BUSINESS,
  subscription: BUSINESS_SUBSCRIPTIONS.GROWTH,
  persona: EH_PERSONAS.HEROIC,
  purpose: CTA_PURPOSES.APPROVAL,
});
// Returns: "Submit"
```

```jsx
import {
  getEHCTA,
  CTA_TYPES,
  EH_PERSONAS,
  SURFACES,
  BUSINESS_SUBSCRIPTIONS,
  CTA_PURPOSES,
} from "@ocinkram/localization";

function BusinessSubmitButton() {
  const buttonText = getEHCTA({
    ctaType: CTA_TYPES.SUBMIT,
    surface: SURFACES.BUSINESS,
    subscription: BUSINESS_SUBSCRIPTIONS.GROWTH,
    persona: EH_PERSONAS.HEROIC,
    purpose: CTA_PURPOSES.APPROVAL,
  });

  return (
    <button type="submit">
      {buttonText}
    </button>
  );
}
```

Expected button label: **Submit**

## Exported Constants

Use constants instead of typing raw strings:

| Export | Example keys |
|--------|----------------|
| `SURFACES` | `PERSONAL`, `BUSINESS` |
| `EH_PERSONAS` | `UNDESIRABLE`, `ORDINARY`, `POTENTIAL`, `EXTRAORDINARY`, `HEROIC` |
| `BUSINESS_SUBSCRIPTIONS` | `FREE`, `STARTER`, `GROWTH`, `ENTERPRISE` |
| `CTA_PURPOSES` | `DEFAULT`, `FORM`, `PROFILE`, `REPORT`, `REVIEW`, `APPROVAL`, `ONBOARDING`, `DASHBOARD` |
| `CTA_TYPES` | `SUBMIT`, `SAVE`, `CONTINUE`, `START`, `UPDATE`, and all keys from the default CTA list |

## Fallback Behavior

`getEHCTA()` is safe and never throws. It always returns a string.

1. If only `ctaType` is passed, return the default CTA text.
2. If `persona` is missing, use `ordinary`.
3. If `surface` is missing, use `personal`.
4. If `purpose` is missing, use `default`.
5. If business `subscription` is missing, use `free`.
6. If a specific persona, purpose, subscription, or surface does not exist, use the closest default.
7. If the CTA type is not in the known list (`defaults.js` / `CTA_TYPES`), return `"CTA not found"`.
8. Never return `undefined`.
9. Always return a safe string.

```js
getEHCTA({ ctaType: "archiveMessage" });
// "CTA not found"

getEHCTA({ ctaType: "ksljdhf" });
// "CTA not found"
```

## How Labels Are Stored

Labels are exact full strings stored in nested data paths:

- Personal: `ctaType → persona → purpose → label`
- Business: `ctaType → subscription → persona → purpose → label`

| File | Role |
|------|------|
| [`src/data/defaults.js`](src/data/defaults.js) | Flat fallback labels for unknown paths |
| [`src/data/labels/personal.js`](src/data/labels/personal.js) | Full personal label tree |
| [`src/data/labels/business.js`](src/data/labels/business.js) | Full business label tree |

## Updating CTA Values Later

Edit the exact label string at the path you want to change. By default, every path for a CTA type uses the same label from [`src/data/defaults.js`](src/data/defaults.js).

**Personal example** — edit [`src/data/labels/personal.js`](src/data/labels/personal.js):

```js
getStarted: {
  ordinary: {
    default: "Get Started",
    form: "Get Started",
    profile: "Get Started",
    // all purposes use the same cta type label
  },
},
```

**Business example** — edit [`src/data/labels/business.js`](src/data/labels/business.js):

```js
submit: {
  growth: {
    heroic: {
      default: "Submit",
      approval: "Submit",
      // all purposes use the same cta type label
    },
  },
},
```

Frontend code stays the same:

```js
getEHCTA({
  ctaType: CTA_TYPES.SUBMIT,
  surface: SURFACES.BUSINESS,
  subscription: BUSINESS_SUBSCRIPTIONS.GROWTH,
  persona: EH_PERSONAS.HEROIC,
  purpose: CTA_PURPOSES.APPROVAL,
});
```

## This Package Does Not Create Buttons

`@ocinkram/localization` only returns CTA text strings. Use the result inside any button component in your frontend framework (React, Vue, Angular, plain HTML, etc.).

## Development

Run tests:

```bash
npm test
```
