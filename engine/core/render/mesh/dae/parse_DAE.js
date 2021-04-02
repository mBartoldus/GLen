import { v, Woven_Array } from "../../../../lib/lowercase_v.js"
import { indexify } from "./indexify.js"
import { deindexed_attributes } from "./deindexed_attributes.js"
import { count_uv_sets } from "./count_uv_sets.js"
import { color_from_material } from "./color_from_material.js"





export async function parse_DAE(file, desired_vertex_attributes) {

  let text = await file.text()

  let dae = new DOMParser().parseFromString(text, "text/xml")

  // HOISTS

  let render_vertices = []
  let render_indices = []

  let geometries = dae.getElementsByTagName("geometry")
  let base_element = geometries[0]

  console.log()

  let n_shapekeys = geometries.length
  let n_uvs = count_uv_sets(base_element)
  let max_frames = Math.max(n_shapekeys, n_uvs)

  // НӨЛІНШІ

  let base_attributes = deindexed_attributes(base_element, {
    VERTEX: true,
    NORMAL: true,
    TEXCOORD: true,
  })

  console.log(base_attributes)


  // this is a ridiculous way of doing this. instead, just make an array for the material indices
  // then access the color attributes from that index during reindexing

  let color_attributes = []
  for(let triangles of base_element.getElementsByTagName("triangles")) {
    let c = color_from_material(triangles)
    let count = parseInt(triangles.getAttribute("count"))
    for(let i = 0; i<count * 3; i++) {
      color_attributes.push(c)
    }
  }


  

  // БІРІНШІ

  let pos_frames = []
  let norm_frames = []
  for (let shapekey_element of geometries) {
    let shapekey_attributes = deindexed_attributes(shapekey_element, { VERTEX: true, NORMAL: true })
    pos_frames.push(shapekey_attributes["VERTEX"])
    norm_frames.push(shapekey_attributes["NORMAL"])
  }

  let uv_frames = []
  for (let i = 0; i < n_uvs; i++) {
    uv_frames.push(deindexed_attributes(base_element, { TEXCOORD: i })["TEXCOORD"])
  }

  let frames = {
    VERTEX: pos_frames,
    NORMAL: norm_frames,
    TEXCOORD: uv_frames
  }

  // ЕКІНШІ

  function find_offsets(semantic) {
    let attribute_offsets = []
    for (let i = 0; i < base_attributes[semantic].length; i++) {
      let vertex_offset = []
      for (let j = 0; j < max_frames; j++) {
        let diff = v(frames[semantic][j][i]).sub(base_attributes[semantic][i])
        diff.clamp(-1, 1).add(v(1, 1, 1)).scale(255 / 2)
        vertex_offset.push(diff)
      }
      attribute_offsets.push(vertex_offset)
    }
    return attribute_offsets
  }

  let offsets = {
    VERTEX: find_offsets("VERTEX"),
    NORMAL: find_offsets("NORMAL"),
    TEXCOORD: find_offsets("TEXCOORD")
  }

  let offset_texture = []
  let next_highest_offset_index = 0

  function index_offset(ATTRIBUTE) {
    return indexify(offsets[ATTRIBUTE],
      (vertex_frames) => {
        for (let i = 0; i < max_frames; i++) {
          let current_frame = v(3).read(vertex_frames[i])
          offset_texture.push(...current_frame)
        }
      },
      key => key.match(/[1-9]+/g) ? next_highest_offset_index++ : -0.5
    )
  }

  let offset_indices = {
    VERTEX: index_offset("VERTEX"),
    NORMAL: index_offset("NORMAL"),
    TEXCOORD: index_offset("TEXCOORD")
  }

  for (let prop in offset_indices) {
    let index_array = offset_indices[prop]
    for (let index in index_array) {
      index_array[index] += 0.5
      index_array[index] /= next_highest_offset_index
    }
  }

  // ҮШІНШІ

  // let weights = arrange_vertex_weights(dae, attributes["WEIGHT"])

  // ТӨРТІНШІ

  let format = {
    pos: 3,
    norm: 3,
    uv: 2,

    pos_offset_id: 1,
    norm_offset_id: 1,
    uv_offset_id: 1,

    bone_ids: 2,      // 1-4
    bone_weights: 2,  // 1-4

    material: 1,
    color: 3,
  }


  let unindexed_render_vertices = []
  for (let i = 0; i < base_attributes["VERTEX"].length; i++) {
    unindexed_render_vertices.push([
      ...base_attributes["VERTEX"][i],
      ...base_attributes["NORMAL"][i],
      ...(base_attributes["TEXCOORD"][i] ?? [0, 0]), // uv

      offset_indices["VERTEX"][i],                          // pos_offset_id
      offset_indices["NORMAL"][i],                          // norm_offset_id
      -1,                                                   // uv_offset_id

      0, 0,                                                 // bone_ids
      0, 0, // ...(weights[vertex_indices[0]]),             // bone_weights

      0,                                                    // material
      ...color_attributes[i]                                // color
    ])
  }

  render_indices = indexify(unindexed_render_vertices, element => {
    render_vertices.push(...element)
  })

  render_vertices = Woven_Array(render_vertices, format)
  if (desired_vertex_attributes) render_vertices = render_vertices.reweave(desired_vertex_attributes)

  // БЕСІНШІ
  let uv_bind_elements = dae.getElementsByTagName("bind_vertex_input")
  /*
    <bind_vertex_input semantic="UVMap" input_semantic="TEXCOORD" input_set="0"/>
    <bind_vertex_input semantic="ggg" input_semantic="TEXCOORD" input_set="1"/>
  */

  // YOU GOTTA DECREMENT EVERYTHING INCLUDING MAX FRAMES..... Ughhhhhh ohhhh
  // nvm... you need that first offset to be 0 so you can interpolate properly

  let uv_framebinds = {}
  let shapekey_framebinds = {}

  // uvs

  for (let bind of uv_bind_elements) {
    let frame_name = bind.getAttribute("semantic")
    let frame_number = parseInt(bind.getAttribute("input_set")) - 1
    let adjusted_frame_number = (frame_number + 0.5) / max_frames
    uv_framebinds[frame_name] = adjusted_frame_number
  }

  // shapekeys

  for (let i = 0; i < geometries.length; i++) {
    let frame_name = geometries[i].getAttribute("name")
    if (frame_name) {
      let adjusted_frame_number = (i + 0.5) / max_frames
      shapekey_framebinds[frame_name] = adjusted_frame_number
    }
  }

  // АЛТЫНШЫ
  //poses





  return {
    name: file.name.split(".")[0],
    vertices: new Float32Array(render_vertices),
    indices: new Uint16Array(render_indices),

    offsets: new Uint8Array(offset_texture),
    poses: new Uint8Array([]),
    n_offset_ids: max_frames,
    n_bone_ids: 0,
    //collision: new Float32Array(collision_vertices),

    index_efficiency: (render_indices.highest + 1) / render_indices.length,

    keyframes: {
      uv: uv_framebinds,
      shape: shapekey_framebinds
    },

    vertex_attributes: desired_vertex_attributes

    //count: render_indices.length,
  }
}





/*
collision_points.push(attributes["VERTEX"][vertex_indices[0]])
if (collision_points.length >= 3) {
  let ab = v(collision_points[0]).to(collision_points[1])
  let bc = v(collision_points[1]).to(collision_points[2])
  let ca = v(collision_points[2]).to(collision_points[0])

  let normal = v.cross(ab, bc).normalize()

  collision_vertices.push(
    ...normal,
    ...collision_points[0],
    ...collision_points[1],
    ...collision_points[2],
    ...v.cross(normal, ab).normalize(),
    ...v.cross(normal, ab).normalize(),
    ...v.cross(normal, ab).normalize(),
  )

  collision_points = []
}
*/