import { IPropertyListDescriptor } from '../property-descriptor';
import { ICSSImage } from '../types/image';
export type BoxReflectDirection = 'below' | 'above' | 'left' | 'right';
export interface BoxReflect {
    direction: BoxReflectDirection;
    /** Gap between the element and its reflection, in pixels. */
    offset: number;
    /** Optional mask applied to the reflection (element coordinate space). */
    mask: ICSSImage | null;
}
export type BoxReflectValue = BoxReflect | null;
/**
 * -webkit-box-reflect: <direction> <offset>? <mask-image>?
 *
 * Chrome serialises the computed value with the mask's border-image
 * bookkeeping appended (e.g. "... linear-gradient(...) 0 fill / auto /
 * 0 stretch"), so tokens after the image are parsed and ignored.
 */
export declare const webkitBoxReflect: IPropertyListDescriptor<BoxReflectValue>;
