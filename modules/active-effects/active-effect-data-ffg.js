const { StringField } = foundry.data.fields;

/**
 * System data for base Active Effects.
 * Since v14, core validates ActiveEffect#system against a data model that only knows `changes`,
 * so any other key is dropped. The system stores how long a status lasts in `system.duration`
 * ("once" is removed after the next roll, "combat" when the combat ends), which needs declaring here.
 */
export class ActiveEffectDataFFG extends foundry.data.ActiveEffectTypeDataModel {
  /** @inheritDoc */
  static defineSchema() {
    return {
      ...super.defineSchema(),
      duration: new StringField({ required: false, nullable: true, blank: true, initial: undefined }),
    };
  }
}
