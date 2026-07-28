/**
 * Field Guide navigation is intentionally explicit: move slugs within a section,
 * or add a section here, to change the sidebar and previous/next order.
 * Published articles that are not listed are appended to an automatic "More" section.
 */
export const fieldGuideNavigation = [
  {
    label: "",
    slugs: ["index", "resources", "organizing-content", "runtime-configuration"],
  },
  // {
  //   label: "Application Patterns",
  //   slugs: [],
  // },
] as const;
