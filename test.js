import {
    getEHCTA,
    CTA_TYPES,
    EH_PERSONAS,
    SURFACES,
    CTA_PURPOSES,
  } from "./index.js";
  
  console.log(
    getEHCTA({
      ctaType: CTA_TYPES.GET_STARTED,
      // surface: SURFACES.PERSONAL,
      // persona: EH_PERSONAS.UNDESIRABLE,
      // purpose: CTA_PURPOSES.DEFAULT,
    }),
  );
  