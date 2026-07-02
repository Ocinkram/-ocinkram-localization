import { defaults } from "./data/defaults.js";
import { personalCTA } from "./data/labels/personal.js";
import { businessCTA } from "./data/labels/business.js";
import { SURFACES } from "./constants/surfaces.js";
import { EH_PERSONAS } from "./constants/personas.js";
import { BUSINESS_SUBSCRIPTIONS } from "./constants/subscriptions.js";
import { CTA_PURPOSES } from "./constants/purposes.js";
import { normalizeOptions } from "./utils/normalizeOptions.js";

const CTA_NOT_FOUND = "CTA not found";

function resolveFromPersonal(ctaType, persona, purpose) {
  const ctaNode = personalCTA[ctaType];
  if (!ctaNode) {
    return undefined;
  }

  const personaNode = ctaNode[persona] ?? ctaNode[EH_PERSONAS.ORDINARY];
  if (!personaNode) {
    return undefined;
  }

  return personaNode[purpose] ?? personaNode[CTA_PURPOSES.DEFAULT];
}

function resolveFromBusiness(ctaType, subscription, persona, purpose) {
  const ctaNode = businessCTA[ctaType];
  if (!ctaNode) {
    return undefined;
  }

  const subscriptionNode =
    ctaNode[subscription] ?? ctaNode[BUSINESS_SUBSCRIPTIONS.FREE];
  if (!subscriptionNode) {
    return undefined;
  }

  const personaNode =
    subscriptionNode[persona] ?? subscriptionNode[EH_PERSONAS.ORDINARY];
  if (!personaNode) {
    return undefined;
  }

  return personaNode[purpose] ?? personaNode[CTA_PURPOSES.DEFAULT];
}

function resolveLabel({ ctaType, surface, persona, purpose, subscription }) {
  if (surface === SURFACES.BUSINESS) {
    const businessLabel = resolveFromBusiness(
      ctaType,
      subscription,
      persona,
      purpose,
    );
    if (businessLabel != null && businessLabel !== "") {
      return businessLabel;
    }
  }

  const personalLabel = resolveFromPersonal(ctaType, persona, purpose);
  if (personalLabel != null && personalLabel !== "") {
    return personalLabel;
  }

  return undefined;
}

export function getEHCTA(options = {}) {
  const normalized = normalizeOptions(options);
  const { ctaType } = normalized;

  if (ctaType === "") {
    return "";
  }

  if (!defaults[ctaType]) {
    return CTA_NOT_FOUND;
  }

  const resolved = resolveLabel(normalized);
  if (resolved != null && resolved !== "") {
    return String(resolved).trim();
  }

  return defaults[ctaType];
}
