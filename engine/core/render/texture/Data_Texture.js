import { gl, T2D } from "../gl/gl.js";
import { set_parameters, TEXTURE_METHODS } from "./Texture.js";

function make_data_texture(data, stride, width, type, filtering) {
  let format, n_bind_locations = stride <= 4 ? 1 : Math.sqrt(stride)
  switch (stride) {
    default:
    case 16:
    case 4: format = gl.RGBA
      break
    case 9:
    case 3: format = gl.RGB
      break
    case 2: format = gl.LUMINANCE_ALPHA
      break
    case 1: format = gl.ALPHA
      break
  }
  let texture = gl.createTexture();
  gl.bindTexture(T2D, texture)

  let width_in_pixels = n_bind_locations * width
  let height_in_pixels = data.length / (stride * width)

  gl.texImage2D(T2D, 0, format,
    width_in_pixels,
    height_in_pixels,
    0, format, type, data)
  set_parameters(filtering)
  return texture
}

export function Data_Texture(data, stride = data.stride, width = 1) {
  return {
    texture: make_data_texture(data, stride, width, gl.FLOAT, gl.NEAREST),
    data: data,
    ...TEXTURE_METHODS
  }
}

export function Filtered_Data_Texture(data, stride = data.stride, width = 1) {
  return {
    texture: make_data_texture(data, stride, width, gl.UNSIGNED_BYTE, gl.LINEAR),
    data: data,
    ...TEXTURE_METHODS,
  }
}