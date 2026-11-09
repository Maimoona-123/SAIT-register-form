import { IPropertyValueDescriptor, IPropertyIdentValueDescriptor } from '../property-descriptor';
import { type Color } from '../types/color';
export declare const enum OUTLINE_STYLE {
    NONE = 0,
    AUTO = 1,
    SOLID = 2,
    DASHED = 3,
    DOTTED = 4,
    DOUBLE = 5
}
export type OutlineColor = Color | null;
export declare const outlineStyle: IPropertyIdentValueDescriptor<OUTLINE_STYLE>;
export declare const outlineColor: IPropertyValueDescriptor<OutlineColor>;
export declare const outlineWidth: IPropertyValueDescriptor<number>;
export declare const outlineOffset: IPropertyValueDescriptor<number>;
