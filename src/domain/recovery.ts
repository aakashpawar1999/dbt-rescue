import type { PaymentCase } from './cases'
import type { PaymentDiagnosis } from './rules'

export type RecoveryState =
  | 'needs-correction'
  | 'correction-submitted'
  | 'record-updated'
  | 'payment-reissued'
  | 'account-credited'

export const RECOVERY_STATES: RecoveryState[] = [
  'needs-correction',
  'correction-submitted',
  'record-updated',
  'payment-reissued',
  'account-credited',
]

export const RECOVERY_LABELS: Record<RecoveryState, string> = {
  'needs-correction': 'Correction needed',
  'correction-submitted': 'Correction submitted',
  'record-updated': 'Pension record updated',
  'payment-reissued': 'Payment reissued',
  'account-credited': 'Account credited',
}

const NEXT_STATE: Record<RecoveryState, RecoveryState> = {
  'needs-correction': 'correction-submitted',
  'correction-submitted': 'record-updated',
  'record-updated': 'payment-reissued',
  'payment-reissued': 'account-credited',
  'account-credited': 'account-credited',
}

export type CorrectionRequest = {
  reference: string
  beneficiary: string
  scheme: string
  account: string
  owner: string
  action: string
  documents: string[]
}

export function advanceRecovery(state: RecoveryState): RecoveryState {
  return NEXT_STATE[state]
}

export function buildCorrectionRequest(payment: PaymentCase, diagnosis: PaymentDiagnosis): CorrectionRequest {
  return {
    reference: payment.reference,
    beneficiary: payment.beneficiaryName,
    scheme: payment.scheme,
    account: payment.maskedAccount,
    owner: diagnosis.owner,
    action: diagnosis.action,
    documents: diagnosis.documents,
  }
}
