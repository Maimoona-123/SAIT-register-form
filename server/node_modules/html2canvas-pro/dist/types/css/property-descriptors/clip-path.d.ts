import { IPropertyValueDescriptor } from '../property-descriptor';
import { LengthPercentage } from '../types/length-percentage';
export declare const enum CLIP_PATH_TYPE {
    NONE = 0,
    INSET = 1,
    CIRCLE = 2,
    ELLIPSE = 3,
    POLYGON = 4,
    PATH = 5,
    XYWH = 6
}
/** Radius keyword or length-percentage for circle/ellipse. */
export type ShapeRadius = LengthPercentage | 'closest-side' | 'farthest-side';
export interface NoneClipPath {
    type: CLIP_PATH_TYPE.NONE;
}
/**
 * inset(top right bottom left [ round <border-radius> ]?)
 * Amounts to cut from each side of the reference box.
 */
export interface InsetClipPath {
    type: CLIP_PATH_TYPE.INSET;
    top: LengthPercentage;
    right: LengthPercentage;
    bottom: LengthPercentage;
    left: LengthPercentage;
}
/**
 * circle( [ <shape-radius> ]? [ at <position> ]? )
 */
export interface CircleClipPath {
    type: CLIP_PATH_TYPE.CIRCLE;
    radius: ShapeRadius;
    cx: LengthPercentage;
    cy: LengthPercentage;
}
/**
 * ellipse( [ <shape-radius>{2} ]? [ at <position> ]? )
 */
export interface EllipseClipPath {
    type: CLIP_PATH_TYPE.ELLIPSE;
    rx: ShapeRadius;
    ry: ShapeRadius;
    cx: LengthPercentage;
    cy: LengthPercentage;
}
/**
 * polygon( [ <fill-rule>, ]? [ <length-percentage> <length-percentage> ]# )
 */
export interface PolygonClipPath {
    type: CLIP_PATH_TYPE.POLYGON;
    points: [LengthPercentage, LengthPercentage][];
}
/**
 * path( [ <fill-rule>, ]? <string> )
 * The string contains SVG path data in the element's local coordinate space.
 */
export interface PathClipPath {
    type: CLIP_PATH_TYPE.PATH;
    d: string;
}
/**
 * xywh( <length-percentage>{2} <length-percentage>{2} [ round <'border-radius'> ]? )
 * A rectangle at (x, y) with the given width and height, from the top-left
 * corner of the reference box. The optional round clause is parsed but
 * ignored (same as inset).
 */
export interface XywhClipPath {
    type: CLIP_PATH_TYPE.XYWH;
    x: LengthPercentage;
    y: LengthPercentage;
    width: LengthPercentage;
    height: LengthPercentage;
}
export type ClipPathValue = NoneClipPath | InsetClipPath | CircleClipPath | EllipseClipPath | PolygonClipPath | PathClipPath | XywhClipPath;
export declare const clipPath: IPropertyValueDescriptor<ClipPathValue>;
