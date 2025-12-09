const { description } = require("../../package");
const glob = require("fast-glob").sync;
const path = require("path");

const apiRoot = path.join(__dirname, "..", "api");
const apiFiles = glob(path.join(apiRoot, "**", "*.md"))
  .map(x => x.replace(apiRoot + "/", "").replace(".md", ""))
  .map(x => (x === "index" ? "" : x))
  .filter(x => !x.includes("README"))
  .sort();

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: "boll",
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,
  base: "/boll/",
  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ["meta", { name: "theme-color", content: "#3eaf7c" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    ["meta", { name: "apple-mobile-web-app-status-bar-style", content: "black" }]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: "",
    editLinks: false,
    docsDir: "",
    editLinkText: "",
    lastUpdated: false,
    displayAllHeaders: true,
    sidebar: {
      "/docs/": ["", "configuration", "runner", "disabling", "rules", "custom-rule"],
      "/api/": apiFiles,
      "/": "auto"
    },
    nav: [
      {
        text: "Get started",
        link: "/getstarted/"
      },
      {
        text: "Documentation",
        link: "/docs/"
      },
      {
        text: "boll on GitHub",
        link: "https://github.com/microsoft/boll"
      }
    ]
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: ["@vuepress/plugin-back-to-top", "@vuepress/plugin-medium-zoom"]
};
