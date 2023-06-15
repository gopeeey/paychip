type ArgsType = {
    error: unknown;
    message?: string;
    channels?: ("console" | "external")[];
};

export const logError = async ({ error, message, channels }: ArgsType) => {
    if (!channels || !channels.length || channels.includes("console")) {
        console.log(`\n\n\n${message ? message : ""}`, error);
    }

    if (channels && channels.includes("external")) {
        // This is where you log to your external service like sentry
        // when you're ready
    }
};
