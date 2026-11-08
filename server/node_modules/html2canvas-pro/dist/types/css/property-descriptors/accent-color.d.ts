import { IPropertyValueDescriptor } from '../property-descriptor';
import { type Color } from '../types/color';
/** `null` represents the `auto` keyword: browser-default control colour. */
export type AccentColor = Color | null;
export declare const accentColor: IPropertyValueDescriptor<AccentColor>;
