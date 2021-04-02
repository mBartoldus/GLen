import Entity from "../Entity.js"

const in_use = new Map()
function entity_id(user) { return typeof user == "number" ? [Entity.by_id(user), user] : [user, user.id] }
function* iterator() { if ("get" in this) { for (let id of this.user_ids) { yield this.get(id) } } }
const methods = {
    add_user: function (user, data) {
        let [entity, id] = entity_id(user)
        this.user_ids.add(id)
        entity.add(this.tag)
        "set" in this && data && this.set(id, data)
    },
    remove_user: function (user) {
        let [entity, id] = entity_id(user)
        if(this.user_ids.has(id)) {
            this.user_ids.delete(id)
            entity.delete(this.tag)
            "delete" in this && this.delete(id)
        }
    },
    clear: function () {
        for (let id of this.user_ids) { this.remove_user(id) }
        this.user_ids.clear()
    },
}

export function Descriptor(tag) {
    let D = arguments[1] || {}
    D.tag = tag
    D.user_ids = new Set()
    for (let prop in methods) { D[prop] = methods[prop] }
    D[Symbol.iterator] = iterator
    in_use.set(tag, D)
    return D
}
export default Descriptor
Descriptor.by_tag = function (tag) { return in_use.get(tag) }


