declare module '*.webp' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

// TODO: should take the src/types/islefire-xr-0.d.ts!!
// declare var XR: {
//   createCore: () => any; // Adjust the return type accordingly
// };

declare namespace XR {
  interface XrConfig {
      fullscreen: boolean;
      xr: boolean;
  }
  interface XrCore {
  }
  function createCore(xrconfig?: XrConfig): XrCore;
}
