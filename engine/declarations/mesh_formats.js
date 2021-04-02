

export function GLen_Mesh(init) {
    return {
        name: init.name ?? "",
        extension: "glen",
        indexed: init.indexed ?? true,
        vertex_attributes: init.vertex_attributes ?? {
            pos: 3,           // 2-3
            norm: 3,          // 2-3
            uv: 2,

            pos_offset_id: 1,
            norm_offset_id: 1,
            uv_offset_id: 1,

            bone_ids: 2,      // 1-4
            bone_weights: 2,  // 1-4

            material: 1,
            color: 3,
        },
        vertices: new Float32Array(init.vertices),
        indices: new Uint16Array(init.indices),
        count: 0,
        offsets: new Uint8Array(init.offsets),
        n_offset_ids: init.n_offset_ids,
        poses: new Uint8Array(init.poses),
        n_bone_ids: init.n_bone_ids,
        keyframes: init.keyframes ?? {
            uv: {
                // default: 0.25,
                // blink: 0.75,
            },
            shape: {
                // etc
            },
            pose: {}
        }
    }
}

/*
new Blob([
    new Uint32Array(pointers),
    new Uint32Array([
        this.n_offset_ids,
        this.n_bone_ids,
    ]),
    this.indices,
    this.vertices,
    this.offsets,
    this.poses,
    new TextEncoder().encode(JSON.stringify(this.keyframes))
])
*/