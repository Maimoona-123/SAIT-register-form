import { IPropertyListDescriptor } from '../property-descriptor';
export type BorderImageWidthSide = {
    kind: 'auto';
} | {
    kind: 'length';
    value: number;
} | {
    kind: 'percentage';
    value: number;
} | {
    kind: 'number';
    value: number;
};
/**
 * border-image-width controls the width of the nine-slice border areas.
 * `auto` (= the corresponding border width), `number` (multiples of the
 * border width), lengths and percentages of the border image area are all
 * resolved against the border widths at render time.
 */
export declare const borderImageWidth: IPropertyListDescriptor<{
    top: BorderImageWidthSide;
    right: BorderImageWidthSide;
    bottom: BorderImageWidthSide;
    left: BorderImageWidthSide;
}>;
export interface BorderImageOutset {
    top: BorderImageWidthSide;
    right: BorderImageWidthSide;
    bottom: BorderImageWidthSide;
    left: BorderImageWidthSide;
}
/**
 * border-image-outset pushes the border image area outside the border box.
 * Only lengths and numbers (multiples of the border width) are valid here.
 */
export declare const borderImageOutset: IPropertyListDescriptor<BorderImageOutset>;
