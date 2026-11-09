import { IPropertyListDescriptor, IPropertyValueDescriptor } from '../property-descriptor';
import { type Color } from '../types/color';
export type TextEmphasisShape = 'dot' | 'circle' | 'double-circle' | 'triangle' | 'sesame';
/**
 * `null` — `none`. A string — custom mark character(s). Otherwise the keyword
 * pair resolved from the computed value (e.g. "filled circle").
 */
export type TextEmphasisStyle = {
    fill: boolean;
    shape: TextEmphasisShape;
} | string | null;
export declare const textEmphasisStyle: IPropertyListDescriptor<TextEmphasisStyle>;
/** `null` = currentcolor; the renderer falls back to the text colour. */
export type TextEmphasisColor = Color | null;
export declare const textEmphasisColor: IPropertyValueDescriptor<TextEmphasisColor>;
export interface TextEmphasisPosition {
    /** Marks above the text (over) or below (under). */
    over: boolean;
    /** Vertical-writing side for horizontal default; kept for completeness. */
    right: boolean;
}
export declare const textEmphasisPosition: IPropertyListDescriptor<TextEmphasisPosition>;
