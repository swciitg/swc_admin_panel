import fs from "fs-extra";
import path from "path";
import ejs from "ejs";
import { fileURLToPath } from "url";
import logger from "./lib/logger";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateProject({ projectPath, models = [], projectRoot }) {
  // ensure absolute path
  projectPath = path.resolve(projectPath);

  const folders = [
    "app",
    "app/admin",
    "app/api/admin",
    "components",
    "lib",
    "config",
    "styles"
  ];

  for (const folder of folders) {
    await fs.ensureDir(path.join(projectPath, folder));
  }

  const templateFolder = path.join(__dirname, "template", "admin-panel");

  const staticFiles = [
    { src: "app/layout.js", dest: "app/layout.js" },
    { src: "app/page.js", dest: "app/page.js" },
    { src: "app/admin/login/page.js", dest: "app/admin/login/page.js" },
    { src: "lib/auth.js", dest: "lib/auth.js" },
    { src: "lib/dbConnect.js", dest: "lib/dbConnect.js" },
    { src: "config/admin.js", dest: "config/admin.js" },
    { src: "styles/globals.css", dest: "styles/globals.css" },
    { src: "components/TableView.js", dest: "components/TableView.js" }
  ];

  // Copy static files (avoid ENOENT)
  for (const file of staticFiles) {
    const srcPath = path.join(templateFolder, file.src);
    const destPath = path.join(projectPath, file.dest);

    try {
      const exists = await fs.pathExists(srcPath);
      if (!exists) {
        await logger.warn(`Template file missing, skipping: ${srcPath}`);
        continue;
      }
      await fs.ensureDir(path.dirname(destPath));
      await fs.copy(srcPath, destPath, { overwrite: true });
      await logger.log(`Copied: ${file.src} → ${file.dest}`);
    } catch (err) {
      await logger.warn(`Failed to copy ${srcPath}: ${err.message}`);
    }
  }

  // Model templates
  const modelPageTemplate = path.join(templateFolder, "app/admin/[model]/page.ejs");
  const apiRouteTemplate = path.join(templateFolder, "app/api/admin/[model]/route.ejs");

  // Check existence once
  const pageTplExists = await fs.pathExists(modelPageTemplate);
  const apiTplExists = await fs.pathExists(apiRouteTemplate);

  if (!pageTplExists) {
    await logger.warn(`Model page template not found: ${modelPageTemplate} (model pages will be skipped)`);
  }
  if (!apiTplExists) {
    await logger.warn(`Model API template not found: ${apiRouteTemplate} (model api routes will be skipped)`);
  }

  for (const model of models) {
    // Render model page
    if (pageTplExists) {
      try {
        const modelDir = path.join(projectPath, `app/admin/${model}`);
        await fs.ensureDir(modelDir);

        const modelData = {
          modelName: model,
          modelImportPath: path.relative(
            path.join(projectPath, `app/admin/${model}`),
            path.join(projectRoot || process.cwd(), "models", model)
          ),
        };

        const pageTemplateContent = await fs.readFile(modelPageTemplate, "utf-8");
        const renderedPage = ejs.render(pageTemplateContent, modelData);
        await fs.writeFile(path.join(modelDir, "page.js"), renderedPage, "utf-8");
      } catch (err) {
        await logger.warn(`Failed to render/write admin page for model ${model}: ${err.message}`);
      }
    }

    // Render model api route
    if (apiTplExists) {
      try {
        const apiDir = path.join(projectPath, `app/api/admin/${model}`);
        await fs.ensureDir(apiDir);

        const modelData = {
          modelName: model,
          modelImportPath: path.relative(
            path.join(projectPath, `app/api/admin/${model}`),
            path.join(projectRoot || process.cwd(), "models", model)
          ),
        };

        const apiTemplateContent = await fs.readFile(apiRouteTemplate, "utf-8");
        const renderedApi = ejs.render(apiTemplateContent, modelData);
        await fs.writeFile(path.join(apiDir, "route.js"), renderedApi, "utf-8");
      } catch (err) {
        await logger.warn(`Failed to render/write api route for model ${model}: ${err.message}`);
      }
    }
  }

  // Render package.json from templates/package.json.ejs
  try {
    const packageTemplatePath = path.join(__dirname, "templates", "package.json.ejs");
    const packageOutputPath = path.join(projectPath, "package.json");

    const tplExists = await fs.pathExists(packageTemplatePath);
    if (tplExists) {
      const tplContent = await fs.readFile(packageTemplatePath, "utf8");
      const rendered = ejs.render(tplContent, {
        projectName: path.basename(projectPath),
        models,
        projectRoot
      });
      await fs.writeFile(packageOutputPath, rendered, "utf8");
      await logger.log("package.json generated at", packageOutputPath);
    } else {
      await logger.warn("package.json.ejs template not found; skipping package.json generation.");
    }
  } catch (err) {
    await logger.warn("Error while generating package.json (ignored):", err.message);
  }

  return { projectPath };
}
