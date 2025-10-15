// This is example for generation of admin panel project
import { generateProject } from "./index.js";
import logger from "./lib/logger.js";

(async () => {
    try {
        const target = "./generated-admin";
        await logger.info("Starting admin panel generation...", { target });
        await generateProject({ projectPath: target, models: ["User", "Post"], projectRoot: process.cwd() });
        console.log("Generation finished.");
        await logger.info("Generation finished successfully.", { target });

        console.log("cd generated-admin && npm install && npm run dev");
        await logger.info("Next steps logged.", {
            command: "cd generated-admin && npm install && npm run dev",
        });
    } catch (err) {
        console.error(err);
        await logger.error("Admin panel generation failed", { error: err.message });
    }
})();
