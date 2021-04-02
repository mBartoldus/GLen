import { to_GLEN } from "./glen/to_GLEN.js"

import { parse_GLEN } from "./glen/parse_GLEN.js"
import { parse_DAE } from "./dae/parse_DAE.js"
import { Meshes } from "../../../declarations/descriptors.js"


const vertex_attributes = {
    pos: 3,
    norm: 3,
    // uv: 2,

    // pos_offset_id: 1,
    // norm_offset_id: 1,
    // uv_offset_id: 1,

    // bone_ids: 2,
    // bone_weights: 2,

    // material: 1,
    color: 3,
}

class MeshGUI extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode: "open"})

        this.addEventListener("dragover", e => e.preventDefault())
        this.addEventListener("drop", this.handle_drop)

        this.mesh_dropdown = document.createElement("select")
        this.shadowRoot.append(this.mesh_dropdown)
        this.add_option("bird")
        this.mesh_dropdown.addEventListener("change", ()=>{
            let val = this.mesh_dropdown.value
            console.log(Meshes.definitions.get(val))
        })
    }

    handle_drop(event) {
        event.preventDefault()
        for (let file of event.dataTransfer.files) {
            this.process_file(file)
        }
    }

    async process_file(file) {
        let mesh
        let [ name, extension ] = file.name.split(".")
        switch (extension) {
            case "glen":
                mesh = await parse_GLEN(file, vertex_attributes)
                break
            case "dae":
                mesh = await parse_DAE(file, vertex_attributes)
                break
            default:
                throw "invalid filetype! currently only accepts: .dae, .glen"
                break
        }
        Meshes.define(name, mesh)
        this.add_option(name)
        // this.download_mesh(mesh)
        return mesh
    }

    add_option(name) {
        let dropdown_option = document.createElement("option")
        dropdown_option.value = dropdown_option.innerText = name
        this.mesh_dropdown.appendChild(dropdown_option)

        this.mesh_dropdown.value = name
    }

    download_mesh(mesh) {
        let blob = to_GLEN(mesh)
        let link = document.createElement('a');
        link.download = mesh.name + '.glen';
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
    }
}

window.customElements.define("mesh-gui", MeshGUI)


export let GUI = document.createElement("mesh-gui")

document.body.appendChild(GUI)
GUI.classList.add("container")

/*
    to add later:
        mesh dropdown

        render options:
            n_instances
            uv keyframe / bind
                            animate
            shape keyframe / bind
                            animate
            pose keyframe / bind
                            animate

        download options
            vertex format:         // suggest instance attribs?
                pos
                uv
                bone_id
                bone_weight
                uv-offset_id
                shapekey id
                color

            indexed?
                does anything else need to be established???
*/