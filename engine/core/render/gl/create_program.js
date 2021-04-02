import { gl, gl_ANGLE, gl_VAO } from "./gl.js"

const GL_PROGRAM_METHODS = {
    use() {
        gl_VAO.bindVertexArrayOES(this.vao)
        gl.useProgram(this.program)
    },
    stop() { gl_VAO.bindVertexArrayOES(null) },
    set_uniforms(uniform_values) {
        for (let bind in uniform_values) {
            this.uniform_setters[bind](uniform_values[bind])
        }
    },
    draw(vertex_data, index_data, instance_data, count) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer)
        gl.bufferData(gl.ARRAY_BUFFER, vertex_data, gl.STATIC_DRAW)

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer)
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, index_data, gl.STATIC_DRAW)

        if (this.instance_buffer.stride) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.instance_buffer)
            gl.bufferData(gl.ARRAY_BUFFER, instance_data, gl.STATIC_DRAW)

            gl_ANGLE.drawElementsInstancedANGLE(gl.TRIANGLES, index_data.length,
                gl.UNSIGNED_SHORT, 0, count ?? instance_data.length / this.instance_buffer.stride)
        } else {
            gl.drawElements(gl.TRIANGLES, index_data.length, gl.UNSIGNED_SHORT, 0)
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, null)
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    },
    lines(points, dimension = 2) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.v_buffer)
        gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)

        gl.drawArrays(gl.LINE_STRIP, 0, points.length / dimension)
    }
}


function init_arraybuffer(program, attributes, divisor) {
    let buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    let stride = 0
    for (let bind in attributes) {
        let dim = attributes[bind]
        let length = typeof dim == "number" ? dim : dim[0] * (dim[1] ?? dim[0])
        stride += length
    }
    let offset = 0
    for (let bind in attributes) {
        let dimensions = attributes[bind]
        let attribute_location = gl.getAttribLocation(program, bind)

        // find number of bind locations required
        let n_binds = typeof dimensions == "number" ? 1 : dimensions[1]
        let length = n_binds == 1 ? dimensions : dimensions[0]

        for (let i = 0; i < n_binds; i++) {
            let bind_location = attribute_location + i
            /*  very useful debugging tool right here */
            // console.log(name + " at " + bind_loc + " with " + n_binds + " binds and length " + length)
            gl.enableVertexAttribArray(bind_location)
            gl.vertexAttribPointer(bind_location, length, gl.FLOAT, false, stride * 4, offset * 4)
            gl_ANGLE.vertexAttribDivisorANGLE(bind_location, divisor)
            offset += length
        }
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    buffer.stride = stride
    return buffer
}

export default function GL_Program(glsl, config) {
    let {
        vertex_attributes = {},
        instance_attributes = {},
        uniforms = {},
    } = config

    let program = gl.createProgram()

    // attach shaders
    for (let i in glsl) {
        let shader = gl.createShader([gl.VERTEX_SHADER, gl.FRAGMENT_SHADER][i])
        gl.shaderSource(shader, glsl[i])
        gl.compileShader(shader)
        gl.attachShader(program, shader)
    }
    gl.linkProgram(program)


    let vao = gl_VAO.createVertexArrayOES()
    gl_VAO.bindVertexArrayOES(vao)
    let vertex_buffer = init_arraybuffer(program, vertex_attributes, 0)
    let index_buffer = gl.createBuffer()
    let instance_buffer = init_arraybuffer(program, instance_attributes, 1)
    gl_VAO.bindVertexArrayOES(null)

    let uniform_setters = []
    for (let tag in uniforms) {
        let uniform_location = gl.getUniformLocation(program, tag)
        let setter
        let is_matrix = false

        let dim = uniforms[tag]
        if (typeof dim === "object") {
            is_matrix = true;
            switch (dim[0]) {
                case 2: setter = "uniformMatrix2fv"; break
                default:
                case 3: setter = "uniformMatrix3fv"; break
                case 4: setter = "uniformMatrix4fv"; break
            }
        } else {
            switch (dim) {
                default:
                case "sampler": setter = "uniform1i"; break;
                case 1: setter = "uniform1f"; break;
                case 2: setter = "uniform2fv"; break;
                case 3: setter = "uniform3fv"; break;
            }
        }
        uniform_setters[tag] = is_matrix ?
            value => gl[setter](uniform_location, false, value) :
            value => gl[setter](uniform_location, value)
    }

    return {
        program,
        vertex_buffer,
        index_buffer,
        instance_buffer,
        vao,
        uniform_setters,
        ...GL_PROGRAM_METHODS,
    }
}


