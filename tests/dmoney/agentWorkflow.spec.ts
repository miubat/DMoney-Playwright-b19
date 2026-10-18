import { test, expect, Page, BrowserContext } from '@playwright/test';
import { SUITES } from '../../utils/suites';
import { ADMIN, SYSTEM, CUSTOMER_PHONE, AgentData, createAgentData, todayDate } from '../../utils/dmoneyData';
import { getOtp, getResetToken } from '../../utils/dmoneyApi';
import { saveAsCsv, readCsv } from '../../utils/csvHelper';
import { LoginPage } from '../../pages/dmoney/LoginPage.pom';
import { RegisterPage } from '../../pages/dmoney/RegisterPage.pom';
import { DashboardPage } from '../../pages/dmoney/DashboardPage.pom';
import { UserListPage } from '../../pages/dmoney/UserListPage.pom';
import { CashInPage } from '../../pages/dmoney/CashInPage.pom';
import { PasswordPage } from '../../pages/dmoney/PasswordPage.pom';
import { SelfStatementPage } from '../../pages/dmoney/SelfStatementPage.pom';

const SMOKE = [SUITES.SMOKE, SUITES.REGRESSION];
const REGRESSION = [SUITES.REGRESSION];

const SYSTEM_DEPOSIT = 2000;
const CUSTOMER_DEPOSIT = 500;
const AGENT_COMMISSION = CUSTOMER_DEPOSIT * 0.025;
const CSV_FILE = `output/self_statement_${todayDate()}.csv`;

test.describe.configure({ mode: "serial" });

test.describe("DMoney Agent Workflow", ()=>{
    let context:BrowserContext;
    let page:Page;
    let agent:AgentData;
    const customerPhone=CUSTOMER_PHONE;
    let systemTrnxId:string;
    let customerTrnxId:string;

    let loginPage:LoginPage;
    let dashboard:DashboardPage;
    let userList:UserListPage;
    let cashIn:CashInPage;
    let passwordPage:PasswordPage;
    let statement:SelfStatementPage;

    test.beforeAll(async ({ browser }, testInfo)=>{
        context=await browser.newContext({
            baseURL: testInfo.project.use.baseURL,
            viewport: { width: 1366, height: 768 },
            recordVideo: { dir: "videos/raw", size: { width: 1366, height: 768 } },
        });
        page=await context.newPage();

        loginPage=new LoginPage(page);
        dashboard=new DashboardPage(page);
        userList=new UserListPage(page);
        cashIn=new CashInPage(page);
        passwordPage=new PasswordPage(page);
        statement=new SelfStatementPage(page);

        agent=createAgentData();
        console.log("New agent:", agent.email, agent.phone);
    })

    test.afterAll(async ()=>{
        const video=page.video();
        await context.close();
        if(video){
            await video.saveAs(`videos/dmoney_run_${todayDate()}.webm`);
            await video.delete();
        }
    })

    test("Agent registration is successful", { tag: SMOKE }, async ()=>{
        const registerPage=new RegisterPage(page);

        await page.goto("/");
        await page.getByRole("banner").getByRole("link", { name: "Sign Up" }).click();
        await expect(page).toHaveURL(/register/);

        await registerPage.registerAgent(agent);
        await expect(page.getByText("Registration successful. Your account is pending approval by an admin.")).toBeVisible();
    })

    test("Admin login is successful", { tag: SMOKE }, async ()=>{
        await loginPage.login(ADMIN.email, ADMIN.password);

        await expect(page).toHaveURL(/profile/);
        await expect(dashboard.dashboardTitle).toHaveText("Admin Dashboard");
    })

    test("New Agent appears in the Admin user list", { tag: SMOKE }, async ()=>{
        await userList.goto();
        await userList.searchByEmail(agent.email);

        const row=userList.userRow(agent.email);
        await expect(row).toBeVisible();
        await expect(row).toContainText(agent.name);
        await expect(row).toContainText(agent.phone);
        await expect(row).toContainText("Agent");
    })

    test("New Agent is inactive at first", { tag: REGRESSION }, async ()=>{
        await userList.goto();
        await userList.searchByEmail(agent.email);

        await expect(userList.userRow(agent.email)).toContainText("PENDING");
    })

    test("Admin can activate the Agent", { tag: SMOKE }, async ()=>{
        await userList.goto();
        await userList.searchByEmail(agent.email);
        await userList.openUser(agent.email);

        await userList.changeStatus("Active");

        await expect(userList.successMessage).toBeVisible();
        await expect(userList.userStatus).toHaveText("ACTIVE");
    })

    test("Agent stays active after page reload", { tag: SMOKE }, async ()=>{
        await page.reload();
        await expect(userList.userStatus).toHaveText("ACTIVE");

        await test.step("Make sure the customer for cash in is active", async ()=>{
            await userList.goto();
            await userList.searchByPhone(customerPhone);

            const row=userList.userRow(customerPhone);
            await expect(row).toContainText("Customer");
            await expect(row).toContainText("ACTIVE");
        })

        await dashboard.logout();
    })

    test("System login is successful", { tag: SMOKE }, async ()=>{
        await loginPage.login(SYSTEM.email, SYSTEM.password);

        await expect(page).toHaveURL(/profile/);
        await expect(page.getByRole("banner")).toContainText("SYSTEM");
    })

    test("System can deposit 2000 Tk to the Agent", { tag: SMOKE }, async ()=>{
        await dashboard.openMenu("Cash In");
        await cashIn.deposit(agent.phone, SYSTEM_DEPOSIT);

        await expect(cashIn.successMessage).toHaveText("SYSTEM deposit to Agent successful");
        systemTrnxId=(await cashIn.transactionId.innerText()).trim();
        console.log("System deposit trnxId:", systemTrnxId);
    })

    test("System deposit creates the correct transaction record", { tag: SMOKE }, async ()=>{
        await dashboard.openMenu("Self Statement");
        await statement.showRecentDays();

        const row=statement.rowWith(systemTrnxId);
        await expect(row).toBeVisible();
        await expect(row.getByRole("cell").nth(1)).toHaveText("SYSTEM");
        await expect(row.getByRole("cell").nth(2)).toHaveText(agent.phone);
        await expect(row.getByRole("cell").nth(3)).toHaveText("System Deposit to Agent");
        await expect(row.getByRole("cell").nth(4)).toHaveText(`${SYSTEM_DEPOSIT}.00`);

        await dashboard.logout();
    })

    test("Agent can log in after activation", { tag: SMOKE }, async ()=>{
        await loginPage.login(agent.email, agent.password);
        await expect(loginPage.otpInput).toBeVisible();

        await loginPage.verifyOtp(await getOtp(agent.email));

        await expect(page).toHaveURL(/profile/);
        await expect(dashboard.dashboardTitle).toHaveText("Agent Dashboard");
    })

    test("Agent balance is exactly 2000 Tk", { tag: SMOKE }, async ()=>{
        expect(await dashboard.getBalance()).toBe(SYSTEM_DEPOSIT);
    })

    test("Agent can deposit 500 Tk to an existing Customer", { tag: SMOKE }, async ()=>{
        await dashboard.openMenu("Cash In");
        await cashIn.deposit(customerPhone, CUSTOMER_DEPOSIT);

        await expect(cashIn.successMessage).toBeVisible();
        customerTrnxId=(await cashIn.transactionId.innerText()).trim();
        console.log("Customer deposit trnxId:", customerTrnxId);
    })

    test("Agent balance is updated after the transaction", { tag: SMOKE }, async ()=>{
        const expectedBalance=SYSTEM_DEPOSIT - CUSTOMER_DEPOSIT + AGENT_COMMISSION;
        expect(await dashboard.getBalance()).toBe(expectedBalance);
    })

    test("Customer deposit appears in the Agent Self Statement", { tag: SMOKE }, async ()=>{
        await statement.goto();

        const row=statement.rowWith(customerTrnxId);
        await expect(row).toBeVisible();
        await expect(row.getByRole("cell").nth(1)).toHaveText(agent.phone);
        await expect(row.getByRole("cell").nth(2)).toHaveText(customerPhone);
        await expect(row.getByRole("cell").nth(4)).toHaveText(`${CUSTOMER_DEPOSIT}.00`);
    })

    test("Agent logout works", { tag: SMOKE }, async ()=>{
        await dashboard.logout();

        await expect(page).toHaveURL(/login/);
        await expect(loginPage.loginButton).toBeVisible();
    })

    test("Agent password reset works", { tag: SMOKE }, async ()=>{
        await passwordPage.requestResetLink(agent.email);
        await expect(passwordPage.linkSentMessage).toBeVisible();

        await passwordPage.setNewPassword(await getResetToken(agent.email), agent.newPassword);
        await expect(page.getByText(/password.*reset.*success/i)).toBeVisible();
    })

    test("Login with the old password fails", { tag: REGRESSION }, async ()=>{
        await loginPage.login(agent.email, agent.password);

        await expect(loginPage.errorAlert).toHaveText("Login failed. Please input correct email/phone number or password.");
        await expect(loginPage.otpInput).toBeHidden();
        await expect(page).toHaveURL(/login/);
    })

    test("Login with the new password succeeds", { tag: SMOKE }, async ()=>{
        await loginPage.login(agent.email, agent.newPassword);
        await loginPage.verifyOtp(await getOtp(agent.email));

        await expect(page).toHaveURL(/profile/);
        await expect(dashboard.dashboardTitle).toHaveText("Agent Dashboard");
    })

    test("Self Statement has the expected transactions", { tag: SMOKE }, async ()=>{
        await dashboard.openMenu("Self Statement");
        await expect(statement.heading).toBeVisible();
        await statement.showRecentDays();

        const rows=await statement.getRows();
        expect(rows).toHaveLength(2);

        const systemDeposit=statement.rowWith(systemTrnxId).getByRole("cell");
        await expect(systemDeposit.nth(1)).toHaveText("SYSTEM");
        await expect(systemDeposit.nth(2)).toHaveText(agent.phone);
        await expect(systemDeposit.nth(3)).toHaveText("Top-up from SYSTEM");
        await expect(systemDeposit.nth(5)).toHaveText("2000.00");
        await expect(systemDeposit.nth(6)).toHaveText("2000.00");

        const customerDeposit=statement.rowWith(customerTrnxId).getByRole("cell");
        await expect(customerDeposit.nth(1)).toHaveText(agent.phone);
        await expect(customerDeposit.nth(2)).toHaveText(customerPhone);
        await expect(customerDeposit.nth(3)).toHaveText("Deposit Commission");
        await expect(customerDeposit.nth(4)).toHaveText("500.00");
        await expect(customerDeposit.nth(5)).toHaveText("12.50");
        await expect(customerDeposit.nth(6)).toHaveText("1512.50");
    })

    test("Self Statement is saved into a CSV file", { tag: SMOKE }, async ()=>{
        await statement.goto();
        const headers=await statement.getHeaders();
        const rows=await statement.getRows();

        saveAsCsv(CSV_FILE, headers, rows);

        const csv=readCsv(CSV_FILE);
        expect(csv[0]).toEqual(headers);
        expect(csv.slice(1)).toEqual(rows);
        console.log("Saved:", CSV_FILE);
    })
})
