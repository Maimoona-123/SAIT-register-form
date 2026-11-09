import { Html2CanvasConfig } from '../config';
import type { Options } from '../options';
/**
 * Progress milestones emitted via `Options.onProgress`.
 * Phase names are stable API; percentages are coarse estimates.
 */
export declare const enum ProgressPhase {
    CLONE = "clone",
    PARSE = "parse",
    PRELOAD = "preload",
    LAYOUT = "layout",
    RENDER = "render"
}
export declare const renderElement: (element: HTMLElement, opts: Partial<Options>, config: Html2CanvasConfig) => Promise<HTMLCanvasElement>;
