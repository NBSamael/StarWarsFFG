export default class EffectHelpers {

  /**
   * Return a plain copy of an effect's changes, safe to edit and send back through update().
   * In v14 the prepared entries of effect.system.changes keep a reference to their parent effect,
   * so cloning or submitting them fails; the source data holds the same changes without it.
   * @param {ActiveEffect|undefined} effect
   * @returns {object[]}
   */
  static getChanges(effect) {
    const changes = effect?._source?.system?.changes ?? [];
    return foundry.utils.deepClone(changes);
  }

  // Numeric modes used before v14, mapped to the v14 change types
  static LEGACY_MODE_TYPES = {
    0: "custom",
    1: "multiply",
    2: "add",
    3: "downgrade",
    4: "upgrade",
    5: "override",
  };

  /**
   * Convert effect data written for v13 or earlier (top-level changes, numeric modes, icon) to the v14 shape.
   * Data already in the v14 shape is returned unchanged.
   * @param {object} data
   * @returns {object}
   */
  static normalizeEffectData(data) {
    const result = foundry.utils.deepClone(data ?? {});
    if (result.icon && !result.img) result.img = result.icon;
    delete result.icon;
    const changes = result.system?.changes ?? result.changes ?? [];
    delete result.changes;
    result.system = {
      ...(result.system ?? {}),
      changes: changes.map(change => {
        const converted = {...change};
        if (converted.type === undefined && converted.mode !== undefined) {
          converted.type = EffectHelpers.LEGACY_MODE_TYPES[converted.mode] ?? "custom";
        }
        delete converted.mode;
        return converted;
      }),
    };
    return result;
  }

  // Map effects from EmbeddedCollection
  static transformEffects(originalEffect, _iterator, _effects) {
    const effect = {
      id: originalEffect.id,
      name: originalEffect.name,
      parentName: originalEffect.parent.name,
      active: originalEffect.active,
      changes: EffectHelpers.getChanges(originalEffect),
    };

    // Convert duration to string
    const duration = originalEffect.duration;
    const durationUnitLabels = {
      seconds: "SWFFG.Effect.Duration.Seconds",
      rounds: "SWFFG.Effect.Duration.Rounds",
      turns: "SWFFG.Effect.Duration.Turns",
    };
    if (originalEffect.start?.combat) {
      effect.duration = game.i18n.localize("SWFFG.Effect.Duration.CurrentCombat");
    } else if (typeof duration.value === "number" && duration.value > 0) {
      const unitLabel = durationUnitLabels[duration.units] ? game.i18n.localize(durationUnitLabels[duration.units]) : duration.units;
      effect.duration = `${duration.value} ${unitLabel}`;
    } else {
      effect.duration = game.i18n.localize("SWFFG.Effect.Duration.Permanent");
    }

    // Update each change from this effect
    effect.changes.forEach((change) => {
      // Display the change type (e.g. "add") where the numeric mode used to be shown
      change.mode = change.type?.toUpperCase();

      // LStrip 'system.' for shorter keys
      if (change.key.startsWith("system.")) {
        change.key = change.key.substring(7);
      }
    });

    return effect;
  }
}
