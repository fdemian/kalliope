// Export a function so this is not tree-shaken,
// but evaluate it immediately so it executes before
// lexical computes CAN_USE_BEFORE_INPUT

export default (() => {
  // @ts-ignore
  window.EXCALIDRAW_ASSET_PATH = process.env.EXCALIDRAW_ASSET_PATH;
  return null;
})();