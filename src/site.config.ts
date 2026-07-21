import type { SiteConfig } from "@/types";
import type { AstroExpressiveCodeOptions } from "astro-expressive-code";

export const siteConfig: SiteConfig = {
  author: "Erhan BÜTE",
  date: {
    locale: "tr-TR",
    options: {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  },
  description:
    "Erhan BÜTE’nin Python, backend sistemleri ve üretimde çalışan yazılım üzerine notları.",
  lang: "tr-TR",
  ogLocale: "tr_TR",
  sortPostsByUpdatedDate: false,
  title: "Erhan BÜTE",
  profile: {
    name: "Erhan BÜTE",
    email: "erhan@hey.com",
    github: "https://github.com/erhan",
    linkedin: "https://www.linkedin.com/in/erhanbute/",
    twitter: "https://x.com/erhanbute",
    instagram: "https://www.instagram.com/erhanbt/",
    jobTitle: "Backend Yazılım Geliştirici",
  },
  comments: {
    shortname: "erhanbute",
  },
  // Uncomment to enable analytics. Both providers load via Partytown.
  // analytics: {
  // 	googleAnalyticsId: "G-XXXXXXX",
  // 	goatcounterUrl: "https://your-handle.goatcounter.com/count",
  // },
};

export const menuLinks: { path: string; title: string }[] = [
  {
    path: "/",
    title: "Ana sayfa",
  },
  {
    path: "/posts/",
    title: "Yazılar",
  },
  {
    path: "/about/",
    title: "Hakkımda",
  },
];

export const expressiveCodeOptions: AstroExpressiveCodeOptions = {
  styleOverrides: {
    borderRadius: "4px",
    codeBackground: ({ theme }) =>
      theme.type === "light" ? "#f0e9d6" : "#161d26",
    codeFontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;',
    codeFontSize: "0.875rem",
    codeLineHeight: "1.7142857rem",
    codePaddingInline: "1rem",
    frames: {
      editorActiveTabBackground: ({ theme }) =>
        theme.type === "light" ? "#f0e9d6" : "#161d26",
      editorTabBarBackground: ({ theme }) =>
        theme.type === "light" ? "#ebe3cd" : "#101720",
      frameBoxShadowCssValue: "none",
      terminalBackground: ({ theme }) =>
        theme.type === "light" ? "#f0e9d6" : "#161d26",
      terminalTitlebarBackground: ({ theme }) =>
        theme.type === "light" ? "#ebe3cd" : "#101720",
    },
    uiLineHeight: "inherit",
  },
  themeCssSelector(theme, { styleVariants }) {
    if (styleVariants.length >= 2) {
      const baseTheme = styleVariants[0]?.theme;
      const altTheme = styleVariants.find(
        (v) => v.theme.type !== baseTheme?.type,
      )?.theme;
      if (theme === baseTheme || theme === altTheme)
        return `[data-theme='${theme.type}']`;
    }
    return `[data-theme="${theme.name}"]`;
  },
  themes: ["min-dark", "min-light"],
  useThemedScrollbars: false,
};
