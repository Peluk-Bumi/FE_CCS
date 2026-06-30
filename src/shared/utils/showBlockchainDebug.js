/**
 * Blockchain debug FAB — development tooling only.
 * Hidden in production builds and when VITE_DEBUG_BLOCKCHAIN=false.
 */
export function showBlockchainDebug() {
  if (import.meta.env.PROD) return false;
  return import.meta.env.VITE_DEBUG_BLOCKCHAIN !== "false";
}
