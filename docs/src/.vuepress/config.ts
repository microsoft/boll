import fs from "fs";
import path from "path";
import glob from "fast-glob";
import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";
import { searchPlugin } from "@vuepress/plugin-search";

const { description } = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, "../../package.json"), "utf8"));

const apiRoot = path.resolve(import.meta.dirname, "..", "api");
const apiFiles = glob
  .sync("**/*.md", { cwd: apiRoot })
  .map(x => x.replace(".md", ""))
  .map(x => (x === "index" ? "" : x))
  .filter(x => !x.includes("README"))
  .sort();

export default defineUserConfig({
  bundler: viteBundler(),

  title: "boll",
  description,
  base: "/boll/",
  // Extra tags to be injected to the page HTML `<head>`
  head: [
    ["meta", { name: "theme-color", content: "#e63946" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "black" }]
  ],

  plugins: [searchPlugin()],

  theme: defaultTheme({
    repo: "microsoft/boll",
    editLink: false,
    contributors: false,
    sidebarDepth: 3,
    sidebar: {
      "/docs/": ["", "configuration", "runner", "disabling", "rules", "custom-rule"],
      "/api/": apiFiles
    },
    navbar: [
      {
        text: "Get started",
        link: "/getstarted/"
      },
      {
        text: "Documentation",
        link: "/docs/"
      }
    ]
  })
});
