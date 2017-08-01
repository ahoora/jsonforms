"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const ui_schema_gen_1 = require("../generators/ui-schema-gen");
/**
 * Constant that indicates that a tester is not capable of handling
 * a combination of schema/data.
 * @type {number}
 */
exports.NOT_APPLICABLE = -1;
/**
 * Default UI schema definition that always returns 0 as its priority.
 * @type {UISchemaDefinition}
 */
const NO_UISCHEMA_DEFINITION = {
    uiSchema: null,
    tester: schema => 0
};
/**
 * Implementation of the UI schema registry.
 */
class UISchemaRegistryImpl {
    constructor() {
        this.registry = [];
        this.registry.push(NO_UISCHEMA_DEFINITION);
    }
    /**
     * @inheritDoc
     */
    register(uiSchema, tester) {
        this.registry.push({ uiSchema, tester });
    }
    /**
     * @inheritDoc
     */
    deregister(uiSchema, tester) {
        this.registry = _.filter(this.registry, el => 
        // compare testers via strict equality
        el.tester !== tester || !_.eq(el.uiSchema, uiSchema));
    }
    /**
     * @inheritDoc
     */
    findMostApplicableUISchema(schema, data) {
        const bestSchema = _.maxBy(this.registry, renderer => renderer.tester(schema, data));
        if (bestSchema === NO_UISCHEMA_DEFINITION) {
            return ui_schema_gen_1.generateDefaultUISchema(schema);
        }
        return bestSchema.uiSchema;
    }
}
exports.UISchemaRegistryImpl = UISchemaRegistryImpl;
//# sourceMappingURL=uischema.registry.js.map