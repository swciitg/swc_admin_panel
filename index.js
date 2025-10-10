import fs from "fs-extra";
import path from "path";
import ejs from "ejs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function generateProject({ projectPath, models, projectRoot }) {
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

  const templateFolder = path.join(__dirname, "templates");

  const staticFiles = [
    { src: "app/layout.js", dest: "app/layout.js" },
    { src: "app/page.js", dest: "app/page.js" },
    { src: "app/admin/login/page.js", dest: "app/admin/login/page.js" },
    { src: "lib/auth.js", dest: "lib/auth.js" },
    { src: "config/admin.js", dest: "config/admin.js" },
    { src: "styles/globals.css", dest: "styles/globals.css" },
    { src: "components/TableView.js", dest: "components/TableView.js" }
  ];

  for (const file of staticFiles) {
    const srcPath = path.join(templateFolder, file.src);
    const destPath = path.join(projectPath, file.dest);
    await fs.copy(srcPath, destPath);
  }

  const modelPageTemplate = path.join(templateFolder, "app/admin/[model]/page.ejs");
  const apiRouteTemplate = path.join(templateFolder, "app/api/admin/[model]/route.ejs");

  for (const model of models) {
    const modelDir = path.join(projectPath, `app/admin/${model}`);
    await fs.ensureDir(modelDir);

    const modelData = {
      modelName: model,
      modelImportPath: path.relative(
        path.join(projectPath, `app/admin/${model}`),
        path.join(projectRoot, "models", model)
      ),
    };

    const pageTemplateContent = await fs.readFile(modelPageTemplate, "utf-8");
    const renderedPage = ejs.render(pageTemplateContent, modelData);
    await fs.writeFile(path.join(modelDir, "page.js"), renderedPage, "utf-8");

    const apiDir = path.join(projectPath, `app/api/admin/${model}`);
    await fs.ensureDir(apiDir);

    const apiTemplateContent = await fs.readFile(apiRouteTemplate, "utf-8");
    const renderedApi = ejs.render(apiTemplateContent, modelData);
    await fs.writeFile(path.join(apiDir, "route.js"), renderedApi, "utf-8");
  }

  const dbConnectTemplate = path.join(templateFolder, "lib/dbConnect.ejs");
  const dbConnectOutput = path.join(projectPath, "lib/dbConnect.js");

  if (await fs.pathExists(dbConnectTemplate)) {
    const dbContent = await fs.readFile(dbConnectTemplate, "utf-8");
    await fs.writeFile(dbConnectOutput, dbContent, "utf-8");
    console.log("dbConnect.js generated successfully");
  } else {
    console.warn("dbConnect.ejs template not found, skipping dbConnect.js");
  }

}
