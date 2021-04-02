export const canvas = document.getElementById("luz")
export const gl = canvas.getContext('experimental-webgl', {
  //preserveDrawingBuffer: true,
  //stencil: true,
  //antialias: true,
  premultipliedAlpha: true,
})
export const gl_ANGLE = gl.getExtension('ANGLE_instanced_arrays')
export const gl_DEPTH = gl.getExtension('WEBGL_depth_texture')
export const gl_VAO = gl.getExtension('OES_vertex_array_object')
export const gl_FLOAT = gl.getExtension('OES_texture_float')
export const gl_LINEAR = gl.getExtension('OES_texture_float_linear')

export const gl_HALF = gl.getExtension('OES_texture_half_float')
export const gl_HALF_LINEAR = gl.getExtension('OES_texture_half_float_linear')

export const T2D = gl.TEXTURE_2D
export const RGBA = gl.RGBA
export const UB = gl.UNSIGNED_BYTE
export const US = gl.UNSIGNED_SHORT
export const DC = gl.DEPTH_COMPONENT
export const DCA = gl.DEPTH_ATTACHMENT
export const C0 = gl.COLOR_ATTACHMENT0
export const FB = gl.FRAMEBUFFER

export default gl

gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1)
gl.enable(gl.CULL_FACE)
gl.enable(gl.DEPTH_TEST)
gl.cullFace(gl.BACK)