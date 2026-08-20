export type PaymentRoute = 'aadhaar' | 'account'
export type PaymentEventStatus = 'confirmed' | 'failed' | 'missing' | 'conflict'

export type PaymentEvent = {
  id: string
  stage: string
  status: PaymentEventStatus
  source: string
  timestamp: string
  route: PaymentRoute
  rawReason: string
  simulated: true
  maskedReference: string
  detail: string
}

export type PaymentCase = {
  reference: string
  scheme: string
  beneficiaryName: string
  benefit: string
  amount: number
  route: PaymentRoute
  paymentDate: string
  maskedAccount: string
  events: PaymentEvent[]
}

type EventDetails = Omit<PaymentEvent, 'route' | 'simulated' | 'maskedReference'>

function event(reference: string, route: PaymentRoute, details: EventDetails): PaymentEvent {
  return { ...details, route, simulated: true, maskedReference: reference }
}

const SUNITA: PaymentCase = {
  reference: 'DBT-SUNITA-001',
  scheme: 'Farmer benefit demo',
  beneficiaryName: 'Sunita Devi',
  benefit: 'Farmer benefit instalment',
  amount: 2000,
  route: 'aadhaar',
  paymentDate: '2026-08-18',
  maskedAccount: 'Fictional Bank B account ending ••17',
  events: [
    event('DBT-SUNITA-001', 'aadhaar', {
      id: 'scheme-created',
      stage: 'Scheme department',
      status: 'confirmed',
      source: 'Farmer benefit demo office',
      timestamp: '2026-08-18T09:00:00+05:30',
      rawReason: 'PAYMENT_APPROVED',
      detail: 'The farmer-benefit payment was approved for this fictional case.',
    }),
    event('DBT-SUNITA-001', 'aadhaar', {
      id: 'pfms-validated',
      stage: 'PFMS',
      status: 'confirmed',
      source: 'PFMS demo response',
      timestamp: '2026-08-18T09:10:00+05:30',
      rawReason: 'VALIDATED',
      detail: 'The payment instruction passed the fictional validation step.',
    }),
    event('DBT-SUNITA-001', 'aadhaar', {
      id: 'mapper-routed',
      stage: 'NPCI mapper',
      status: 'confirmed',
      source: 'NPCI mapper demo response',
      timestamp: '2026-08-18T09:11:00+05:30',
      rawReason: 'MAPPED_TO_BANK_B',
      detail: 'The newer mapped bank for this fictional Aadhaar route is Bank B.',
    }),
    event('DBT-SUNITA-001', 'aadhaar', {
      id: 'destination-credited',
      stage: 'Destination bank',
      status: 'confirmed',
      source: 'Bank B demo response',
      timestamp: '2026-08-18T09:12:00+05:30',
      rawReason: 'CREDITED',
      detail: 'The payment was credited to the newer mapped Bank B account.',
    }),
    event('DBT-SUNITA-001', 'aadhaar', {
      id: 'older-account-not-found',
      stage: 'Citizen checked account',
      status: 'conflict',
      source: 'Bank A statement demo response',
      timestamp: '2026-08-18T09:13:00+05:30',
      rawReason: 'NO_CREDIT_IN_OLDER_ACCOUNT',
      detail: 'The older Bank A account shows no credit, which conflicts with the confirmed Bank B credit.',
    }),
  ],
}

const ARJUN: PaymentCase = {
  reference: 'DBT-ARJUN-002',
  scheme: 'Scholarship demo',
  beneficiaryName: 'Arjun Singh',
  benefit: 'Student scholarship',
  amount: 5000,
  route: 'account',
  paymentDate: '2026-08-17',
  maskedAccount: 'Fictional account ending ••58',
  events: [
    event('DBT-ARJUN-002', 'account', {
      id: 'scheme-created',
      stage: 'Scheme department',
      status: 'confirmed',
      source: 'Scholarship demo office',
      timestamp: '2026-08-17T10:00:00+05:30',
      rawReason: 'PAYMENT_APPROVED',
      detail: 'The scholarship payment was approved for this fictional case.',
    }),
    event('DBT-ARJUN-002', 'account', {
      id: 'pfms-validated',
      stage: 'PFMS',
      status: 'confirmed',
      source: 'PFMS demo response',
      timestamp: '2026-08-17T10:12:00+05:30',
      rawReason: 'VALIDATED',
      detail: 'The account-based payment instruction passed fictional validation.',
    }),
    event('DBT-ARJUN-002', 'account', {
      id: 'legacy-record',
      stage: 'Scheme beneficiary record',
      status: 'conflict',
      source: 'Legacy beneficiary snapshot',
      timestamp: '2026-08-17T10:14:00+05:30',
      rawReason: 'STALE_IFSC',
      detail: 'A stale snapshot shows a different branch code and remains visible for review.',
    }),
    event('DBT-ARJUN-002', 'account', {
      id: 'destination-failed',
      stage: 'Destination bank',
      status: 'failed',
      source: 'Receiving bank demo response',
      timestamp: '2026-08-17T10:20:00+05:30',
      rawReason: 'INVALID_IFSC',
      detail: 'The payment was returned because the IFSC in the scheme record is invalid.',
    }),
    event('DBT-ARJUN-002', 'account', {
      id: 'reconciliation-missing',
      stage: 'Payment reconciliation',
      status: 'missing',
      source: 'Reconciliation demo response',
      timestamp: '2026-08-17T10:21:00+05:30',
      rawReason: 'NO_RESPONSE',
      detail: 'No later reprocessing response is available in this fictional record.',
    }),
  ],
}

const MEENA: PaymentCase = {
  reference: 'DBT-MEENA-003',
  scheme: 'Social pension demo',
  beneficiaryName: 'Meena Kumari',
  benefit: 'Monthly social pension',
  amount: 1500,
  route: 'aadhaar',
  paymentDate: '2026-08-18',
  maskedAccount: 'Fictional account ending ••42',
  events: [
    {
      id: 'scheme-created',
      stage: 'Scheme department',
      status: 'confirmed',
      source: 'Social pension demo office',
      timestamp: '2026-08-18T09:00:00+05:30',
      route: 'aadhaar',
      rawReason: 'PAYMENT_APPROVED',
      simulated: true,
      maskedReference: 'DBT-MEENA-003',
      detail: 'The pension payment was approved for this fictional case.',
    },
    {
      id: 'pfms-validated',
      stage: 'PFMS',
      status: 'confirmed',
      source: 'PFMS demo response',
      timestamp: '2026-08-18T09:12:00+05:30',
      route: 'aadhaar',
      rawReason: 'VALIDATED',
      simulated: true,
      maskedReference: 'DBT-MEENA-003',
      detail: 'The payment instruction passed the fictional validation step.',
    },
    {
      id: 'sponsor-sent',
      stage: 'Sponsor bank',
      status: 'confirmed',
      source: 'Sponsor bank demo response',
      timestamp: '2026-08-18T09:19:00+05:30',
      route: 'aadhaar',
      rawReason: 'SENT_TO_NETWORK',
      simulated: true,
      maskedReference: 'DBT-MEENA-003',
      detail: 'The payment file was sent into the simulated payment network.',
    },
    {
      id: 'mapper-failed',
      stage: 'NPCI mapper',
      status: 'failed',
      source: 'NPCI mapper demo response',
      timestamp: '2026-08-18T09:20:00+05:30',
      route: 'aadhaar',
      rawReason: 'UID_NOT_MAPPED',
      simulated: true,
      maskedReference: 'DBT-MEENA-003',
      detail: 'No active bank mapping was available for this fictional DBT route.',
    },
    {
      id: 'destination-missing',
      stage: 'Destination bank',
      status: 'missing',
      source: 'Destination bank demo response',
      timestamp: '2026-08-18T09:21:00+05:30',
      route: 'aadhaar',
      rawReason: 'NO_RESPONSE_AFTER_ROUTING_STOPPED',
      simulated: true,
      maskedReference: 'DBT-MEENA-003',
      detail: 'No credit confirmation is available because routing stopped earlier.',
    },
  ],
}

export const PAYMENT_CASES = [SUNITA, ARJUN, MEENA]

export function findPaymentCase(reference: string): PaymentCase | null {
  const safeReference = reference.trim().toUpperCase()
  return PAYMENT_CASES.find((payment) => payment.reference === safeReference) ?? null
}

export function latestConfirmedEvent(payment: PaymentCase): PaymentEvent | null {
  const confirmed = payment.events
    .filter((event) => event.status === 'confirmed' || event.status === 'failed')
    .sort((left, right) => Date.parse(left.timestamp) - Date.parse(right.timestamp))

  return confirmed[confirmed.length - 1] ?? null
}
