import { Page,Locator } from "@playwright/test";
import { AgentData } from "../../utils/dmoneyData";

export class RegisterPage{
    readonly page:Page;
    readonly nameInput:Locator;
    readonly emailInput:Locator;
    readonly passwordInput:Locator;
    readonly phoneInput:Locator;
    readonly nidInput:Locator;
    readonly roleSelect:Locator;
    readonly createAccountButton:Locator;
constructor(page:Page){
    this.page=page;
    this.nameInput=page.getByRole("textbox", { name: "Full Name" });
    this.emailInput=page.getByRole("textbox", { name: "Email Address" });
    this.passwordInput=page.getByRole("textbox", { name: "Password" });
    this.phoneInput=page.getByRole("textbox", { name: "Phone Number" });
    this.nidInput=page.getByRole("textbox", { name: "National ID (NID)" });
    this.roleSelect=page.getByRole("combobox");
    this.createAccountButton=page.getByRole("button", { name: "Create Account →" });
}

async registerAgent(agent:AgentData){
    await this.nameInput.fill(agent.name);
    await this.emailInput.fill(agent.email);
    await this.passwordInput.fill(agent.password);
    await this.phoneInput.fill(agent.phone);
    await this.nidInput.fill(agent.nid);

    await this.roleSelect.click();
    await this.page.getByRole("option", { name: /Agent/ }).click();

    await this.createAccountButton.click();
}
}
