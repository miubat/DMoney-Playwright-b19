import{test,expect}from'@playwright/test';
import {BrowserContext, Page} from '@playwright/test';

let browserContext: BrowserContext;
let page: Page;

test.describe("Practice Automation",()=>{
    // Tests share one page, so run them in order (stop if one fails)
    test.describe.configure({ mode: 'serial' });

    test.beforeAll(async({browser})=>{
        browserContext=await browser.newContext({storageState:'auth.json'  });
        page=await browserContext.newPage();
        
    })
    test.afterAll(async()=>{
        await browserContext.close();
    })
    test ("visit practice site", async ()=>{
        await page.goto("/dashboard/practice-components")
    })

test ("User login", async ()=>{
    await page.goto("http://localhost:3000");
    await page.getByRole("textbox", { name: "you@example.com" }).fill('admin@test.com');
    await page.getByPlaceholder("Enter password").fill('1234');
    await page.getByRole("button", { name: "Login" }).click();
    await page.waitForURL("**/dashboard/profile", { timeout: 15000 });
    await page.context().storageState({ path: 'auth.json' });
    await expect(page.getByRole("heading", { name: "Profile" })).toBeVisible({ timeout: 15000 });
})


test ("Double Button click", async ()=>{

    // Previous test ends on Profile page, so open the practice page first
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



test("Open new tab", async () => {
    await page.goto("/dashboard/practice-components");

    // Use our own browserContext, because the new tab opens there
    const newPagePromise = browserContext.waitForEvent('page');
    await page.getByRole("button", { name: "Open New Tab" }).click();
    const newPage = await newPagePromise;

    await newPage.waitForLoadState();
    console.log(newPage.url());
    expect(newPage.url()).toContain("example.com");
    await newPage.close();
    //await page.pause();
})



    
})

