import { Archetypal_Descriptor } from "./Archetypal.js";

import { parse_GLEN } from "../render/mesh/glen/parse_GLEN.js"


// maybe have texture be a different descriptor???.... idk figure out texture later

// add format parameter perhaps

async function load_method(name) {
    // if (!(name in paths)) throw "couldn't find mesh"
    let file = await fetch("GLen/content/assets/visuals/mesh/" + name + ".glen")
    return parse_GLEN(file)
}

export function Mesh_D(tag) { return Archetypal_Descriptor(tag, load_method) } // encapsulate for different vertex attribute formats?

