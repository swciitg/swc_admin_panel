// This is example for generation of admin panel project
import { generateProject } from "./index.js";

(async () => {
    try {
        const target = "./generated-admin";
        await generateProject({ projectPath: target, models: ["User", "Post"], projectRoot: process.cwd() });
        console.log("Generation finished.");
        console.log("cd generated-admin && npm install && npm run dev");
    } catch (err) {
        console.error(err);
    }
})();
