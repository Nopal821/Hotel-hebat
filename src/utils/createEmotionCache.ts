import createCache from "@emotion/cache";

// Buat cache untuk styling Emotion
const createEmotionCache = () => {
  return createCache({ key: "css", prepend: true });
};

export default createEmotionCache;
