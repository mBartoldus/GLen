import { numbers_from_text } from "./numbers_from_text.js"

export function vectors_from_input(element, doc = element.getRootNode()) {
    do { element = doc.getElementById(element.getAttribute("source").slice(1)).firstElementChild } while (element.tagName == "input")
    let stride = parseInt(element.parentElement.getElementsByTagName("accessor")[0].getAttribute("stride"))
    return numbers_from_text(element.innerHTML, stride)
}