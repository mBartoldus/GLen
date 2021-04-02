import { gl, T2D, RGBA, UB } from "../gl/gl.js"

export const TEXTURE_METHODS = {
    read(unit = 0) { gl.activeTexture(gl["TEXTURE" + unit]), gl.bindTexture(T2D, this.texture) },
    stop() { gl.bindTexture(T2D, null) },
}

export function set_parameters(min = gl.NEAREST, mag = min) {
    gl.texParameteri(T2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(T2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(T2D, gl.TEXTURE_MIN_FILTER, min)
    gl.texParameteri(T2D, gl.TEXTURE_MAG_FILTER, mag)
    gl.bindTexture(T2D, null);
}

export function Texture(dim = 32, options = {}) {

    let [x, y] = typeof dim == "number" ? [dim, dim] : dim
    let { path } = options // filtering?

    let texture = gl.createTexture()
    gl.bindTexture(T2D, texture)
    if (path) { gl.texImage2D(T2D, 0, RGBA, RGBA, UB, document.getElementById(path)) }  // maybe await fetch
    else { gl.texImage2D(T2D, 0, RGBA, x, y, 0, RGBA, UB, new Uint8Array(x * y * 4)) }
    set_parameters(gl.LINEAR, gl.NEAREST)

    return {
        texture: texture,
        ...TEXTURE_METHODS
    }
}