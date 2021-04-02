import { Frame_Buffer } from "../../core/render/texture/Frame_Buffer.js"
import geometry_pass from "./passes/geometry_pass.js"
import deferred_pass from "./passes/deferred_pass.js"
import gl from "../../core/render/gl/gl.js"

const g_buffer = Frame_Buffer([1000,1000])

export default function engine() {

    // gl.clearColor(0.5,0.5,0.5,0.5)
    // gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )


    g_buffer.write()
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT )
    geometry_pass()
    g_buffer.swap()

    g_buffer.read()
    deferred_pass()
    g_buffer.stop()
}

console.log(gl)