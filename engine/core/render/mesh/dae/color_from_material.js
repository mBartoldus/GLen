import { numbers_from_text } from "./numbers_from_text.js"

export function color_from_material(element, doc = element.getRootNode()) {
    let material = doc.getElementById(element.getAttribute("material"))
    if (material) {
        let effect = doc.getElementById(material.firstElementChild.getAttribute("url").slice(1))
        let color_element = effect.getElementsByTagName("diffuse")[0].firstElementChild
        return numbers_from_text(color_element.innerHTML, 3)[0]
    } else return [1, 1, 1]
}