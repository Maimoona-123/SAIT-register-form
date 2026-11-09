import { IPropertyValueDescriptor } from '../property-descriptor';
import { type Color } from '../types/color';
/**
 * `null` represents `currentcolor`: the text renderer falls back to `color`.
 * Computed styles resolve currentcolor in browsers, but jsdom and older
 * engines may hand us the keyword verbatim.
 */
export type WebkitTextFillColor = Color | null;
export declare const webkitTextFillColor: IPropertyValueDescriptor<WebkitTextFillColor>;
