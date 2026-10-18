import { Page,Locator } from "@playwright/test";

export class UserListPage{
    readonly page:Page;
    readonly searchTypeSelect:Locator;
    readonly searchInput:Locator;
    readonly searchButton:Locator;
    readonly editUserButton:Locator;
    readonly statusSelect:Locator;
    readonly saveChangesButton:Locator;
    readonly userStatus:Locator;
    readonly successMessage:Locator;
constructor(page:Page){
    this.page=page;
    this.searchTypeSelect=page.getByRole("main").getByRole("combobox").first();
    this.searchInput=page.getByRole("main").getByRole("textbox").first();
    this.searchButton=page.getByRole("button", { name: "Search" });
    this.editUserButton=page.getByRole("button", { name: "Edit User" });
    this.statusSelect=page.getByRole("main").getByRole("combobox").nth(1);
    this.saveChangesButton=page.getByRole("button", { name: "Save Changes" });
    this.userStatus=page.getByRole("main").getByText(/^(ACTIVE|PENDING|SUSPENDED)$/).first();
    this.successMessage=page.getByText("User updated successfully");
}

async goto(){
    await this.page.goto("/admin/users");
}

async selectSearchType(type:string){
    await this.searchTypeSelect.click();
    await this.page.getByRole("option", { name: type }).click();
}

async searchByEmail(email:string){
    await this.selectSearchType("Search by Email");
    await this.searchInput.fill(email);
    await this.searchButton.click();
}

userRow(text:string):Locator{
    return this.page.getByRole("row").filter({ hasText: text });
}

async openUser(email:string){
    await this.userRow(email).getByRole("button", { name: "View" }).click();
    await this.page.waitForURL(/admin\/users\/\d+/);
}

async changeStatus(status:"Active" | "Pending" | "Suspended"){
    await this.editUserButton.click();
    await this.statusSelect.click();
    await this.page.getByRole("option", { name: status, exact: true }).click();
    await this.saveChangesButton.click();
}

async searchByPhone(phone:string){
    await this.selectSearchType("Search by Phone Number");
    await this.searchInput.fill(phone);
    await this.searchButton.click();
}
}
