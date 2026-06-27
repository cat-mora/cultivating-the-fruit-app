const upstreamTransformer = require("@expo/metro-config/babel-transformer");

/**
 * Custom Metro transformer to handle import.meta
 * Replaces import.meta with a polyfill object during bundling
 */
module.exports.transform = async ({ src, filename, options }) => {
  // Replace import.meta BEFORE transformation for web
  let source = src;
  if (options.platform === "web") {
    // Replace import.meta with a safe polyfill
    source = src.replace(
      /import\.meta/g,
      '({env:process.env||{},url:typeof window!=="undefined"?window.location.href:""})',
    );
  }

  // Apply the default Expo transformer with modified source
  const result = await upstreamTransformer.transform({
    src: source,
    filename,
    options,
  });

  return result;
};
