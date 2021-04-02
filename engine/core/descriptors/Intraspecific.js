import Component from "./Component.js"

let methods = {
    set: function (id, config) {
        let obj
        if (this.instances.has(id)) {
            obj = this.instances.get(id)
        } else {
            obj = this.constructor(id)
            this.instances.set(id, obj)
        }
        for (let prop in config) { 
            prop in obj && (obj[prop] = config[prop])
        }
        obj.id = id
    },
    get: function (id, prop) { return prop ? this.instances.get(id)[prop] : this.instances.get(id) },
    delete: function (id) { this.instances.delete(id) },
}


export function Intraspecific_Descriptor(tag, constructor = () => ({})) {
    let D = Component(tag)
    D.constructor = constructor
    D.instances = new Map()
    for (let prop in methods) { D[prop] = methods[prop] }
    return D
}