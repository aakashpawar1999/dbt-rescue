export type PaymentRoute = 'aadhaar' | 'account'
export type PaymentEventStatus = 'confirmed' | 'failed' | 'not-received'

export type PaymentEvent = {
  id: string
  stage: string
  status: PaymentEventStatus
  source: string
  timestamp: string
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
      detail: 'The pension payment was approved for this fictional case.',
    },
    {
      id: 'pfms-validated',
      stage: 'PFMS',
      status: 'confirmed',
      source: 'PFMS demo response',
      timestamp: '2026-08-18T09:12:00+05:30',
      detail: 'The payment instruction passed the fictional validation step.',
    },
    {
      id: 'sponsor-sent',
      stage: 'Sponsor bank',
      status: 'confirmed',
      source: 'Sponsor bank demo response',
      timestamp: '2026-08-18T09:19:00+05:30',
      detail: 'The payment file was sent into the simulated payment network.',
    },
    {
      id: 'mapper-failed',
      stage: 'NPCI mapper',
      status: 'failed',
      source: 'NPCI mapper demo response',
      timestamp: '2026-08-18T09:20:00+05:30',
      detail: 'No active bank mapping was available for this fictional DBT route.',
    },
    {
      id: 'destination-missing',
      stage: 'Destination bank',
      status: 'not-received',
      source: 'Destination bank demo response',
      timestamp: '2026-08-18T09:21:00+05:30',
      detail: 'No credit confirmation is available because routing stopped earlier.',
    },
  ],
}

const CASES = [MEENA]

export function findPaymentCase(reference: string): PaymentCase | null {
  const safeReference = reference.trim().toUpperCase()
  return CASES.find((payment) => payment.reference === safeReference) ?? null
}
