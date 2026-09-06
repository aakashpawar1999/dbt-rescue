import type { PaymentCase, PaymentEvent, PaymentRoute } from './cases'

export type RecoveryType = 'trace' | 'correction'
export type ReviewerStatus = 'human-reviewed' | 'unreviewed'

export type RuleProvenance = {
  ruleId: string
  version: string
  schemeScope: string
  route: PaymentRoute
  rawReason: string
  sourceTitle: string
  sourceUrl: string
  reviewDate: string
  reviewerStatus: ReviewerStatus
  matchedEventId: string
  matchedEventStatus: PaymentEvent['status']
  matchedEventSource: string
  matchedEventTimestamp: string
}

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
  provenance: RuleProvenance
}

type RuleRecord = Omit<PaymentDiagnosis, 'scheme' | 'route' | 'provenance'> & {
  ruleId: string
  version: string
  schemeScope: string
  route: PaymentRoute
  eventId: string
  eventStatus: PaymentEvent['status']
  rawReason: string
  sourceTitle: string
  sourceUrl: string
  reviewerStatus: ReviewerStatus
}

const REVIEW_DATE = '2026-08-20'
const SOURCE_LABEL = 'DBT Rescue reviewed demo rules'
const RULE_VERSION = '1.0.0'

const RULES: Record<string, RuleRecord> = {
  'DBT-SUNITA-001': {
    ruleId: 'DBT-SUNITA-001-RULE-1',
    version: RULE_VERSION,
    schemeScope: 'Farmer benefit demo',
    route: 'aadhaar',
    eventId: 'mapper-routed',
    eventStatus: 'confirmed',
    rawReason: 'MAPPED_TO_BANK_B',
    reason: 'Payment reached the newer mapped bank',
    explanation: 'The payment succeeded through the Aadhaar-based route and reached the newer mapped Bank B, not the older Bank A. Check Bank B\'s statement before filing a grievance.',
    owner: 'Bank B trace desk',
    action: 'Check Bank B before filing a grievance. If the credit is not visible, ask Bank B to trace payment DBT-SUNITA-001 using the fictional reference.',
    documents: ['Bank B statement or passbook', 'Fictional payment reference', 'Permitted identity document'],
    nextState: 'Check mapped Bank B or request a trace',
    technicalReason: 'APB_CREDITED_MAPPED_ACCOUNT',
    sourceLabel: SOURCE_LABEL,
    sourceTitle: 'DBT payments and failure resources',
    sourceUrl: 'https://dbtbharat.gov.in/index.php/static-page-content/spagecont?id=4',
    reviewDate: REVIEW_DATE,
    reviewerStatus: 'human-reviewed',
    recoveryType: 'trace',
  },
  'DBT-ARJUN-002': {
    ruleId: 'DBT-ARJUN-002-RULE-1',
    version: RULE_VERSION,
    schemeScope: 'Scholarship demo',
    route: 'account',
    eventId: 'destination-failed',
    eventStatus: 'failed',
    rawReason: 'INVALID_IFSC',
    reason: 'Invalid IFSC in the scheme record',
    explanation: 'The scheme has an incorrect or outdated branch code, so the account-based payment cannot reach the correct bank branch.',
    owner: 'Scholarship department',
    action: 'Update the scheme beneficiary record with the current IFSC. Confirm it with your bank first; the receiving bank cannot edit the government scheme record for you.',
    documents: ['Bank letter or passbook showing the current IFSC', 'Fictional scholarship reference', 'Scheme beneficiary record details'],
    nextState: 'Scheme record correction needed',
    technicalReason: 'INVALID_IFSC',
    sourceLabel: SOURCE_LABEL,
    sourceTitle: 'PFMS validation and payment rejection remedies',
    sourceUrl: 'https://pfms.nic.in/sitePages/doc/PFMS_Validation_Payment_Rejection_Remedies.pdf',
    reviewDate: REVIEW_DATE,
    reviewerStatus: 'human-reviewed',
    recoveryType: 'correction',
  },
  'DBT-MEENA-003': {
    ruleId: 'DBT-MEENA-003-RULE-1',
    version: RULE_VERSION,
    schemeScope: 'Social pension demo',
    route: 'aadhaar',
    eventId: 'mapper-failed',
    eventStatus: 'failed',
    rawReason: 'UID_NOT_MAPPED',
    reason: 'No active bank is mapped for DBT',
    explanation: 'The payment could not be routed because no active bank was available in the DBT mapping for this fictional case.',
    owner: 'Your bank branch',
    action: 'Ask your bank to seed Aadhaar to your account and update the NPCI mapper for DBT. Then ask the pension office to reprocess the payment.',
    documents: ['Permitted identity document', 'Bank passbook or account proof', 'Scheme or beneficiary reference'],
    nextState: 'Bank mapping correction needed',
    technicalReason: 'UID_NOT_MAPPED',
    sourceLabel: SOURCE_LABEL,
    sourceTitle: 'NPCI Aadhaar Payments Bridge SOP',
    sourceUrl: 'https://www.npci.org.in/PDF/nach/notofied-document/Aadhaar-Payments-Bridge-%28APB%29-System-SOP_V3.0.3.pdf',
    reviewDate: REVIEW_DATE,
    reviewerStatus: 'human-reviewed',
    recoveryType: 'correction',
  },
}

const UNKNOWN_RULE: Omit<RuleRecord, 'route' | 'eventId' | 'eventStatus' | 'rawReason'> = {
  ruleId: 'UNKNOWN-RAW-REASON',
  version: '0.0.0',
  schemeScope: 'Unknown scheme',
  reason: 'No reviewed instruction is available for this payment reason',
  explanation: 'This prototype does not have a reviewed rule for the reported technical reason, so it will not guess the cause or remedy.',
  owner: 'Official scheme or bank contact',
  action: 'Do not use a specific remedy from this prototype. Contact the official scheme or bank support listed by the responsible organisation and keep the payment reference.',
  documents: ['Fictional payment reference'],
  nextState: 'Seek official guidance before correction',
  technicalReason: 'UNREVIEWED_RAW_REASON',
  sourceLabel: 'No reviewed source for this reason',
  sourceTitle: 'No reviewed source',
  sourceUrl: '',
  reviewDate: REVIEW_DATE,
  reviewerStatus: 'unreviewed',
  recoveryType: 'trace',
}

function buildDiagnosis(payment: PaymentCase, event: PaymentEvent, rule: RuleRecord | null): PaymentDiagnosis {
  const selected = rule ?? {
    ...UNKNOWN_RULE,
    route: payment.route,
    eventId: event.id,
    rawReason: event.rawReason,
  }

  return {
    ...selected,
    scheme: payment.scheme,
    route: payment.route,
    provenance: {
      ruleId: selected.ruleId,
      version: selected.version,
      schemeScope: selected.schemeScope === 'Unknown scheme' ? payment.scheme : selected.schemeScope,
      route: payment.route,
      rawReason: event.rawReason,
      sourceTitle: selected.sourceTitle,
      sourceUrl: selected.sourceUrl,
      reviewDate: selected.reviewDate,
      reviewerStatus: selected.reviewerStatus,
      matchedEventId: event.id,
      matchedEventStatus: event.status,
      matchedEventSource: event.source,
      matchedEventTimestamp: event.timestamp,
    },
  }
}

export function diagnoseEvent(payment: PaymentCase, event: PaymentEvent): PaymentDiagnosis {
  const rule = Object.values(RULES).find((candidate) =>
    candidate.route === payment.route &&
    event.route === payment.route &&
    event.maskedReference === payment.reference &&
    event.status === candidate.eventStatus &&
    candidate.schemeScope === payment.scheme &&
    candidate.eventId === event.id &&
    candidate.rawReason === event.rawReason &&
    (candidate.technicalReason !== 'APB_CREDITED_MAPPED_ACCOUNT' || (
      payment.events.some((item) => item.id === 'destination-credited') &&
      payment.events.filter((item) => item.id === 'destination-credited').every((item) =>
        item.status === 'confirmed' && item.rawReason === 'CREDITED' &&
        item.route === payment.route && item.maskedReference === payment.reference,
      )
    )),
  ) ?? null

  return buildDiagnosis(payment, event, rule)
}

export function diagnosePayment(payment: PaymentCase): PaymentDiagnosis {
  const rule = RULES[payment.reference]
  const event = payment.events.find((candidate) => candidate.id === rule?.eventId)
    ?? payment.events.find((candidate) => candidate.status === 'failed')
    ?? payment.events[0]

  return diagnoseEvent(payment, event)
}
