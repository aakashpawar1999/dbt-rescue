import type { PaymentCase } from './cases'

export type PaymentDiagnosis = {
  reason: string
  explanation: string
  owner: string
  action: string
  documents: string[]
  nextState: string
  technicalReason: string
}

export function diagnosePayment(payment: PaymentCase): PaymentDiagnosis {
  if (payment.route !== 'aadhaar') {
    return {
      reason: 'Unsupported demo route',
      explanation: 'This release only includes the Aadhaar-based pension demo.',
      owner: 'Demo support',
      action: 'Choose the documented pension demo reference.',
      documents: [],
      nextState: 'Choose a supported demo',
      technicalReason: 'ROUTE_NOT_IN_RELEASE',
    }
  }

  return {
    reason: 'No active bank is mapped for DBT',
    explanation: 'The payment could not be routed because no active bank was available in the DBT mapping for this fictional case.',
    owner: 'Your bank branch',
    action: 'Ask your bank to seed Aadhaar to your account and update the NPCI mapper for DBT. Then ask the pension office to reprocess the payment.',
    documents: [
      'Permitted identity document',
      'Bank passbook or account proof',
      'Scheme or beneficiary reference',
    ],
    nextState: 'Bank mapping correction needed',
    technicalReason: 'UID_NOT_MAPPED',
  }
}
