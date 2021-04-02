export function count_uv_sets(doc) {
    let count = 0
    let tris = doc.getElementsByTagName("triangles")[0]
    for (let i of tris.getElementsByTagName("input")) { i.getAttribute("semantic") === "TEXCOORD" && count++ }
    return count
}