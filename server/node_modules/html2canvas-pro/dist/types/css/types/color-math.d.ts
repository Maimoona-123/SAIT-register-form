/**
 * Color mathematics utilities
 * Extracted to break circular dependency between srgb.ts and color-utilities.ts
 */
/**
 * Clamp a value between min and max
 */
export declare const clamp: (value: number, min: number, max: number) => number;
/** An RGB triple. */
export type RGB3 = [number, number, number];
/** An RGBA color as separate components. */
export type RGBA4 = [number, number, number, number];
/** A 3x3 matrix stored row-major as nine numbers. */
export type Matrix3x3 = [number, number, number, number, number, number, number, number, number];
/**
 * Multiply two 3x3 matrices
 */
export declare const multiplyMatrices: (A: Matrix3x3, B: RGB3) => RGB3;
