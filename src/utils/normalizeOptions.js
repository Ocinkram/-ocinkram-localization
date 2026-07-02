import { SURFACES } from "../constants/surfaces.js";
import { EH_PERSONAS } from "../constants/personas.js";
import { BUSINESS_SUBSCRIPTIONS } from "../constants/subscriptions.js";
import { CTA_PURPOSES } from "../constants/purposes.js";

const VALID_SURFACES = new Set(Object.values(SURFACES));
const VALID_PERSONAS = new Set(Object.values(EH_PERSONAS));
const VALID_SUBSCRIPTIONS = new Set(Object.values(BUSINESS_SUBSCRIPTIONS));
const VALID_PURPOSES = new Set(Object.values(CTA_PURPOSES));

export function normalizeOptions(options = {}) {
  const ctaType =
    options.ctaType != null && String(options.ctaType).trim() !== ""
      ? String(options.ctaType).trim()
      : "";

  const surface = VALID_SURFACES.has(options.surface)
    ? options.surface
    : SURFACES.PERSONAL;

  const persona = VALID_PERSONAS.has(options.persona)
    ? options.persona
    : EH_PERSONAS.ORDINARY;

  const purpose = VALID_PURPOSES.has(options.purpose)
    ? options.purpose
    : CTA_PURPOSES.DEFAULT;

  const subscription = VALID_SUBSCRIPTIONS.has(options.subscription)
    ? options.subscription
    : BUSINESS_SUBSCRIPTIONS.FREE;

  return { ctaType, surface, persona, purpose, subscription };
}
