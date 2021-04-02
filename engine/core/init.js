
// import Mesh_From_DAE from "../../descriptor/classes/mesh/convert/Mesh_From_DAE.js"
// import { save_mesh } from "../../descriptor/classes/mesh/Save_Mesh.js"

/*

import { initialize_audio_context } from "./audio/webaudio/context.js"

const valid_interactions = ["onclick", "ontouchstart"]

function set_interaction_callback(callback) { for (let on of valid_interactions) window[on] = callback }
function interaction_dependent_init() {
    initialize_audio_context()
    // do more...
    console.log("the user has interacted")
    set_interaction_callback(null)
    // initialize actual inputs, when you get around to it
    // by connecting the controllers so to speak
}
set_interaction_callback(interaction_dependent_init)

/*
document.getElementById("drop_zone").onchange = async function () {
    let converted_mesh = Mesh_From_DAE(await this.files[0].text())
    console.log(converted_mesh)
    save_mesh(converted_mesh)
}
*/