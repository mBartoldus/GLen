import Descriptor from "./Descriptor.js"

function* iterator() { for (let entry of this.definitions) { let d = entry[1]; if (d.is_complete && d.user_ids.size) yield d } }
const _METHODS = {
    set: function (id, name) {
        let def,
            definitions = this.definitions
        let archetypes = this.user_archetypes
        archetypes.has(id) && this.get(id).user_ids.delete(id)
        if (definitions.has(name)) {
            def = definitions.get(name)
        } else {
            def = this.define(name)
        }
        def.user_ids.add(id)
        this.user_archetypes.set(id, name)
    },
    get: function (id) { return this.definitions.get(this.user_archetypes.get(id)) },
    delete: function (id) {
        let name = this.user_archetypes.get(id)
        this.definitions.get(name).user_ids.delete(id)
        this.user_archetypes.delete(id)
    },
    define(name, definition) {
        let def = {
            name: name,
            user_ids: new Set(),
            is_complete: !!definition,
        }
        if (definition) {
            Object.assign(def, definition)
        } else {
            this.load_definition(name).then(loaded_definition => {
                Object.assign(def, loaded_definition)
                def.is_complete = true
            })
        }
        this.definitions.set(name, def)
        return def
    },
    remove_definition(name) {
        let ids = this.definitions.get(name).user_ids
        for (let id in ids) { this.remove_user(id) }
        this.definitions.delete(name)
    }
}

export function Archetypal_Descriptor(tag, definition_method = async () => ({})) {
    let D = Descriptor(tag)
    D.user_archetypes = new Map()
    D.definitions = new Map()
    D.load_definition = definition_method
    Object.assign(D, _METHODS)
    D[Symbol.iterator] = iterator
    return D
}