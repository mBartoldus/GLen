/*
    template literal library for glsl
*/

const vec4_from_tex = `
  vec4 vec4_from_tex(sampler2D smp, float index) {
    return texture2D(smp, vec2(0.5, index));
  }
`
const mat3_from_tex = `
  mat3 mat3_from_tex(sampler2D smp, float index) {
    return mat3(
      texture2D(smp, vec2(0.166, index)).xyz,
      texture2D(smp, vec2(0.5, index)).xyz,
      texture2D(smp, vec2(0.833, index)).xyz
    );
  }
`
const mat4_from_tex = `
  mat4 mat4_from_tex(sampler2D smp, float index) {
    return mat4(
      texture2D(smp, vec2(0.125, index)),
      texture2D(smp, vec2(0.375, index)),
      texture2D(smp, vec2(0.625, index)),
      texture2D(smp, vec2(0.875, index))
    );
  }
`

// this one's presently called "get offset" but
// the reason it's separate from other data textures is the use of filtering (interpolation)
// i should change the name to reflect that for ease of reuse

const get_offset = `
  vec4 get_offset(float frame, float index) {
    return texture2D(animation_tex, vec2(frame, index)) * 2.0 - vec4(1.0) ;
  }
`










// export let g_pass_glsl = GLSL({
//   v: `
//     precision lowp float;

//     // Per-Vertex:

//     attribute vec3 pos;
//     attribute vec3 norm;

//     attribute vec2 uv;
//     attribute vec2 bone_ids;
//     attribute vec2 bone_weights;

//     attribute float pos_offset_id;
//     attribute float norm_offset_id;
//     attribute float uv_offset_id;
//     attribute float material;       // stride 16... nice



//     // Per-Instance:

//     attribute float entity_id;
//     attribute float pose_id;
//     attribute float animation_frame;
//     // attribute vec2 animation_weight;

//                                     // total attrib binds: 12

//     // Uniforms:

//     uniform mat3 cam_rot;
//     uniform vec3 cam_loc;

//     uniform sampler2D loc_tex;
//     uniform sampler2D rot_tex;
//     uniform sampler2D scale_tex;

//     uniform sampler2D pose_tex;
//     uniform sampler2D animation_tex;

//     // Varyings:

//     varying vec3 normal;
//     varying vec2 texcoord;

//     ${get_offset}
//     ${vec4_from_tex}

    
//     void main(void) {

//       float tmp = (uv + bone_ids + bone_weights).x - uv_offset_id - material + entity_id + pose_id;

//       tmp *= 0.00000001;
//       tmp += 1.0;

//       vec3 loc = texture2D(loc_tex, vec2(0.5, entity_id)).xyz;

//       vec3 ooo = pos_offset_id <= 0.0 ? vec3(0.0) : get_offset(animation_frame, pos_offset_id).xyz;
//       vec3 nnn = norm_offset_id <= 0.0 ? vec3(0.0) : get_offset(animation_frame, norm_offset_id).xyz;

//       normal = cam_rot * (norm + nnn);

//       vec3 lll = cam_rot * ( loc + pos + ooo - cam_loc ) * texture2D(scale_tex, vec2(0.5, entity_id)).a;

//       float z = distance(lll, vec3(0.0,0.0,-1.0)) * tmp;

//       gl_Position = vec4( 5.0 * lll.xy / z, lll.z * 0.01, 1.0);
      
//     }`,
//   f: `
//     precision lowp float;

//     varying vec3 normal;
//     varying vec2 texcoord;

//     uniform sampler2D albedo_tex;

//     void main(void) {
//       /*
//       vec3 shade = vec3(0.2,0.1,0.25);

//       if(dot(color, vec3(0.6)) < 0.2) { shade = color; }

//       float shading = dot(normal, normalize(vec3(-1.0, -2.0, 1.0)));
//       shading = (shading + 1.0)*0.5;

//       float cel = shading < 0.5 ? 0.5 : 1.0;

//       shading = shading*0.5 + cel*0.5;

//       gl_FragColor = vec4(color * shading + shade * (1.0-shading), 1.0);
//       */

//       float exposure = dot(normal, vec3(0.0,0.5,0.0)) + 0.5;

//       gl_FragColor = vec4(vec3(0.5,0.8,0.75) * exposure, exposure);
//     }
//     `
// })

// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////

// export let d_pass_glsl = GLSL({
//   v: `
//   precision lowp float;

//   attribute vec2 pos;
//   varying vec2 uv;

//   void main(void) {
//     uv = pos * 0.5 + vec2(0.5);
//     gl_Position = vec4( pos, 0.0, 1.0);
//   }
//   `,
//   f: `
//   precision lowp float;

//   uniform sampler2D uSampler;
//   varying vec2 uv;

//   void main(void) {
//     gl_FragColor = texture2D(uSampler, uv);
//   }
//   `
// })

// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////////

// export let p_pass_glsl = GLSL({
//   v: `
//   precision lowp float;

//   attribute vec2 pos;
//   attribute float frame;
//   varying vec2 uv;

//   void main(void) {
//     uv = pos * 0.5 + vec2(0.5);
//     gl_Position = vec4( pos.x, frame, 0.0, 1.0);
//   }
//   `,
//   f: `
//   precision lowp float;

//   uniform sampler2D uSampler;
//   varying vec2 uv;

//   void main(void) {
//     gl_FragColor = texture2D(uSampler, uv);
//   }
//   `
// })