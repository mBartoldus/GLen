import Descriptor from "./Descriptor.js";
import { Flat_Array, Woven_Array } from "../../lib/lowercase_v.js"
import { MAX_ENTITIES } from "../../declarations/standards.js";

export function Flat_D(tag, dimensions) {
    return Descriptor(tag, Flat_Array(MAX_ENTITIES, dimensions))
}

export function Woven_D(tag, format) {
    return Descriptor(tag, Woven_Array(MAX_ENTITIES, format))
}