# Batch Transaction Processing System

---

## 📌 Overview

Develop a web application for processing batch transfers via CSV files. The initial **Home Page** displays a list of transactions with statuses. A **Batch Transfer** button opens a modal dialog that guides the user through a three-step process.

---

## 🏠 Home Page

- Display a table of transactions with the following columns:
  - **Transaction Date**
  - **Account Number**
  - **Account Holder Name**
  - **Amount**
  - **Status**
- Include a **Batch Transfer** button that opens the batch transfer dialog.

---

## 🔄 Batch Transfer Dialog (Stepper)

### **Step 1 – Transfer Details**

- **Batch Transfer Name:** Input field.
- **File Upload:** Interface to upload CSV files.
- **Approver Selection:** Dropdown populated with a random list of names.

### 📄 CSV Format Example:

```
Transaction Date,Account Number,Account Holder Name,Amount
2025-02-20,000-123456789-01,John Doe,100.00
2025-02-21,000-987654321-02,Jane Smith,250.50

```

---

### **Step 2 – Review Records**

- Parse and display CSV records in a table.
- Validate each record:
  ✅ **Transaction Date:** Must be in ISO format (YYYY-MM-DD) and represent a valid date.
  ✅ **Account Number:** Must match the pattern `000-000000000-00`
  ✅ **Account Holder Name:** Must not be empty.
  ✅ **Amount:** Must be a positive decimal number.

---

### **Step 3 – Summary**

- Display the **Batch Transfer Name** and the selected **Approver**.
- Show summary statistics:
  - **Total Amount:** Sum of all transaction amounts.
  - **Number of Payments:** Count of transactions.
  - **Average Payment Value:** Calculated average per transaction.

---

## ⚠️ Validation File Sample

Use the following CSV content to trigger various validation errors:

```
Transaction Date,Account Number,Account Holder Name,Amount
2025-02-20,000-123456789-01,John Doe,100.00
2025/02/21,00012345678901,Jane Smith,250.50
2025-02-30,000-987654321-02,,150.00
invalid-date,000-111222333-03,Alex Johnson,-50.00
2025-03-01,000-123456789-0A,Emily Davis,200.00

```

---

## 🎨 Status Labels & Colors

| Status      | Color     | Notes                                             |
| ----------- | --------- | ------------------------------------------------- |
| **Pending** | 🟡 Yellow |                                                   |
| **Settled** | 🟢 Green  |                                                   |
| **Failed**  | 🔴 Red    | Tooltip must display the associated error message |

---

## 📂 Data Persistence

- Uploaded transactions should be added (in-memory or file-based, no need for a full-stack system) to the current home page table.

---

## 🛠 General Requirements

✅ **State Management:** Persist state between dialog steps to allow navigation in both directions without data loss.

✅ **UI/UX:** Implement the batch transfer process entirely within a modal dialog to keep the user on the home page.

✅ **Code Quality:** Utilize modern frameworks and best practices. Ensure code is modular with appropriate unit tests.

✅ **Libraries:** Any library can be used for both components and other requirements.

---

<aside>
💡

**Please note:**

If you use AI tools while completing this task, please include a brief summary explaining how they were used and how they contributed to your solution. The use of AI is encouraged to help achieve the best possible result in the shortest amount of time, but it is not mandatory. Submissions completed with or without AI will be evaluated equally.

</aside>
