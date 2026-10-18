import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.pom';

// Runs once before all tests: login and save cookies to auth.json
setup("authenticate", async ({ page })=>{
    const loginPage=new LoginPage(page);
    await loginPage.login('admin@test.com', '1234');
    await expect(loginPage.profileHeading).toBeVisible({ timeout: 15000 });
})
