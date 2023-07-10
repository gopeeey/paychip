import { ImdsInterface } from "@bases/logic";
import { RedisClientType, createClient } from "redis";
import config from "src/config";
import { generateId } from "src/utils";

const redisConfig = config.thirdParty.redis;

export class RedisService implements ImdsInterface {
    private readonly client;

    constructor(client?: RedisClientType) {
        this.client =
            client ||
            createClient({
                url: `redis://${redisConfig.url}`,
                password: redisConfig.password,
            });
    }

    lock: ImdsInterface["lock"] = async (value, seconds) => {
        await this.client.connect();
        const lockId = generateId();
        const res = await this.client.sendCommand([
            "SET",
            value,
            lockId,
            "NX",
            "PX",
            `${seconds * 1000}`,
        ]);
        await this.client.disconnect();

        if (!res) return null;
        return lockId;
    };

    release: ImdsInterface["release"] = async (key, lock) => {
        await this.client.connect();
        const val = await this.client.get(key);

        if (val) {
            if (val !== lock) {
                await this.client.disconnect();
                return false;
            } else {
                await this.client.del(key);
            }
        }

        await this.client.disconnect();
        return true;
    };
}
