import { Page,Locator } from "@playwright/test";

export interface UserData{
    firstName:string,
    lastName:string,
    email:string,
    phoneNumber:string,
    password:string,
    birthDate:string,
    district:string,
    gender: 'Male' | 'Female'
    photoUrl:string,


} 
export class CreateUserPage{
    readonly page:Page;
    readonly firstNameInput:Locator;
    readonly lastNameInput:Locator;
    readonly emailInput:Locator;
    readonly phoneNumber:Locator;
    readonly bloodGroup:Locator;
    readonly passwordInput:Locator;
    readonly birthDateInput:Locator;
    readonly districtSelect:Locator;
    readonly genderRadio:Locator;
    readonly checkBoxSelect:Locator;
    readonly photoUrlInput:Locator;
    readonly createUserButton:Locator;
constructor(page:Page){
    this.page=page;
    this.firstNameInput=page.getByRole("textbox", { name: "John" , exact: true });
    this.lastNameInput=page.getByRole("textbox", { name: "Doe" , exact: true });
    this.emailInput=page.getByRole("textbox", { name:"john@example.com" });
    this.phoneNumber=page.getByPlaceholder("01500000000", { exact: true });
    this.bloodGroup=page.getByRole("combobox").first();
    this.passwordInput=page.getByRole("textbox", { name: "Create a password" });
    this.birthDateInput=page.getByPlaceholder('MM/dd/yyyy');
    this.districtSelect=page.getByRole("combobox").nth(1);
    this.genderRadio=page.getByRole("radio", { name: "Female", exact: true  });
    this.checkBoxSelect=page.getByRole("checkbox");
    this.photoUrlInput=page.locator("#photoInput");
    this.createUserButton=page.getByRole("button", { name: "Create User" });
}

async createUser(user:UserData){
    await this.firstNameInput.fill(user.firstName);
    await this.lastNameInput.fill(user.lastName);
    await this.emailInput.fill(user.email);
    await this.phoneNumber.fill(user.phoneNumber);

    // Pick the first blood group from the list
    await this.bloodGroup.press("ArrowDown");
    await this.bloodGroup.press("Enter");

    await this.passwordInput.fill(user.password);

    // Clear the default date, then type the new one
    await this.birthDateInput.click();
    await this.birthDateInput.selectText();
    await this.birthDateInput.press("Backspace");
    await this.birthDateInput.pressSequentially(user.birthDate,{delay:150});
    await this.birthDateInput.press("Enter");

    await this.districtSelect.selectOption(user.district);

    // Use gender from user data (Male or Female)
    await this.page.getByRole("radio", { name: user.gender, exact: true }).check();
    await this.checkBoxSelect.check();

    await this.photoUrlInput.setInputFiles(user.photoUrl);
    await this.createUserButton.click();
}
}
