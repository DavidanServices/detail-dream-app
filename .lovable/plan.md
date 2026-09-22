# Davidan Services — complete experience redesign

## Goal
Rebuild the entire visual experience around the existing Davidan Services colour identity, content, pages, pricing, forms, and PPF configurator. The result will feel editorial, cinematic, and precision-engineered rather than like the current card-based template.

## Visual direction
- Lock the current semantic palette exactly: gunmetal backgrounds, chrome/white foregrounds, muted steel text, and Romani red accents.
- Replace Urbanist/Epilogue with a distinctive automotive display face and a highly readable UI face.
- Introduce a sharper “precision workshop” system: asymmetric compositions, clipped media corners, fine technical dividers, compact labels, large display type, and restrained red focus lines.
- Use flatter, more deliberate surfaces with fewer floating cards; reserve framed panels for actual selectable or repeated items.
- Add purposeful reveal, image, button, navigation, menu, price-change, selection, and form-feedback transitions with reduced-motion support.

## Shared experience
- Rebuild the desktop header as a wider editorial navigation bar with a more prominent logo, clearer active-page indicator, and redesigned booking action.
- Rebuild mobile navigation as a full-height animated menu rather than a small dropdown.
- Add subtle route-entry motion and consistent section-heading treatments.
- Recompose the footer into a strong closing brand band while preserving all links and contact details.
- Redesign buttons, inputs, focus states, borders, spacing, shadows, radii, and icon containers consistently.

## Page redesigns
- **Home:** immersive first viewport with oversized typography and new action placement; convert services, pricing, trust points, and final booking prompt into distinct editorial bands using the existing content and images.
- **Services:** turn pricing into an interactive service catalogue with animated per-card vehicle selection; preserve every price, package, booking link, and PPF path. Recompose service details as image-led feature chapters.
- **About:** use a layered brand-story composition, an asymmetric proof strip for all four existing facts, and a more expressive promise section.
- **Contact:** create a focused booking workspace with clearer information hierarchy, redesigned fields, preserved prefill behavior, and polished submitted feedback.
- **PPF configurator:** make the vehicle image the primary workspace, redesign view navigation and panel selection for desktop and mobile, and preserve all hotspots, persistent selections, estimates, reset, full-car mode, and quote-prefill behavior.
- **System pages:** update error and missing-page states to match the new system without changing their actions.

## Responsive approach
- Design mobile layouts independently: full-screen navigation, single-column editorial flow, horizontal/compact selectors where appropriate, large tap targets, stable PPF controls, and no clipped text.
- Use tablet-specific intermediate grids and spacing rather than simply scaling desktop.

## Technical details
- Keep every existing route and route ID unchanged.
- Keep current content, prices, search parameters, local state, event handlers, and form behavior unchanged.
- Refactor repeated visual patterns into focused shared components where useful.
- Keep all colours token-driven in the global stylesheet; do not introduce new brand colours.
- Add route-specific metadata fields required by the project without changing page meaning.

## Validation
- Check build diagnostics after implementation.
- Test desktop and mobile rendering for all five routes.
- Exercise package vehicle switching, contact prefill and submit success, PPF view switching, hotspot/panel persistence, full-car selection, reset, estimate, and quote navigation.
- Perform a final visual pass for contrast, overflow, alignment, motion, and consistency.
