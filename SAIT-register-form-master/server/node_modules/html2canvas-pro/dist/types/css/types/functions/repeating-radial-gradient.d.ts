import { CSSValue } from '../../syntax/parser';
import { CSSRadialGradientImage } from '../image';
import { Context } from '../../../core/context';
/**
 * repeating-radial-gradient shares the radial-gradient grammar exactly; only
 * the image type differs, which switches the renderer to periodic stops.
 */
export declare const repeatingRadialGradient: (context: Context, tokens: CSSValue[]) => CSSRadialGradientImage;
