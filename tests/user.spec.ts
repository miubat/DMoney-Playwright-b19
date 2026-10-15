import {test, expect} from '@playwright/test';
import { faker } from '@faker-js/faker';
import { generateRandomNumber } from '../utils/randomNumber';

test("Add new user ",async({page})=>{
    await page.goto("/dashboard/add-user")
await page.getByRole("textbox", { name: "John" , exact: true }).fill("Test");
await page.getByRole("textbox", { name: "Doe" , exact: true }).fill("User");
let email=faker.internet.email();
let randomId = generateRandomNumber(1000000,9999999);
 


await page.getByRole("textbox", { name:"john@example.com" }).fill(email);
await page.getByPlaceholder("01500000000", { exact: true }).fill(`0133${randomId}`);
const cbBloodGroup= await page.getByRole("combobox").first();
await cbBloodGroup.press("ArrowDown");
await cbBloodGroup.press("Enter")

await page.getByRole("textbox", { name: "Create a password" }).fill('1234');
const textBirthDate=await page.getByPlaceholder('MM/dd/yyyy');
await textBirthDate.click();
await textBirthDate.selectText();
await textBirthDate.press("Backspace");
await textBirthDate.pressSequentially("11/10/2000",{delay:150}); 
await textBirthDate.press("Enter");

await page.getByRole("combobox").nth(1).selectOption("Dhaka");
await page.getByRole("radio", { name: "Female", exact: true  }).check();
await page.getByRole("checkbox").check();

await page.locator("#photoInput").setInputFiles("resources/download.jpg");

await page.getByRole("button", { name: "Create User" }).click();


await expect(page.getByText("User created successfully!")).toBeVisible();
await page.waitForURL("**/dashboard/users");

await page.getByRole("textbox", { name: "Search" }).fill(email);
await expect(page.getByRole("cell", { name: email })).toBeVisible();

await page.pause();

})
