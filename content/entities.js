import Entity from "../engine/core/Entity.js"
import { v } from "../engine/lib/lowercase_v.js"

for (let i = -1; i <= 1; i++)
    for (let j = -1; j <= 1; j++)
        for (let k = -1; k <= 1; k++)
            Entity({
                mesh: "bird",
                loc: v(3).randomize(5, v(i, j, k).scale(10))
            })







