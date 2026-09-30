import { expect, test } from "@playwright/test";

const PUBLIC_ROUTES = ["/", "/buy", "/sell", "/referral", "/reactivate", "/admin/login", "/admin/forgot-password"];

for (const route of PUBLIC_ROUTES) {
  test(`${route} renders without errors`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });

    const res = await page.goto(route);
    expect(res?.status()).toBe(200);
    await expect(page.locator("body")).not.toBeEmpty();
    expect(errors).toEqual([]);
  });
}

test("/admin is gated for anonymous users", async ({ page }) => {
  // No Supabase env -> proxy fails closed with 503; configured -> redirect to login.
  const res = await page.goto("/admin");
  const gated = res?.status() === 503 || new URL(page.url()).pathname === "/admin/login";
  expect(gated).toBe(true);
});
