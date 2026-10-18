import { Page,Locator } from "@playwright/test";

export class LoginPage{
    readonly page:Page;
    readonly emailInput:Locator;
    readonly passwordInput:Locator;
    readonly loginButton:Locator;
    readonly profileHeading:Locator;
constructor(page:Page){
    this.page=page;
    this.emailInput=page.getByRole("textbox", { name: "you@example.com" });
    this.passwordInput=page.getByPlaceholder("Enter password");
    this.loginButton=page.getByRole("button", { name: "Login" });
    this.profileHeading=page.getByRole("heading", { name: "Profile" });
}

async login(email:string, password:string){
    await this.page.goto("/");
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    // Wait for redirect to profile (first load can be slow in dev mode)
    await this.page.waitForURL("**/dashboard/profile", { timeout: 15000 });

    // Save login cookies to auth.json
    await this.page.context().storageState({ path: 'auth.json' });
}
}
