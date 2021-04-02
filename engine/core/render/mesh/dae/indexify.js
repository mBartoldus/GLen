export function deindex(array, indices, offset = 0) {
    let deindexed = []
    for (let i of indices) { deindexed.push(array[i[offset]]) }
    return deindexed
}
export function Indexer() {
    let next_highest_index = 0
    return () => next_highest_index++
}
export function indexify(array, push_method, index_method = Indexer()) {
    let lookup = { invalid: -1 }
    let indices = []
    for (let i = 0; i < array.length; i++) {
        let element = array[i]
        let key = "" + element
        if (!(key in lookup)) {
            let index = index_method(key)
            lookup[key] = index
            index >= 0 && push_method(element, i)
            indices.highest = index
        }
        indices.push(lookup[key])
    }
    return indices
}
