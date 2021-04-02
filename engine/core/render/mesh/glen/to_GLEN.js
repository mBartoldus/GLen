



const byte_depths = {
    indices: 2,
    vertices: 4,
    offsets: 1,
    poses: 1,
}

export function to_GLEN(mesh) {
    let running_pointer = 24
    let pointers = []
    for (let prop in byte_depths) {
        pointers.push(running_pointer += (mesh[prop].length ?? 0) * byte_depths[prop])
    }
    let blob = new Blob([
        new Uint32Array(pointers),
        new Uint32Array([
            mesh.n_offset_ids,
            mesh.n_bone_ids,
        ]),
        mesh.indices,
        mesh.vertices,
        mesh.offsets,
        mesh.poses,
        new TextEncoder().encode(JSON.stringify(mesh.keyframes))
    ])
    // let link = document.createElement('a');
    // link.download = mesh.name + '.glen';
    // link.href = URL.createObjectURL(blob);
    // link.click();
    // URL.revokeObjectURL(link.href);
    // link.remove()
    return blob
}