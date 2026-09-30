import { afterEach, describe, expect, it, vi } from "vitest";
import { safeNextPath } from "./safe-redirect";
import { isValidMobile } from "./validation";
import { isTestModeEnabled } from "./testMode";

describe("safeNextPath", () => {
  it("keeps same-origin paths", () => expect(safeNextPath("/admin/listings")).toBe("/admin/listings"));
  it.each([null, "", "https://evil.com", "//evil.com", "/\\evil.com"])("rejects %s", (next) =>
    expect(safeNextPath(next)).toBe("/admin"),
  );
});

describe("isValidMobile", () => {
  it.each(["9876543210", "+91 98765 43210", "09876543210"])("accepts %s", (v) => expect(isValidMobile(v)).toBe(true));
  it.each(["5876543210", "98765", ""])("rejects %s", (v) => expect(isValidMobile(v)).toBe(false));
});

describe("isTestModeEnabled", () => {
  afterEach(() => vi.unstubAllEnvs());
  it("is on only when flagged outside production", () => {
    vi.stubEnv("NEXT_PUBLIC_TEST_MODE", "true");
    vi.stubEnv("NODE_ENV", "development");
    expect(isTestModeEnabled()).toBe(true);
    vi.stubEnv("NODE_ENV", "production");
    expect(isTestModeEnabled()).toBe(false);
  });
});
