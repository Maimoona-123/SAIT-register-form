/**
 * CSS property registry and value parser.
 *
 * Owns the canonical list of parsed standard properties (the single place to
 * register a new CSS property: add the descriptor import and one table row)
 * and the shared LRU parse cache that turns computed style strings into
 * strongly-typed values.
 *
 * Extracted from css/index.ts so the declaration data class stays free of
 * parsing machinery.
 */
import { CSSPropertyDescriptor } from './property-descriptor';
import { Context } from '../core/context';
export declare const STANDARD_PROPERTIES: [string, CSSPropertyDescriptor<unknown>, string][];
export declare const parse: (context: Context, descriptor: CSSPropertyDescriptor<any>, style?: string | null) => any;
