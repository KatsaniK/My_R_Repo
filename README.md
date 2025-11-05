# Financial Statements Copilot Dialog

This repository contains an AdaptiveDialog configuration for Microsoft Copilot Studio that helps users create financial statements (Balance Sheet, Income Statement, Cash Flow, and Financial Ratios) in Greek.

## Files

- `financial-statements-dialog.yaml` - The main AdaptiveDialog configuration
- `SETUP_GUIDE.md` - Detailed setup instructions and documentation

## Quick Start

1. Review the `SETUP_GUIDE.md` for complete setup instructions
2. Replace the placeholder Flow ID in the YAML file with your actual Power Automate Flow ID
3. Import the dialog into Copilot Studio
4. Test with trigger phrases like "Δημιούργησε ισολογισμό" or "Create balance sheet"

## What's Fixed

This version fixes the YAML parsing error that occurred at line 213:
- Changed `flowId` from a string to proper GUID format
- Corrected `inputs:` to `input:` for InvokeFlowAction
- Added comprehensive documentation and setup instructions

For detailed information, see [SETUP_GUIDE.md](SETUP_GUIDE.md).
