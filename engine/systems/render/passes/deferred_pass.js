import GL_Program from "../../../core/render/gl/create_program.js"

let v_data = new Float32Array([
  0, 0,
  1, 1,
  0, 1,
  1, 0
])
let i_data = new Uint16Array([
  0, 1, 2,
  0, 3, 1,
])

let d_pass_glsl = [
  `
    precision lowp float;
    attribute vec2 pos;
    varying vec2 uv;
    void main(void) {
      uv = pos;
      gl_Position = vec4( pos * 2.0 - vec2(1.0), 0.0, 1.0);
    }
  `,
  `
    precision lowp float;
    varying vec2 uv;
    uniform sampler2D uSampler;
    void main(void) {

      gl_FragColor = texture2D(uSampler, uv);
    }
  `
]

const D_program = GL_Program(d_pass_glsl, {
  vertex_attributes: {
    pos: 2
  },
  uniforms: {
    uSampler: "sampler"
  }
})


export default function deferred_pass() {
  D_program.use()
  D_program.draw(v_data, i_data)
}