module.exports = {
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve = config.resolve || {};
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false
            };
        }

        return config;
    }
};
