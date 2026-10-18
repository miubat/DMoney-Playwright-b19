import { Page,Locator } from "@playwright/test";

export class DashboardPage{
    readonly page:Page;
    readonly dashboardTitle:Locator;
    readonly avatarButton:Locator;
    readonly logoutMenu:Locator;
    readonly balanceInput:Locator;
    readonly accountStatus:Locator;
constructor(page:Page){
    this.page=page;
    this.dashboardTitle=page.getByRole("banner").getByText(/Dashboard$/);
    this.avatarButton=page.getByRole("banner").getByText(/^[A-Z]$/);
    this.logoutMenu=page.getByRole("menuitem", { name: /Logout/ });
    this.balanceInput=page.getByRole("textbox", { name: "Current Balance (BDT)" });
    this.accountStatus=page.locator("main").getByText(/^(ACTIVE|PENDING|SUSPENDED)$/);
}

async openMenu(name:string){
    await this.page.getByRole("navigation").getByRole("link", { name }).click();
}

async logout(){
    await this.avatarButton.click();
    await this.logoutMenu.click();
    await this.page.waitForURL("**/login");
}

async getBalance():Promise<number>{
    await this.page.goto("/profile");
    await this.balanceInput.waitFor();
    return Number(await this.balanceInput.inputValue());
}
}
