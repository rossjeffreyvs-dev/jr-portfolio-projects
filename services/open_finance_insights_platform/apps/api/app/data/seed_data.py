from app.models.schemas import Account, Institution, Transaction

INSTITUTIONS = [
    Institution(id="ins_001", name="Northstar Bank", type="bank", health_status="healthy"),
    Institution(id="ins_002", name="Metro Credit", type="credit_card", health_status="healthy"),
]

ACCOUNTS = [
    Account(id="acc_checking", institution_id="ins_001", name="Everyday Checking", type="checking", mask="1188", current_balance=18450.75, available_balance=18120.50),
    Account(id="acc_savings", institution_id="ins_001", name="High Yield Savings", type="savings", mask="4412", current_balance=42000.00, available_balance=42000.00),
    Account(id="acc_card", institution_id="ins_002", name="Founders Card", type="credit_card", mask="9231", current_balance=-3840.22, available_balance=11600.00),
]

TRANSACTIONS = [
    Transaction(id="txn_001", account_id="acc_checking", date="2026-05-01", merchant_name="Acme Payroll", raw_description="ACH CREDIT ACME PAYROLL", amount=12500.00),
    Transaction(id="txn_002", account_id="acc_checking", date="2026-05-03", merchant_name="Urban Rent", raw_description="ONLINE PAYMENT URBAN RENT", amount=-4200.00),
    Transaction(id="txn_003", account_id="acc_card", date="2026-05-04", merchant_name="CloudHost", raw_description="CLOUDHOST PRO SUBSCRIPTION", amount=-289.00),
    Transaction(id="txn_004", account_id="acc_card", date="2026-05-05", merchant_name="Figma", raw_description="FIGMA TEAM PLAN", amount=-144.00),
    Transaction(id="txn_005", account_id="acc_card", date="2026-05-06", merchant_name="OpenAI", raw_description="OPENAI API PLATFORM", amount=-312.45),
    Transaction(id="txn_006", account_id="acc_card", date="2026-05-07", merchant_name="Delta", raw_description="DELTA AIR LINES", amount=-612.20),
    Transaction(id="txn_007", account_id="acc_card", date="2026-05-09", merchant_name="Whole Foods", raw_description="WHOLEFDS HOBOKEN", amount=-186.35),
    Transaction(id="txn_008", account_id="acc_card", date="2026-05-10", merchant_name="Netflix", raw_description="NETFLIX.COM", amount=-22.99),
    Transaction(id="txn_009", account_id="acc_card", date="2026-04-10", merchant_name="Netflix", raw_description="NETFLIX.COM", amount=-22.99),
    Transaction(id="txn_010", account_id="acc_card", date="2026-03-10", merchant_name="Netflix", raw_description="NETFLIX.COM", amount=-22.99),
    Transaction(id="txn_011", account_id="acc_card", date="2026-04-05", merchant_name="Figma", raw_description="FIGMA TEAM PLAN", amount=-144.00),
    Transaction(id="txn_012", account_id="acc_card", date="2026-03-05", merchant_name="Figma", raw_description="FIGMA TEAM PLAN", amount=-144.00),
    Transaction(id="txn_013", account_id="acc_checking", date="2026-04-01", merchant_name="Acme Payroll", raw_description="ACH CREDIT ACME PAYROLL", amount=11800.00),
    Transaction(id="txn_014", account_id="acc_checking", date="2026-03-01", merchant_name="Acme Payroll", raw_description="ACH CREDIT ACME PAYROLL", amount=10950.00),
]
