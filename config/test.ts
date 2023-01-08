import defaultConfig from "./default";

const testConfig = {
    ...defaultConfig,
    server: {
        ...defaultConfig.server,
        port: 4001,
    },
};

export default testConfig;
