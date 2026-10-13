import { test, expect } from '@playwright/test';



test ("User login", async ({ page })=>{
    await page.goto("http://localhost:3000");

    await page.getByRole("textbox", { name: "you@example.com" }).fill('admin@test.com');
    await page.getByRole("textbox", { name: "Enter Password" }).fill('1234');
    await page.getByRole("button", { name: "Login" }).click();
    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible();

    // Save login cookies to auth.json
    await page.context().storageState({ path: 'auth.json' });
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


