import type { PaymentCase, PaymentRoute } from './cases'

export type RecoveryType = 'trace' | 'correction'

export type PaymentDiagnosis = {
  scheme: string
  route: PaymentRoute
  reason: string
  explanation: string
  owner: string
  action: string
  documents: string[]
  nextState: string
  technicalReason: string
  sourceLabel: string
  reviewDate: string
  recoveryType: RecoveryType
}

const REVIEW_DATE = '2026-08-20'
const SOURCE_LABEL = 'DBT Rescue reviewed demo rules'

const RULES: Record<string, Omit<PaymentDiagnosis, 'scheme' | 'route'>> = {
  'DBT-SUNITA-001': {
    reason: 'Payment reached the newer mapped bank',
    explanation: 'The payment succeeded through the Aadhaar-based route and reached the newer mapped Bank B, not the older Bank A. Check Bank B\'s statement before filing a grievance.',
    owner: 'Bank B trace desk',
    action: 'Check Bank B before filing a grievance. If the credit is not visible, ask Bank B to trace payment DBT-SUNITA-001 using the fictional reference.',
    documents: ['Bank B statement or passbook', 'Fictional payment reference', 'Permitted identity document'],
    nextState: 'Check mapped Bank B or request a trace',
    technicalReason: 'APB_CREDITED_MAPPED_ACCOUNT',
    sourceLabel: SOURCE_LABEL,
    reviewDate: REVIEW_DATE,
    recoveryType: 'trace',
  },
  'DBT-ARJUN-002': {
    reason: 'Invalid IFSC in the scheme record',
    explanation: 'The scheme has an incorrect or outdated branch code, so the account-based payment cannot reach the correct bank branch.',
    owner: 'Scholarship department',
    action: 'Update the scheme beneficiary record with the current IFSC. Confirm it with your bank first; the receiving bank cannot edit the government scheme record for you.',
    documents: ['Bank letter or passbook showing the current IFSC', 'Fictional scholarship reference', 'Scheme beneficiary record details'],
    nextState: 'Scheme record correction needed',
    technicalReason: 'INVALID_IFSC',
    sourceLabel: SOURCE_LABEL,
    reviewDate: REVIEW_DATE,
    recoveryType: 'correction',
  },
  'DBT-MEENA-003': {
    reason: 'No active bank is mapped for DBT',
    explanation: 'The payment could not be routed because no active bank was available in the DBT mapping for this fictional case.',
    owner: 'Your bank branch',
    action: 'Ask your bank to seed Aadhaar to your account and update the NPCI mapper for DBT. Then ask the pension office to reprocess the payment.',
    documents: ['Permitted identity document', 'Bank passbook or account proof', 'Scheme or beneficiary reference'],
    nextState: 'Bank mapping correction needed',
    technicalReason: 'UID_NOT_MAPPED',
    sourceLabel: SOURCE_LABEL,
    reviewDate: REVIEW_DATE,
    recoveryType: 'correction',
  },
}

export function diagnosePayment(payment: PaymentCase): PaymentDiagnosis {
  const rule = RULES[payment.reference] ?? RULES['DBT-MEENA-003']
  return { ...rule, scheme: payment.scheme, route: payment.route }
}
