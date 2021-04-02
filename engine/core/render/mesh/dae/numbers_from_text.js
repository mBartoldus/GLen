export function numbers_from_text(text, stride = 0) {  // rename parse_array
    let text_values = text.match(/[\-\d\.e]+/g)
    let output = []
    if (stride <= 0) { for (let v of text_values) { output.push(parseFloat(v)) } }
    else {
        let i = 0, current
        for (let val of text_values) {
            if (i % stride === 0) {
                current = []
                output.push(current)
                i = 0
            }
            current.push(parseFloat(val))
            i++
        }
    }
    return output
}