# Financial Statements Dialog - Setup Guide

## Overview
This AdaptiveDialog creates an interactive bot experience for generating financial statements (Balance Sheet, Income Statement, Cash Flow, and Financial Ratios) in Greek.

## What Was Fixed

### 1. YAML Parsing Error (Line 213)
**Problem:** The `InvokeFlowAction` had two issues:
- `flowId` was set to a string `"Process_Financial_Statements_Main"` instead of a GUID format
- Used `inputs:` (plural) instead of `input:` (singular)

**Solution:**
```yaml
# Before (INCORRECT):
- kind: InvokeFlowAction
  id: callPowerAutomate
  flowId: Process_Financial_Statements_Main  # ❌ Not a GUID
  inputs:                                      # ❌ Wrong property name
    ...

# After (CORRECT):
- kind: InvokeFlowAction
  id: callPowerAutomate
  flowId: 00000000-0000-0000-0000-000000000000  # ✅ Placeholder GUID format
  input:                                         # ✅ Correct property name
    ...
```

## Required Configuration Steps

### Step 1: Get Your Power Automate Flow ID

1. Go to [Power Automate](https://make.powerautomate.com)
2. Find your flow named something like "Process Financial Statements"
3. Click on the flow to open it
4. In the URL, you'll see the Flow ID (GUID format), OR:
5. Click on the flow details/properties to find the Flow ID

The Flow ID looks like: `12345678-90ab-cdef-1234-567890abcdef`

### Step 2: Update the YAML File

Open `financial-statements-dialog.yaml` and find line ~220:

```yaml
flowId: 00000000-0000-0000-0000-000000000000  # REPLACE with your actual Flow ID GUID
```

Replace the placeholder GUID with your actual Flow ID:

```yaml
flowId: 12345678-90ab-cdef-1234-567890abcdef  # Your actual Flow ID
```

### Step 3: Verify Power Automate Flow Inputs

Ensure your Power Automate Flow has these input parameters:
- `TrialBalanceFile` (File/Attachment)
- `Period` (String)
- `StatementTypes` (String)
- `AdditionalOptions` (String)
- `UserEmail` (String)

### Step 4: Import to Copilot Studio

1. Open [Copilot Studio](https://copilotstudio.microsoft.com)
2. Go to your copilot/bot
3. Navigate to **Topics**
4. Click **Add** > **Import from file**
5. Upload the `financial-statements-dialog.yaml` file

## Dialog Flow Overview

The dialog follows this conversation flow:

1. **Welcome Message** - Explains the process
2. **Period Selection** - Q1-Q4 2024, Year 2024/2023, or custom period
3. **Statement Type Selection** - Balance Sheet, Income Statement, Cash Flow, Ratios
4. **File Upload** - User uploads trial balance (Excel/CSV)
5. **File Validation** - Checks if file was uploaded
6. **Additional Options** - Comparisons, charts, detailed analysis
7. **Confirmation Summary** - Shows all selections
8. **Final Confirmation** - User confirms or makes changes
9. **Power Automate Invocation** - Processes the data
10. **Success/Results** - Shows generated files and email notification
11. **Next Actions** - Download files, help with ratios, or create new statements

## Trigger Phrases (Greek & English)

The dialog can be triggered with any of these phrases:
- "Δημιούργησε ισολογισμό"
- "Δημιουργία ισολογισμού"
- "Ανάλυση ισοζυγίου"
- "Παραγωγή οικονομικών καταστάσεων"
- "Θέλω να φτιάξω ισολογισμό"
- "Financial statements"
- "Create balance sheet"
- "Οικονομικές καταστάσεις"
- "Κάνε μου ισολογισμό"
- "Επεξεργασία ισοζυγίου"
- "Ισολογισμός και αποτελέσματα"
- "Κάνε μου τις οικονομικές καταστάσεις"

## Variables Used

| Variable | Type | Description |
|----------|------|-------------|
| `Topic.SelectedPeriod` | string | Selected reporting period |
| `Topic.CustomPeriod` | string | Custom period if "Other" selected |
| `Topic.StatementTypes` | string | Selected statement types |
| `Topic.TrialBalanceFile` | attachment | Uploaded trial balance file |
| `Topic.AdditionalOptions` | string | Additional processing options |
| `Topic.FinalConfirmation` | string | User's final confirmation |
| `Topic.FlowResult` | object | Result from Power Automate flow |
| `Topic.ChangeRequest` | string | What user wants to change |
| `Topic.NextAction` | string | User's next desired action |

## Troubleshooting

### YAML Parse Errors
- Ensure all GUID values are in proper format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- Check indentation (use spaces, not tabs)
- Verify all property names match exactly (case-sensitive)

### Flow Invocation Failures
- Verify the Flow ID is correct
- Ensure the Flow is turned ON in Power Automate
- Check that input parameter names match exactly
- Verify the Flow has permissions to be called from Copilot Studio

### File Upload Issues
- Maximum file size limits may apply
- Supported formats: .xlsx, .xls, .csv
- Ensure file attachment is enabled in your copilot settings

## Testing Checklist

- [ ] Dialog triggers correctly with Greek phrases
- [ ] Period selection works (including custom period)
- [ ] Statement type multi-select works
- [ ] File upload accepts Excel/CSV files
- [ ] File validation catches missing files
- [ ] Power Automate flow is invoked successfully
- [ ] Success message displays correctly
- [ ] Navigation (change options) works correctly
- [ ] Next actions (download, help, restart) work

## Support

For issues or questions:
1. Verify all configuration steps were completed
2. Check Power Automate flow run history for errors
3. Review Copilot Studio analytics for conversation logs
4. Ensure all prerequisites (Flow, permissions, file upload) are configured

---

**Version:** 1.0
**Last Updated:** 2025-11-05
**Language:** Greek (Ελληνικά) with English support
