import { test, expect } from '@playwright/test';



test ("User login", async ({ page })=>{
    await page.goto("http://localhost:3000");
    await page.getByRole("textbox", { name: "you@example.com" }).fill('admin@test.com');
    await page.getByPlaceholder("Enter password").fill('1234');
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForURL("**/dashboard/profile", { timeout: 15000 });
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


    const reactDatePicker = page.getByPlaceholder("Select date").first();
    await reactDatePicker.click();
    await reactDatePicker.fill("08/15/2026");
    await page.keyboard.press("Enter");
    console.log(await reactDatePicker.inputValue());
    await expect(reactDatePicker).toHaveValue("08/15/2026");
})


test("Handle iFrame", async ({ page })=>{
    await page.goto("/dashboard/practice-components");


    const frame = page.frameLocator("iframe");
    await frame.getByRole("textbox", { name: "you@example.com" }).fill("admin@test.com");
    await frame.getByPlaceholder("Enter password").fill("1234");
    await frame.getByRole("button", { name: "Login" }).click();
    await expect(frame.getByRole("heading", { name: "Profile" })).toBeVisible({ timeout: 15000 });
})


test("Open new tab", async ({ page, context }) => {
    await page.goto("/dashboard/practice-components");

    const newPagePromise = context.waitForEvent('page');
    await page.getByRole("button", { name: "Open New Tab" }).click();
    const newPage = await newPagePromise;

    await newPage.waitForLoadState();
    console.log(newPage.url());
    expect(newPage.url()).toContain("example.com");
    await newPage.close();
})


