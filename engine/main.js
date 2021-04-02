import "./declarations/descriptors.js"
import "../content/entities.js"

// import "../input/exports.js"
// import "./core/init.js"

// import logic_engine from "./logic/engine.js"
// import physics_engine from "../physics/engine.js"
// import audio_engine from "../audio/engine.js"
import render_engine from "./systems/render/render_engine.js"

function main() {

    // logic_engine()
    // physics_engine()
    // audio_engine()
    render_engine()

    window.requestAnimationFrame(main)
}

main()