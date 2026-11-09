import { CSSValue } from '../../syntax/parser';
import { ICSSImage } from '../image';
import { Context } from '../../../core/context';
/**
 * image-set(url(a.png) 1x, url(b.png) 2x)
 *
 * Browsers keep image-set in the computed value, so the candidate matching
 * the current devicePixelRatio is selected here: the smallest resolution >=
 * DPR, falling back to the largest candidate below it.
 */
export declare const imageSet: (context: Context, tokens: CSSValue[]) => ICSSImage;
