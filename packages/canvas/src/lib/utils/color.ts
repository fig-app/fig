import type { Color } from "@fig/types/Color";


export function colorToString(color: Color) {
    return `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
}
