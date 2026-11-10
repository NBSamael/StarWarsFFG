// Roll modes used before v14, mapped to the v14 message modes
const LEGACY_ROLL_MODES = {
  roll: "public",
  publicroll: "public",
  gmroll: "gm",
  blindroll: "blind",
  selfroll: "self",
};

/**
 * Convert a legacy roll mode ("gmroll", "blindroll"...) to a v14 message mode ("gm", "blind"...).
 * Values that are already message modes are returned unchanged.
 * @param {string|null|undefined} mode
 * @returns {string|null}
 */
export function normalizeMessageMode(mode) {
  if (!mode) return null;
  return LEGACY_ROLL_MODES[mode] ?? mode;
}

/**
 * The message mode picked in the chat log. "In character" only applies to speech, so rolls are public.
 * @returns {string}
 */
export function configuredMessageMode() {
  const mode = game.settings.get("core", "messageMode");
  return (!mode || mode === "ic") ? "public" : mode;
}
