import { numbers_from_text } from "./numbers_from_text.js"

export function arrange_vertex_weights(doc, weights, desired_stride = 2) {
    let vcount = numbers_from_text(doc.getElementsByTagName("vcount")[0].innerHTML)
    let bone_weight_indices = numbers_from_text(doc.getElementsByTagName("v")[0].innerHTML, 2)

    let tuple_index = 0
    let vertex_bone_weights = []

    for (let i in vcount) {
        let relevant_bone_weights = []
        for (let j = 0; j < vcount[i]; j++) {
            relevant_bone_weights.push(bone_weight_indices[tuple_index])
            tuple_index++
        }
        if (relevant_bone_weights.length > desired_stride) { relevant_bone_weights.length = desired_stride }
        for (let w of relevant_bone_weights) { let weight_index = w[1]; w[1] = weights[weight_index][0] }
        while (relevant_bone_weights.length < desired_stride) { relevant_bone_weights.push([0, 0]) }

        let current = []
        for (let tuple of relevant_bone_weights) { current.push(...tuple) }

        vertex_bone_weights.push(current)
    }
    return vertex_bone_weights
}