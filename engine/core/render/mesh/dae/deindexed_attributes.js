import { numbers_from_text } from "./numbers_from_text.js"
import { vectors_from_input } from "./vectors_from_input.js"
import { deindex } from "./indexify.js"

export function deindexed_attributes(doc, desired_semantics) {
    let d_s = desired_semantics
    let attributes = {}
    for (let prop in d_s) attributes[prop] = []

    for (let triangles of doc.getElementsByTagName("triangles")) {
        let inputs = triangles.getElementsByTagName("input")
        let stride = 0
        for (let input_element of inputs) {
            let offset = parseInt(input_element.getAttribute("offset"))
            if (offset >= stride) stride = offset + 1
        }

        let indices = numbers_from_text(triangles.lastElementChild.innerHTML, stride)

        for (let input_element of inputs) {
            let s = input_element.getAttribute("semantic")
            let set = parseInt(input_element.getAttribute("set")) || 0
            if (!d_s || d_s?.[s] === true || d_s?.[s] === set) {
                // if (!(s in attributes)) {
                let offset = parseInt(input_element.getAttribute("offset"))
                try {
                    let vertices = vectors_from_input(input_element)
                    attributes[s].push(...deindex(vertices, indices, offset))
                } catch { }
                // }
            }
        }
    }
    return attributes
}