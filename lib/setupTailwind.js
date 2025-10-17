import fs from "fs"
import path from "path"
import { execSync } from "child_process"

function run(cmd, cwd) {
  execSync(cmd, { cwd, stdio: "inherit", shell: true })
}

function ensureDirectivesInCss(filePath) {
  const directives = "@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n"
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, directives)
    return
  }
  const current = fs.readFileSync(filePath, "utf8")
  const hasBase = current.includes("@tailwind base;")
  const hasComponents = current.includes("@tailwind components;")
  const hasUtilities = current.includes("@tailwind utilities;")
  if (hasBase && hasComponents && hasUtilities) return
  fs.writeFileSync(filePath, directives + current)
}

export async function setupTailwind(projectPath) {
  const tailwindConfig = path.join(projectPath, "tailwind.config.js")
  const postcssConfig = path.join(projectPath, "postcss.config.js")
  // IMPORTANT: write into styles/globals.css (not app/global.css)
  const cssFile = path.join(projectPath, "styles", "globals.css")

  try {
    console.log("Installing Tailwind CSS dependencies...")
    // v4-friendly; @tailwindcss/postcss is recommended
    run("npm install -D tailwindcss @tailwindcss/postcss postcss autoprefixer", projectPath)

    // Tailwind config (works for v3/v4; v4 ignores content safely)
    const twconfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: { extend: {} },
  plugins: [],
};
`
    fs.writeFileSync(tailwindConfig, twconfig)

    // PostCSS config (v4 prefers @tailwindcss/postcss)
    const postcssContent = `module.exports = {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};
`
    fs.writeFileSync(postcssConfig, postcssContent)

    // Ensure styles/globals.css exists and contains Tailwind directives
    const cssDir = path.dirname(cssFile)
    if (!fs.existsSync(cssDir)) fs.mkdirSync(cssDir, { recursive: true })
    ensureDirectivesInCss(cssFile)

    console.log("Tailwind CSS setup completed successfully!")
  } catch (e) {
    console.log("Tailwind setup failed:")
    console.error(e.message)
  }
}