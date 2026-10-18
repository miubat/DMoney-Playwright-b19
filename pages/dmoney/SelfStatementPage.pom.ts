import { Page,Locator } from "@playwright/test";
import { formatDate } from "../../utils/dmoneyData";

export class SelfStatementPage{
    readonly page:Page;
    readonly heading:Locator;
    readonly fromDateInput:Locator;
    readonly toDateInput:Locator;
    readonly table:Locator;
constructor(page:Page){
    this.page=page;
    this.heading=page.getByRole("heading", { name: /Transaction History/ });
    this.fromDateInput=page.getByRole("textbox", { name: "From Date" });
    this.toDateInput=page.getByRole("textbox", { name: "To Date" });
    this.table=page.getByRole("main").getByRole("table");
}

async goto(){
    await this.page.goto("/agent/self-statement");
    await this.heading.waitFor();
    await this.showRecentDays();
}

async showRecentDays(){
    await this.fromDateInput.fill(formatDate(1));
    await this.toDateInput.fill(formatDate(0));
}

async getHeaders():Promise<string[]>{
    await this.table.getByRole("columnheader").first().waitFor();
    const headers=await this.table.getByRole("columnheader").allInnerTexts();
    return headers.map(h=>h.trim());
}

async getRows():Promise<string[][]>{
    const rows=this.table.locator("tbody tr");
    await rows.first().waitFor();

    const data:string[][]=[];
    for(const row of await rows.all()){
        const cells=await row.getByRole("cell").allInnerTexts();
        data.push(cells.map(c=>c.trim()));
    }
    return data;
}

rowWith(text:string):Locator{
    return this.table.getByRole("row").filter({ hasText: text });
}
}
