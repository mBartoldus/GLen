import parse_GLEN from ".glen/parse_GLEN.js"
import parse_DAE from "./dae/parse_DAE.js"

let vertex_attributes = {
    pos: 3,
    norm: 3,
    uv: 2,

    pos_offset_id: 1,
    norm_offset_id: 1,
    uv_offset_id: 1,

    bone_ids: 2,
    bone_weights: 2,

    material: 1,
    color: 3,
}

export async function debug_mesh(file){
    let mesh
    switch (file.name.split(".").pop()) {
        case "glen":
            mesh = parse_GLEN(file, vertex_attributes)
            break
        case "dae":
            mesh = parse_DAE(file, vertex_attributes)
            break
        default:
            throw "invalid filetype! currently only accepts: .dae, .glen"
            break
    }
    // let bin = export_GLEN( mesh )
    return mesh
}