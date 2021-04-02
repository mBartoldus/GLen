import GL_Program from "../../../core/render/gl/create_program.js"
import { GUI } from "../../../core/render/mesh/MeshGUI.js"
import { Loc, Meshes } from "../../../declarations/descriptors.js"
import { m, v } from "../../../lib/lowercase_v.js"


const camera = m.identity(3)


let g_pass_glsl = [
  `
    precision lowp float;
    attribute vec3 pos;
    attribute vec3 norm;
    attribute vec3 color;

    attribute vec3 loc;

    varying vec3 normal;
    varying vec3 col;

    uniform mat3 camera;

    void main(void) {
      normal = norm;
      col = color;

      vec3 a_pos = camera * (pos + loc);

      float dist = distance(a_pos, vec3(0.0, 50.0, 0.0));

      gl_Position = vec4( a_pos.xz * dist / 500.0, a_pos.y * 0.01, 1.0 );
    }
  `,
  `
    precision lowp float;
    varying vec3 normal;
    varying vec3 col;
    void main(void) {

      vec3 lightSource = vec3(0.577, 0.577, 0.577);

      float diffuse = dot(  normal, lightSource  ) * 0.3 + 0.5;

      gl_FragColor = vec4(diffuse * col + vec3(0.1,0.1,0.2), 1.0);
    }
  `
]

const G_program = GL_Program(g_pass_glsl, {
  vertex_attributes: {
    pos: 3,
    norm: 3,
    color: 3,
  },
  uniforms: {
    camera: [3]
  },
  instance_attributes: {
    loc: 3
  }
})


export default function geometry_pass() {

  G_program.use()
  G_program.set_uniforms({
    camera: m(3).from_axis(performance.now() / 20000, [0, 0, 1])
  })

  let mesh = Meshes.definitions.get(GUI.mesh_dropdown.value)
  if (mesh.is_complete)
    G_program.draw(mesh.vertices, mesh.indices, Loc, 27)
}