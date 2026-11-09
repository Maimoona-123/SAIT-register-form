import { IPropertyListDescriptor } from '../property-descriptor';
import { type BackgroundPosition } from './background-position';
import { type BackgroundRepeat } from './background-repeat';
import { type BackgroundSize } from './background-size';
import { ICSSImage } from '../types/image';
/**
 * CSS Masking (mask-image / mask-position / mask-repeat / mask-size).
 *
 * Value grammars are identical to their background counterparts, so the
 * background parsers are reused verbatim — including the addImage side
 * effect that requires `skipCache` on mask-image. -webkit-mask-* aliases
 * resolve to these properties in computed style.
 *
 * mask-mode/mask-clip/mask-origin/mask-composite are accepted by the browser
 * but not parsed here; rendering assumes the default alpha masking with
 * `add` layer compositing.
 */
export type MaskImage = ICSSImage[];
export type MaskPosition = BackgroundPosition;
export type MaskRepeat = BackgroundRepeat;
export type MaskSize = BackgroundSize;
export declare const maskImage: IPropertyListDescriptor<MaskImage>;
export declare const maskPosition: IPropertyListDescriptor<MaskPosition>;
export declare const maskRepeat: IPropertyListDescriptor<MaskRepeat>;
export declare const maskSize: IPropertyListDescriptor<MaskSize>;
