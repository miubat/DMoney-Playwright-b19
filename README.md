# DMoney Portal – Agent Workflow Automation (Playwright)

End-to-end automation of the full Agent lifecycle on the [DMoney Portal](https://dmoneyportal.roadtocareer.net) using **Playwright + TypeScript** and the **Page Object Model**.

The test registers a brand-new Agent, gets it activated by Admin, funds it from the System account, makes a customer deposit, resets the password and finally exports the Agent's Self Statement to a CSV file.

---

## Tech Stack

| Tool | Purpose |
|------|---------|
| Playwright Test | Browser automation & test runner |
| TypeScript | Test language |
| @faker-js/faker | Random agent name / email / phone for every run |
| Node `fs` | Writing the Self Statement CSV |

---

## Project Structure

```
playwright-b19/
├── pages/dmoney/                  # Page Objects
│   ├── LoginPage.pom.ts           # login + OTP verify
│   ├── RegisterPage.pom.ts        # sign up form
│   ├── DashboardPage.pom.ts       # side menu, logout, balance
│   ├── UserListPage.pom.ts        # admin user search / activate
│   ├── CashInPage.pom.ts          # agent cash in (deposit)
│   ├── PasswordPage.pom.ts        # forgot + reset password
│   └── SelfStatementPage.pom.ts   # statement table reader
├── tests/dmoney/
│   └── agentWorkflow.spec.ts      # full workflow (20 tests)
├── utils/
│   ├── dmoneyData.ts              # credentials, test data, date helpers
│   ├── dmoneyApi.ts               # reads OTP / reset token as Admin
│   ├── csvHelper.ts               # save + read CSV
│   └── suites.ts                  # @smoke / @regression tags
├── output/                        # self_statement_<yyyy-mm-dd>.csv
└── playwright.dmoney.config.ts    # config for this assignment
```

---

## Workflow

1. Open DMoney Portal → **Sign Up** → register a new user with **Agent** role
2. Login as **Admin** (`admin@dmoney.com` / `1234`) → find the Agent → set status **Active**
3. Logout → login as **System** (`system@dmoney.com` / `1234`)
4. Cash In **2000 Tk** to the new Agent → logout
5. Login as the **Agent** (with OTP) → balance must be **2000 Tk**
6. Cash In **500 Tk** to an existing Customer → transaction must succeed
7. Logout → **Forgot Password** → set a new password
8. Old password login must **fail**, new password login must **pass**
9. Open **Self Statement** → read every row → save to `output/self_statement_<today>.csv`

All tests share one browser page and run in serial mode, so one headed run produces a single continuous video of the whole flow.

---

## Test Coverage

| # | Test Case | Smoke | Regression |
|---|-----------|:-----:|:----------:|
| 1 | Agent registration is successful | ✅ | ✅ |
| 2 | Admin login is successful | ✅ | ✅ |
| 3 | New Agent appears in the Admin user list | ✅ | ✅ |
| 4 | New Agent is inactive (PENDING) at first | | ✅ |
| 5 | Admin can activate the Agent | ✅ | ✅ |
| 6 | Agent stays active after page reload | ✅ | ✅ |
| 7 | System login is successful | ✅ | ✅ |
| 8 | System can deposit 2000 Tk to the Agent | ✅ | ✅ |
| 9 | System deposit creates the correct transaction record | ✅ | ✅ |
| 10 | Agent can log in after activation | ✅ | ✅ |
| 11 | Agent balance is exactly 2000 Tk | ✅ | ✅ |
| 12 | Agent can deposit 500 Tk to an existing Customer | ✅ | ✅ |
| 13 | Agent balance is updated after the transaction (2000 − 500 + 12.50 commission = 1512.50) | ✅ | ✅ |
| 14 | Customer deposit appears in the Agent Self Statement | ✅ | ✅ |
| 15 | Agent logout works | ✅ | ✅ |
| 16 | Agent password reset works | ✅ | ✅ |
| 17 | Login with the old password fails | | ✅ |
| 18 | Login with the new password succeeds | ✅ | ✅ |
| 19 | Self Statement has the expected transactions | ✅ | ✅ |
| 20 | Self Statement is saved into a CSV file | ✅ | ✅ |

**Smoke suite** = only positive (happy path) cases → 18 tests
**Regression suite** = all cases including negative checks → 20 tests

Tags live in [utils/suites.ts](utils/suites.ts) and are attached with Playwright's `tag` option.

---

## How to Run

```bash
# install
npm install
npx playwright install chromium

# full regression (headed)
npm run test:regression

# smoke suite only (headed)
npm run test:smoke

# open the html report
npx playwright show-report
```

The browser runs in **headed** mode with a small `slowMo`, so the flow is easy to follow. The video is saved to `videos/dmoney_run_<date>.webm`.

---

## Notes

- **OTP & reset link:** Agent login needs a 4-digit OTP, and password reset sends a link by email. The test agent uses a random Gmail address, so its inbox can't be opened. Instead, [utils/dmoneyApi.ts](utils/dmoneyApi.ts) logs in as Admin through the API and reads the `otp` / `reset_token` from the user record. The reset token is then opened as `/reset-password?token=...`, the same page the email link opens.
- **Customer:** The 500 Tk deposit goes to an existing active customer (`01827464816`, set in [utils/dmoneyData.ts](utils/dmoneyData.ts)). The Admin test also checks that this customer is still ACTIVE before using it.
- **Statement date filter:** The Self Statement page fills its default date filter with the UTC date. Between 12 AM and 6 AM in Bangladesh, that hides new rows, so the test sets the range to yesterday → today.
- Agent earns **2.5% commission** on Cash In, so the balance after the 500 Tk deposit is **1512.50**, not 1500.

---

## Output – Self Statement CSV

File: `output/self_statement_<yyyy-mm-dd>.csv`

```csv
Transaction ID,Sender Account,Receiver Account,Type,Debit,Credit,Balance,Date
TXNCPXP2QIYVH,SYSTEM,01978989776,Top-up from SYSTEM,-,2000.00,2000.00,"18/10/2026, 00:23:11"
TXNF5KF0Y5XGR,01978989776,01827464816,Deposit Commission,500.00,12.50,1512.50,"18/10/2026, 00:23:16"
```

---

## Regression Test Result

<img width="1160" height="588" alt="screenshots-regression-result" src="https://github.com/user-attachments/assets/e5e872d9-119c-46ad-83b4-7d6adc7e2f20" />


---

## SmokeTest Result

<img width="1119" height="497" alt="screenshot-smoke-result" src="https://github.com/user-attachments/assets/cf648cd2-3892-4515-b135-198421d7d480" />


---

## Automation Video (Headed Mode)

https://github.com/user-attachments/assets/751c746b-40e2-48b9-9e84-cbcbf9d993fd


