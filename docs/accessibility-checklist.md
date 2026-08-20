# DBT Rescue 0.3.0 accessibility and print checklist

Test date: 20 August 2026  
Browser: Codex In-app Browser  
Application: local Vite development build at 360 × 800 CSS pixels

This checklist records observed prototype behavior. The user approved the
remaining human review gates in this task thread on 20 August 2026.

| Check | Result | Evidence or follow-up |
|---|---|---|
| Keyboard | Approved by user | Every control has a native button, input, select, or details control; visible focus is a 3px outline. User approved the documented person-led review. |
| Screen reader | Approved by user | DOM inspection exposed named language controls, labelled form fields, heading hierarchy, landmarks, live status, alert validation, and linked field help. User approved the documented screen-reader review. |
| 200% zoom | Approved by user | The user approved the documented 200% zoom review. |
| Contrast and grayscale | Approved by user | Status uses text labels as well as colour and icons; focus uses a high-visibility outline. User approved the documented contrast and grayscale review. |
| 360px viewport | Pass | English and Hindi checks reported `body.scrollWidth` and `documentElement.scrollWidth` of 360 at a 360px viewport, including the Hindi Sunita packet. |
| Touch targets | Pass | Browser measurement found 44px language/mode controls and at least 49px form controls/buttons on the initial 360px view. |
| Print packet | Approved by user | The selected-language packet retained masked identifiers, source, and absolute timestamp; it contained 0 interactive descendants. User approved the documented browser print-preview review. |
| Low-data boundary | Pass | System font stack; no remote font, image, video, analytics, or runtime translation request in the app. |
| Hindi terminology | Approved by user | English/Hindi parity and all 15 event translations are automated; the user approved banking, scheme, owner, action, and document wording. |

## Manual paths observed

- Meena: Hindi assisted mode → language switch to English → diagnosis → correction packet → acknowledgement → all correction tracker states.
- Arjun: account-based journey → invalid IFSC diagnosis.
- Sunita: mapped Bank B journey → trace packet in English and Hindi → browser Back preserved case, language, and step.
- Unknown reference: alert focused `reference-error` and remained within the 360px document width.

No real beneficiary, Aadhaar, bank, OTP, government-login, or financial data
was entered.
