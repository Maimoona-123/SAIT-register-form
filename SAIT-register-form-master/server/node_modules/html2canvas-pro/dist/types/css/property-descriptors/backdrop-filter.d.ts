import { IPropertyListDescriptor } from '../property-descriptor';
import { type FilterValue } from './filter';
/**
 * backdrop-filter shares the filter value grammar and canvas filter string
 * reconstruction. Rendering captures the already-painted backdrop region and
 * applies the filter surface pipeline to it.
 */
export type BackdropFilter = FilterValue;
export declare const backdropFilter: IPropertyListDescriptor<BackdropFilter>;
