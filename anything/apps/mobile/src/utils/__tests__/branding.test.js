import { getBranding, getBrandColor } from "@/utils/branding";

describe("branding", () => {
  it("returns the standard brand by default", () => {
    const theme = getBranding();

    expect(theme.mode).toBe("standard");
    expect(theme.appName).toBe("Rising Above Trauma");
    expect(theme.displayNameLines).toEqual(["Rising Above", "Trauma"]);
  });

  it("returns the discreet brand when requested", () => {
    const theme = getBranding(true);

    expect(theme.mode).toBe("discreet");
    expect(theme.appName).toBe("My Journal");
    expect(theme.displayNameLines).toEqual(["My", "Journal"]);
  });

  it("maps known brand colors into the discreet palette", () => {
    expect(getBrandColor("#4A2D8F", true)).toBe("#374151");
    expect(getBrandColor("#5B2CA0", true)).toBe("#4B5563");
    expect(getBrandColor("#F3F0F8", true)).toBe("#F4F4F5");
  });

  it("leaves colors untouched outside discreet mode", () => {
    expect(getBrandColor("#4A2D8F", false)).toBe("#4A2D8F");
    expect(getBrandColor("#123456", true)).toBe("#123456");
  });
});
