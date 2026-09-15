const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");
const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

// The library package is linked from outside this Expo project. Resolve every
// runtime dependency from this example so React is loaded exactly once.
config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, "node_modules")];

module.exports = withNativeWind(config, {
  input: "./global.css",
});
