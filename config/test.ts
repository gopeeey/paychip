import defaultConfig from "./default";

const testConfig = {
    ...defaultConfig,
    server: {
        ...defaultConfig.server,
        port: 4001,
    },
    db: {
        ...defaultConfig.db,
        postgres: {
            ...defaultConfig.db.postgres,
            name: "paychip_test",
        },
    },
};

export default testConfig;
