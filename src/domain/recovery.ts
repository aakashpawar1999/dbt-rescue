import type { PaymentCase } from './cases'
import type { PaymentDiagnosis, RecoveryType } from './rules'

export type RecoveryState =
  | 'needs-correction'
  | 'correction-submitted'
  | 'record-updated'
  | 'payment-reissued'
  | 'account-credited'
  | 'needs-trace'
  | 'trace-requested'
  | 'trace-confirmed'

const RECOVERY_SEQUENCES: Record<RecoveryType, RecoveryState[]> = {
  correction: ['needs-correction', 'correction-submitted', 'record-updated', 'payment-reissued', 'account-credited'],
  trace: ['needs-trace', 'trace-requested', 'trace-confirmed'],
}

export const RECOVERY_STATES = RECOVERY_SEQUENCES.correction

export const RECOVERY_LABELS: Record<RecoveryState, string> = {
  'needs-correction': 'Correction needed',
  'correction-submitted': 'Correction submitted',
  'record-updated': 'Scheme record updated',
  'payment-reissued': 'Payment reissued',
  'account-credited': 'Account credited',
  'needs-trace': 'Check mapped bank or request a trace',
  'trace-requested': 'Bank trace requested',
  'trace-confirmed': 'Bank trace completed',
}

export function getRecoveryStates(type: RecoveryType): RecoveryState[] {
  return RECOVERY_SEQUENCES[type]
}

export type CorrectionRequest = {
  reference: string
  beneficiary: string
  scheme: string
  account: string
  owner: string
  action: string
  documents: string[]
  requestType: RecoveryType
  nextState: string
}

export function advanceRecovery(state: RecoveryState, type: RecoveryType = 'correction'): RecoveryState {
  const states = getRecoveryStates(type)
  const index = states.indexOf(state)
  if (index < 0) throw new Error('Invalid recovery transition')
  return states[Math.min(index + 1, states.length - 1)]
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
    requestType: diagnosis.recoveryType,
    nextState: diagnosis.nextState,
  }
}
