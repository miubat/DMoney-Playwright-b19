import { Page,Locator } from "@playwright/test";

export class PasswordPage{
    readonly page:Page;
    readonly emailInput:Locator;
    readonly sendLinkButton:Locator;
    readonly linkSentMessage:Locator;
    readonly newPasswordInput:Locator;
    readonly confirmPasswordInput:Locator;
    readonly resetButton:Locator;
constructor(page:Page){
    this.page=page;
    this.emailInput=page.getByRole("textbox", { name: "Email or Phone Number" });
    this.sendLinkButton=page.getByRole("button", { name: "Send Reset Link →" });
    this.linkSentMessage=page.getByText("A password reset link has been sent");
    this.newPasswordInput=page.getByRole("textbox", { name: "New Password", exact: true });
    this.confirmPasswordInput=page.getByRole("textbox", { name: "Confirm New Password" });
    this.resetButton=page.getByRole("button", { name: "Reset Password →" });
}

async requestResetLink(email:string){
    await this.page.goto("/forgot-password");
    await this.emailInput.fill(email);
    await this.sendLinkButton.click();
}

async setNewPassword(token:string, password:string){
    await this.page.goto(`/reset-password?token=${token}`);
    await this.newPasswordInput.fill(password);
    await this.confirmPasswordInput.fill(password);
    await this.resetButton.click();
}
}
