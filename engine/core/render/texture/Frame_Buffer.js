import { gl, T2D, US, DC, DCA, C0, FB } from "../gl/gl.js"
import { VIEWPORT_DIM } from "../../../declarations/standards.js"
import { Texture, set_parameters } from "./Texture.js"

export function Frame_Buffer(dim) {
    let [x, y] = dim
    let tex = Texture(dim)

    let depth = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, depth);
    gl.texImage2D(T2D, 0, DC, x, y, 0, DC, US, null)
    set_parameters(gl.LINEAR, gl.NEAREST)

    let fbo = gl.createFramebuffer()

    gl.bindFramebuffer(FB, fbo);
    gl.framebufferTexture2D(FB, C0, T2D, tex.texture, 0)
    gl.framebufferTexture2D(FB, DCA, T2D, depth, 0)
    gl.bindFramebuffer(FB, null);

    return {
        ...tex,
        fbo,
        x,
        y,
        write() {
            gl.bindFramebuffer(FB, this.fbo)
            gl.viewport(0, 0, this.x, this.y)
        },
        swap() {
            gl.bindFramebuffer(FB, null)
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
        }
    }
}