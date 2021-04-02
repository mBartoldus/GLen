import { MAX_ENTITIES } from "../declarations/standards.js"
import Descriptor from "./descriptors/Descriptor.js"

const in_use = new Map()
const recyclables = []

function clear() {
    for (let d of this) { Descriptor.by_tag(d).remove_user(this) }
    in_use.delete(this.id)
    recyclables.push(this)
}
function update(config = {}) {
    for (let d in config) { Descriptor.by_tag(d).add_user(this, config[d]) }
    return this
}

function E() {
    let e = new Set()
    e.id = in_use.size
    in_use.set(e.id, e)
    e.clear = clear
    e.update = update
    return e
}

export function Entity(init = {}) {
    if (in_use.size >= MAX_ENTITIES) console.error("too many entities! maximum: " + MAX_ENTITIES)
    else {
        return (recyclables.pop() || E()).update(init)
    }
}
export default Entity
Entity.by_id = function (id) { return in_use.get(id) }