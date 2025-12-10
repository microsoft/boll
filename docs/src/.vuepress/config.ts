import fs from "fs";
import path from "path";
import glob from "fast-glob";
import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import { defaultTheme } from "@vuepress/theme-default";

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
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "black" }]
  ],

  theme: defaultTheme({
    repo: "microsoft/boll",
    docsDir: "",
    editLink: false,
    contributors: false,
    sidebarDepth: 3,
    sidebar: {
      "/docs/": ["", "configuration", "runner", "disabling", "rules", "custom-rule"],
      "/api/": apiFiles
      // "/": "auto"
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
      // {
      //   text: "boll on GitHub",
      //   link: "https://github.com/microsoft/boll"
      // }
    ]
  })
});
