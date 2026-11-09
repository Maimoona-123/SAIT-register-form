/**
 * Pro Photo related functions
 */
import { RGB3, RGBA4 } from '../color-math';
/**
 * Convert linear-light display-p3 to XYZ D65
 *
 * @param p3
 */
export declare const proPhotoLinearToXyz: (p3: [number, number, number]) => [number, number, number];
/**
 * Convert XYZ D65 to linear-light display-p3
 *
 * @param xyz
 */
export declare const xyzToProPhotoLinear: (xyz: [number, number, number]) => [number, number, number];
/**
 * Convert Pro-Photo to Pro-Photo Linear
 *
 * @param p3
 */
export declare const proPhotoToProPhotoLinear: (p3: RGB3) => RGB3;
/**
 * Convert Pro-Photo Linear to Pro-Photo
 *
 * @param p3
 */
export declare const proPhotoLinearToProPhoto: (p3: RGB3) => RGB3;
/**
 * Convert Pro-Photo to XYZ
 *
 * @param args
 */
export declare const proPhotoToXYZ: (args: RGB3) => RGB3;
/**
 * Convert XYZ to Pro-Photo
 *
 * @param args
 */
export declare const proPhotoFromXYZ: (args: [number, number, number, number]) => [number, number, number, number];
/**
 * Convert Pro-Photo to XYZ and Pack
 *
 * @param args
 */
export declare const convertProPhoto: (args: RGBA4) => number;
