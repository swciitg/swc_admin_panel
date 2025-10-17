// This is example for generation of admin panel project
import { generateProject } from "./index.js";
import logger from "./lib/logger.js";

(async () => {
    try {
        const target = "./generated-admin";
        await generateProject({ projectPath: target, models: ["User", "Post"], projectRoot: process.cwd() });
        await logger.log("Generation finished.");
        await logger.log("cd generated-admin && npm install && npm run dev");
    } catch (err) {
        await logger.error(err);
    }
})();
