
import { Woven_Array } from "../../../../lib/lowercase_v.js"
import { Filtered_Data_Texture } from "../../texture/Data_Texture.js"




export async function parse_GLEN(file, desired_vertex_attributes) {


    let raw_file = await file.arrayBuffer()

    let pointers = new Uint32Array(raw_file.slice(0, 16))

    let buffers = []
    for (let i = 0; i <= pointers.length; i++)
        buffers.push(
            raw_file.slice(
                pointers[i - 1] || 24,
                pointers[i]
            )
        )
    let [
        i_buffer,
        v_buffer,
        o_buffer,
        p_buffer,
        json_buffer
    ] = buffers

    let [
        n_offset_ids,
        n_bone_ids
    ] = new Uint16Array(raw_file.slice(16, 24))

    let indices = new Uint16Array(i_buffer)

    let offsets = Filtered_Data_Texture(new Uint8Array(o_buffer), 3, n_offset_ids)
    let poses = Filtered_Data_Texture(new Uint8Array(p_buffer), 4, n_bone_ids)
    let { keyframes, vertex_attributes } = JSON.parse((new TextDecoder()).decode(json_buffer))

    let vertices = Woven_Array(v_buffer, vertex_attributes)
    if (desired_vertex_attributes) vertices = vertices.reweave(desired_vertex_attributes)

    return {
        n_offset_ids,
        n_bone_ids,

        indices,
        vertices,
        offsets,
        poses,

        keyframes,
        vertex_attributes,

        name: file.name,
        // extension,
        indexed: true,
        count: indices.length,
    }
}