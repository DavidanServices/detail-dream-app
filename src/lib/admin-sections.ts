// Plain-language map of where each package shows on the public website, for the admin screens.
export const packagePage = (id: string) =>
  id === "interior"
    ? { label: "Interior page", href: "/interior-detailing" }
    : id === "exterior"
      ? { label: "Exterior page", href: "/exterior-detailing" }
      : { label: "Exterior page (Protection & bundles)", href: "/exterior-detailing#protection" };

export const appearsOn = (id: string, featured: boolean) => [
  packagePage(id).label,
  featured ? "Home page (large card)" : "Home page (wide row)",
  "Booking form",
];
