import { Archetypal_Descriptor } from "./Archetypal.js";

import { parse_GLEN } from "../render/mesh/glen/parse_GLEN.js"

// let paths = { // you can later have this imported from somewhere, maybe make a folder for user input
//     cube: "cube.bin",
//     stage: "stage.bin",
// }


// maybe have texture be a different descriptor???.... idk figure out texture later

// add format parameter perhaps

async function load_method(name) {
    // if (!(name in paths)) throw "couldn't find mesh"
    let file = await fetch("../../content/assets/visuals/mesh/" + name + ".glen")
    return parse_GLEN(file)
}

export function Mesh_D(tag) { return Archetypal_Descriptor(tag, load_method) } // encapsulate for different vertex attribute formats?















// let blob = new Blob([
//     // header
//     new Uint32Array([
//         /* "pointers". first one omitted since it's always... 24? */
//         30, // end of indices, begin vertices
//         66, // end of vertices, begin offsets
//         72, // end of offsets, begin poses
//         72, // end of poses, begin binds
//         /* "dimensions". how many unique bones or shapekey movements are there */
//         1, // n_shapekeys 
//         0, // n_bones
//     ]),

//     // indices
//     new Uint16Array([0, 1, 2]),
//     // vertices
//     new Float32Array([
//         0, 0, 0,
//         1, 0, 0,
//         1, 1, 0,
//     ]),
//     // offsets
//     new Uint8Array([
//         0, 0.5, 0,
//         0, -0.5, 0,
//     ]),
//     // poses
//     new Uint8Array([]),
//     // binds
//     // new TextEncoder().encode(JSON.stringify({}))
// ])
