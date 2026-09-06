import { findPaymentCase, type PaymentCase } from './cases'
import { getRecoveryStates, type RecoveryState } from './recovery'
import { diagnosePayment } from './rules'

export function readNavigation(value: unknown, generation: string, now: number): { payment: PaymentCase; step: number; recoveryState: RecoveryState } | null {
  if (!value || typeof value !== 'object') return null
  const data = value as Record<string, unknown>
  if (data.version !== 1 || data.generation !== generation ||
    typeof data.reference !== 'string' || typeof data.step !== 'number' ||
    !Number.isInteger(data.step) || data.step < 0 || data.step > 6 ||
    typeof data.expiresAt !== 'number' || !Number.isFinite(data.expiresAt) || data.expiresAt <= now ||
    typeof data.recoveryState !== 'string') return null
  const payment = findPaymentCase(data.reference)
  if (!payment || !getRecoveryStates(diagnosePayment(payment).recoveryType).includes(data.recoveryState as RecoveryState)) return null
  return { payment, step: data.step, recoveryState: data.recoveryState as RecoveryState }
}
