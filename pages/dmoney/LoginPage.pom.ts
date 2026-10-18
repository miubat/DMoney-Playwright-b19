import { Page,Locator } from "@playwright/test";

export class LoginPage{
    readonly page:Page;
    readonly emailInput:Locator;
    readonly passwordInput:Locator;
    readonly loginButton:Locator;
    readonly otpInput:Locator;
    readonly verifyOtpButton:Locator;
    readonly errorAlert:Locator;
constructor(page:Page){
    this.page=page;
    this.emailInput=page.getByRole("textbox", { name: "Email or Phone Number" });
    this.passwordInput=page.getByRole("textbox", { name: "Password" });
    this.loginButton=page.getByRole("button", { name: "Login →" });
    this.otpInput=page.getByRole("textbox", { name: "Enter 4-Digit OTP" });
    this.verifyOtpButton=page.getByRole("button", { name: "Verify OTP →" });
    this.errorAlert=page.locator(".MuiAlert-message");
}

async goto(){
    await this.page.goto("/login");
}

async login(email:string, password:string){
    await this.goto();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
}

async verifyOtp(otp:string){
    await this.otpInput.fill(otp);
    await this.verifyOtpButton.click();
}
}
