"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = require("./config/db");
const env_1 = require("./config/env");
const bootstrap = async () => {
    await (0, db_1.connectDb)();
    app_1.app.listen(env_1.env.PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`WWU backend running on port ${env_1.env.PORT}`);
    });
};
bootstrap().catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Failed to start server", err);
    process.exit(1);
});
