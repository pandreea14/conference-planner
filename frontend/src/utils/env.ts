// Extend the Window interface to include the env property
declare global {
  interface Window {
    env?: Record<string, string>;
  }
}

const runtimeEnv = window.env || {};
const compileEnv = import.meta.env;
const env = { ...compileEnv, ...runtimeEnv };

export { env };
export default env;
