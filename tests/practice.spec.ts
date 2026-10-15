import { test, expect } from '@playwright/test';



test ("User login", async ({ page })=>{
    await page.goto("http://localhost:3000");

    await page.getByRole("textbox", { name: "you@example.com" }).fill('admin@test.com');
    // Password input has no "textbox" role, so find it by placeholder
    await page.getByPlaceholder("Enter password").fill('1234');
    await page.getByRole("button", { name: "Login" }).click();

    // Wait for redirect to profile (first load can be slow in dev mode)
    await page.waitForURL("**/dashboard/profile", { timeout: 15000 });

    // Save login cookies to auth.json
    await page.context().storageState({ path: 'auth.json' });

    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible({ timeout: 15000 });
})


test ("Double Button click", async ({ page })=>{

    await page.goto("/dashboard/practice-components");
    let alertMessage="";

    // Save alert text, then close the alert
    page.on('dialog', async dialog => {
        alertMessage=dialog.message();
        await dialog.accept();
    })
    await page.getByRole("button", { name: "Double Click Me" }).dblclick();
    console.log(alertMessage);
    expect(alertMessage).toBe("double clicked!");
})




test("Context Button click", async ({ page })=>{

    await page.goto("/dashboard/practice-components");
    let alertMessage="";

    // Save alert text, then close the alert
    page.on('dialog', async dialog => {
        alertMessage=dialog.message();
        await dialog.accept();
    })
    await page.getByRole("button", { name: "Right Click Me" }).click({button:'right'});
    console.log(alertMessage);
    expect(alertMessage).toBe("context clicked!");
})


test("React DatePicker", async ({ page })=>{
    await page.goto("/dashboard/practice-components");

    // Page has two datepickers with the same placeholder, so pick the first one
    const reactDatePicker = page.getByPlaceholder("Select date").first();
    await reactDatePicker.click();
    await reactDatePicker.fill("08/15/2026");
    await page.keyboard.press("Enter");
    console.log(await reactDatePicker.inputValue());
    await expect(reactDatePicker).toHaveValue("08/15/2026");
})


test("Handle iFrame", async ({ page })=>{
    await page.goto("/dashboard/practice-components");

    // The iframe shows the login page, so fill the login form inside it
    const frame = page.frameLocator("iframe");
    await frame.getByRole("textbox", { name: "you@example.com" }).fill("admin@test.com");
    await frame.getByPlaceholder("Enter password").fill("1234");
    await frame.getByRole("button", { name: "Login" }).click();
    await expect(frame.getByRole("heading", { name: "Profile" })).toBeVisible({ timeout: 15000 });
})


