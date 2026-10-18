import {test, expect} from '@playwright/test';

test ("Go to dashboard", async ({page})=>{
   await page.goto("dashboard/practice-components")
}) 