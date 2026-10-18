import { Page,Locator } from "@playwright/test";

export class CashInPage{
    readonly page:Page;
    readonly phoneInput:Locator;
    readonly amountInput:Locator;
    readonly cashInButton:Locator;
    readonly successMessage:Locator;
    readonly transactionId:Locator;
constructor(page:Page){
    this.page=page;
    this.phoneInput=page.getByRole("textbox", { name: "Customer Phone Number" });
    this.amountInput=page.getByRole("spinbutton", { name: "Amount (BDT)" });
    this.cashInButton=page.getByRole("button", { name: "Cash In →" });
    this.successMessage=page.getByRole("main").getByText(/successful/i);
    this.transactionId=page.getByRole("main").getByText(/^TXN[A-Z0-9]+$/);
}

async goto(){
    await this.page.goto("/agent/cash-in");
}

async deposit(phone:string, amount:number){
    await this.phoneInput.fill(phone);
    await this.amountInput.fill(String(amount));
    await this.cashInButton.click();
}
}
