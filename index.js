import fs from "fs-extra";
import path from "path";
import ejs from "ejs";
import { fileURLToPath } from "url";
import {setupTailwind} from './lib/setupTailwind.js'
import logger from "./lib/logger.js";
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
    "configs",
    "styles",
    "public",
    "models"
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
    { src: "configs/admin.js", dest: "configs/admin.js" },
    { src: "styles/globals.css", dest: "styles/globals.css" },
    { src: "components/TableView.js", dest: "components/TableView.js" },
    { src: "app/public/favicon.ico", dest: "public/favicon.ico" },
    { src: "app/public/login.jpg", dest: "public/login.jpg" },

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
  // Render different config files  from different ejs templates in templates/
  const templateFiles = [
    { ejs: "next.config.js.ejs", out: "next.config.js", log: "next.config.js generated at" },
    { ejs: ".eslintrc.js.ejs", out: ".eslintrc.js", log: ".eslintrc.js generated at" },
    { ejs: "package.json.ejs", out: "package.json", log: "package.json generated at" },
    { ejs: ".gitignore.ejs", out: ".gitignore", log: ".gitignore generated at" },
  ];
  for (const file of templateFiles) {
    try {
      const templatePath = path.join(__dirname, "templates", file.ejs);
      const outputPath = path.join(projectPath, file.out);

      const tplExists = await fs.pathExists(templatePath);
      if (tplExists) {
        const tplContent = await fs.readFile(templatePath, "utf8");
        const rendered = ejs.render(tplContent, {
          projectName: path.basename(projectPath),
          models,
          projectRoot
        });
        await fs.writeFile(outputPath, rendered, "utf8");
        await logger.log(file.log, outputPath);
      } else {
        await logger.warn(`${file.ejs} template not found; skipping ${file.out}`);
      }
    } catch (err) {
      await logger.warn(`Error while generating ${file.out} (ignored):`, err.message);
    }
  }
  //Setting up tailwind 
  await setupTailwind(projectPath);
  return { projectPath };
}
