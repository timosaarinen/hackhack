export declare namespace XR {
    interface XrConfig {
        fullscreen: boolean;
        xr: boolean;
    }
    interface XrCore {
    }
    export function createCore(xrconfig?: XrConfig): XrCore;
    export {};
}
