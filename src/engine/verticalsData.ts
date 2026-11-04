import {
  DecisionLogEntry,
  DraftSection,
  EvidenceItem,
  RateCardRow,
  RequirementRow,
  RoomMessage,
  RubricCriterion,
  VerticalId
} from './signoffEngine';

export interface VerticalPack {
  id: VerticalId;
  number: string;
  name: string;
  tag: string;
  demoRole: string;
  persona: string;
  organization: string;
  counterparty: string;
  sourceDocTitle: string;
  sourceDocPages: number;
  deadlineText: string;
  stakesText: string;
  humanMomentSummary: string;
  humanDecisionPrompt: string;
  intakeRoomName: string;
  draftRoomName: string;
  requirements: RequirementRow[];
  evidence: EvidenceItem[];
  sections: DraftSection[];
  rubricInitial: RubricCriterion[];
  rubricFixed: RubricCriterion[];
  rateCard?: RateCardRow[];
  initialMessages: RoomMessage[];
  initialDecisionLog: DecisionLogEntry[];
}

export const VERTICAL_PACKS: Record<VerticalId, VerticalPack> = {
  grant: {
    id: 'grant',
    number: '01',
    name: 'Grant Room',
    tag: 'HERO · 3 MIN',
    demoRole: 'Nonprofit Funder Compliance & Application Engine',
    persona: 'Maya Lin, Program Director',
    organization: 'Harborview Workforce Collaborative (501c3 via Fiscal Sponsor)',
    counterparty: 'Regional Workforce Resilience Fund (2026 Cycle)',
    sourceDocTitle: 'RWRF-2026-Guidelines.pdf',
    sourceDocPages: 12,
    deadlineText: 'Due in 21 days · Max Award $250,000',
    stakesText: 'One missed eligibility rule or uncited outcome kills the application in triage.',
    humanMomentSummary:
      'Analyst flags: "Audited financials required (REQ-ATT-2); only a fiscal sponsor letter (E6) is currently attached." Maya (Client) confirms CivicBridge holds the 2025 independent audit (E7). You (Approver) authorize attaching E7 and citing E2.',
    humanDecisionPrompt: 'Use the fiscal sponsor’s 2025 audit [E7] to satisfy REQ-ATT-2 and cite [E2] on the 1,240 placement outcome. Proceed.',
    intakeRoomName: 'grant-intake',
    draftRoomName: 'grant-draft',
    requirements: [
      {
        id: 'REQ-01',
        section: '1. Statement of Community Need',
        requirement: 'Document displaced manufacturing & logistics worker unemployment rates in target zip codes with verified 2025–2026 regional data.',
        mandatory: true,
        source_page: 3,
        word_limit: 250,
        rubric_criterion: 'need',
        evidence_ids: ['E1', 'E3'],
        status: 'covered'
      },
      {
        id: 'REQ-02',
        section: '2. Program Design & Training Model',
        requirement: 'Describe the 14-week credentialing curriculum, employer wrap-around stipends, and apprenticeship handoff.',
        mandatory: true,
        source_page: 5,
        word_limit: 300,
        rubric_criterion: 'approach',
        evidence_ids: ['E1', 'E4'],
        status: 'covered'
      },
      {
        id: 'REQ-03',
        section: '3. Track Record & Measurable Outcomes',
        requirement: 'Provide 24-month historical cohort completion, credential attainment, and 180-day job retention metrics.',
        mandatory: true,
        source_page: 6,
        word_limit: 250,
        rubric_criterion: 'approach',
        evidence_ids: ['E2'],
        status: 'covered'
      },
      {
        id: 'REQ-04',
        section: '4. Organizational & Staff Capacity',
        requirement: 'Detail key instructional staff, employer liaison capacity, and governance structure.',
        mandatory: true,
        source_page: 8,
        word_limit: 220,
        rubric_criterion: 'capacity',
        evidence_ids: ['E5', 'E6'],
        status: 'covered'
      },
      {
        id: 'REQ-05',
        section: '5. Budget Narrative & Cost Per Participant',
        requirement: 'Break down the $250,000 request across direct instruction, wrap-around stipends, and <=12% indirect administration.',
        mandatory: true,
        source_page: 9,
        word_limit: 220,
        rubric_criterion: 'budget',
        evidence_ids: ['E4'],
        status: 'covered'
      },
      {
        id: 'REQ-06',
        section: '6. Employer Co-Investment & Sustainability',
        requirement: 'Demonstrate signed employer hiring commitments and post-grant wage progression pathways.',
        mandatory: true,
        source_page: 10,
        word_limit: 200,
        rubric_criterion: 'capacity',
        evidence_ids: ['E8'],
        status: 'covered'
      },
      {
        id: 'REQ-ATT-1',
        section: 'Attachment A: Line-Item Program Budget',
        requirement: 'Signed 24-month line-item budget spreadsheet matching narrative totals.',
        mandatory: true,
        source_page: 11,
        is_attachment: true,
        evidence_ids: ['E4'],
        status: 'covered'
      },
      {
        id: 'REQ-ATT-2',
        section: 'Attachment B: Independent Audited Financials',
        requirement: 'Most recent independent CPA financial audit (FY2025). Fiscal sponsor audit permitted only with explicit authorization.',
        mandatory: true,
        source_page: 12,
        is_attachment: true,
        evidence_ids: ['E7'],
        status: 'missing_attachment',
        disqualifier_note: 'Approve and attach fiscal sponsor CPA audit [E7] to satisfy Attachment B.'
      }
    ],
    evidence: [
      {
        id: 'E1',
        type: 'document',
        title: 'Harborview 2025 Annual Impact Report',
        path: 'verticals/grant/evidence/E1_annual_report_2025.pdf',
        date: '2026-01-18',
        issuer: 'Harborview Workforce Collaborative',
        attached: true,
        summary: 'Documents 14-week CNC & Cold-Chain Logistics bootcamps across 4 industrial corridors.'
      },
      {
        id: 'E2',
        type: 'spreadsheet',
        title: 'Verified Cohort Outcomes 2024–2025 (CSV)',
        path: 'verticals/grant/evidence/E2_outcomes_2024_2025.csv',
        date: '2026-02-04',
        issuer: 'State Wage Record Match System',
        attached: true,
        summary: '1,240 job seekers served; 86% credential attainment; 81% retained at 180 days at $26.40/hr median wage.'
      },
      {
        id: 'E3',
        type: 'document',
        title: 'Regional Labor Market Displacement Brief',
        path: 'verticals/grant/evidence/E3_bls_regional_brief.pdf',
        date: '2025-11-12',
        issuer: 'County Workforce Investment Board',
        attached: true,
        summary: 'Shows 7.8% unemployment in target port zip codes following warehouse automation closures.'
      },
      {
        id: 'E4',
        type: 'spreadsheet',
        title: 'FY2026–2027 Program Line-Item Budget',
        path: 'verticals/grant/evidence/E4_program_budget_250k.xlsx',
        date: '2026-10-20',
        issuer: 'Harborview Finance Team',
        attached: true,
        summary: '$250,000 total ($165,000 instruction, $60,000 participant stipends, $25,000 / 10% admin). Cost: $2,500/trainee for 100 trainees.'
      },
      {
        id: 'E5',
        type: 'document',
        title: 'Key Staff Bios & Instructor Certifications',
        path: 'verticals/grant/evidence/E5_staff_bios.pdf',
        date: '2026-09-01',
        issuer: 'Harborview HR',
        attached: true,
        summary: '4 full-time NIMS-certified instructors and 2 employer placement specialists (1:25 ratio).'
      },
      {
        id: 'E6',
        type: 'letter',
        title: 'CivicBridge 501(c)(3) Fiscal Sponsorship Agreement',
        path: 'verticals/grant/evidence/E6_fiscal_sponsor_letter.pdf',
        date: '2025-06-15',
        issuer: 'CivicBridge Nonprofit Partners',
        attached: true,
        summary: 'Confirms Harborview operates under CivicBridge’s 501(c)(3) EIN and shared financial controls.'
      },
      {
        id: 'E7',
        type: 'audit',
        title: 'CivicBridge FY2025 Independent CPA Audit Report',
        path: 'verticals/grant/evidence/E7_fiscal_sponsor_audit_fy25.pdf',
        date: '2026-03-30',
        issuer: 'Keller & Vance LLP CPAs',
        attached: false,
        summary: 'Unmodified (clean) CPA audit opinion for FY2025 covering all fiscally sponsored projects.'
      },
      {
        id: 'E8',
        type: 'letter',
        title: 'Signed Employer Hiring Letters (3 Port Logistics Partners)',
        path: 'verticals/grant/evidence/E8_employer_commitments.pdf',
        date: '2026-10-14',
        issuer: 'Pacific Cold Storage, AeroFreight, MetroPort',
        attached: true,
        summary: 'Commitments to interview 100% of graduates and hire at least 75 trainees at >=$25.50/hr.'
      }
    ],
    sections: [
      {
        id: 'sec-1',
        req_id: 'REQ-01',
        title: '1. Statement of Community Need',
        word_limit: 250,
        rubric_criterion: 'need',
        content: `Harborview Workforce Collaborative serves four industrial port zip codes where warehouse automation closures displaced 3,400 logistics workers over the past 18 months [E3]. Regional unemployment in our target census tracts stands at 7.8%, more than double the metropolitan average [E3].\n\nWithout rapid upskilling into computerized numerical control (CNC) machining and cold-chain automation maintenance, displaced mid-career workers face prolonged wage scarring [E1]. Our intake waiting list currently holds 310 eligible adults from low-income households seeking accelerated technical credentials [E1].`
      },
      {
        id: 'sec-2',
        req_id: 'REQ-02',
        title: '2. Program Design & Training Model',
        word_limit: 300,
        rubric_criterion: 'approach',
        content: `Our 14-week dual-track curriculum combines 420 hours of hands-on lab instruction with paid employer-site practicums [E1]. Participants earn stackable NIMS and EPA Section 608 certifications while receiving $600 monthly transportation and childcare stipends funded directly through the grant budget [E4].\n\nEvery cohort is co-taught by industry instructors at a 1:25 specialist ratio, ensuring individualized job-readiness coaching from week one through apprenticeship handoff [E5].`
      },
      {
        id: 'sec-3',
        req_id: 'REQ-03',
        title: '3. Track Record & Measurable Outcomes',
        word_limit: 250,
        rubric_criterion: 'approach',
        content: `Across the 2024–2025 performance period, we served 1,240 job seekers last year across four port corridors.\n\nState wage-record matches confirm an 86% industry credential attainment rate and an 81% job retention rate at 180 days post-placement, with graduates earning a median starting wage of $26.40 per hour [E2]. For the 2026 cohort, we will enroll 100 displaced workers and achieve at least 85 placements within six months of graduation [E4].`
      },
      {
        id: 'sec-4',
        req_id: 'REQ-04',
        title: '4. Organizational & Staff Capacity',
        word_limit: 220,
        rubric_criterion: 'capacity',
        content: `Harborview operates with four full-time NIMS-certified technical instructors and two dedicated employer placement specialists [E5]. Financial administration, payroll compliance, and grant accounting are managed under our 501(c)(3) fiscal sponsorship agreement with CivicBridge Nonprofit Partners [E6].\n\n[GAP: Confirm whether funder requires separate sub-recipient SAM.gov UEI registration for fiscally sponsored project].`
      },
      {
        id: 'sec-5',
        req_id: 'REQ-05',
        title: '5. Budget Narrative & Cost Per Participant',
        word_limit: 220,
        rubric_criterion: 'budget',
        content: `We request $250,000 over 12 months to train and place 100 displaced workers at an all-inclusive cost of $2,500 per participant [E4]. Direct instructional salaries and lab consumables total $165,000 (66%), direct trainee wrap-around stipends total $60,000 (24%), and fiscal sponsor administrative overhead is capped at $25,000 (10%), well below the funder's 12% ceiling [E4].`
      },
      {
        id: 'sec-6',
        req_id: 'REQ-06',
        title: '6. Employer Co-Investment & Sustainability',
        word_limit: 200,
        rubric_criterion: 'capacity',
        content: `Three regional employers—Pacific Cold Storage, AeroFreight, and MetroPort—have signed binding letters of commitment to guaranteed interviews for 100% of graduates and priority hiring for at least 75 trainees at wages starting at $25.50 per hour [E8]. Employers also contribute $45,000 in donated shop-floor equipment time [E8].`
      }
    ],
    rubricInitial: [
      {
        criterion: 'need',
        label: 'Statement of Need & Target Population',
        weight: 30,
        score: 92,
        rationale: 'Census-tract unemployment [E3] and intake demand [E1] cited.',
        finding_ids: []
      },
      {
        criterion: 'approach',
        label: 'Program Design & Measurable Outcomes',
        weight: 30,
        score: 68,
        rationale: 'Hold: Section 3 metric (1,240 served) is missing [E2].',
        finding_ids: ['RULE-2']
      },
      {
        criterion: 'capacity',
        label: 'Organizational Capacity & Governance',
        weight: 20,
        score: 60,
        rationale: 'Hold: Mandatory CPA Audit [E7] is not attached yet.',
        finding_ids: ['RULE-5']
      },
      {
        criterion: 'budget',
        label: 'Budget Realism & Cost Efficiency',
        weight: 20,
        score: 90,
        rationale: '$2,500/trainee cost and 10% overhead verified in [E4].',
        finding_ids: []
      }
    ],
    rubricFixed: [
      {
        criterion: 'need',
        label: 'Statement of Need & Target Population',
        weight: 30,
        score: 94,
        rationale: 'Displacement data [E3] and intake demand [E1] cited.',
        finding_ids: []
      },
      {
        criterion: 'approach',
        label: 'Program Design & Measurable Outcomes',
        weight: 30,
        score: 95,
        rationale: '1,240 served and 81% retention verified via [E2].',
        finding_ids: []
      },
      {
        criterion: 'capacity',
        label: 'Organizational Capacity & Governance',
        weight: 20,
        score: 92,
        rationale: 'Staff bios [E5] and FY25 CPA Audit [E7] attached.',
        finding_ids: []
      },
      {
        criterion: 'budget',
        label: 'Budget Realism & Cost Efficiency',
        weight: 20,
        score: 94,
        rationale: 'Budget [E4] reconciled with 10% overhead cap.',
        finding_ids: []
      }
    ],
    initialMessages: [
      {
        id: 'msg-g-1',
        room: 'intake',
        sender_id: 'client',
        sender_name: 'Maya Lin',
        sender_badge: 'CLIENT',
        timestamp: '16:02',
        addressed_to: '@signoff-analyst',
        content: 'Uploaded RWRF-2026-Guidelines.pdf and evidence E1–E8. Please build the compliance matrix.',
        artifact_ref: 'verticals/grant/RWRF-2026-Guidelines.pdf'
      },
      {
        id: 'msg-g-2',
        room: 'intake',
        sender_id: 'analyst',
        sender_name: 'signoff-analyst',
        sender_badge: 'AGENT',
        timestamp: '16:02',
        addressed_to: '@Approver',
        content: 'Flagged REQ-ATT-2: Funder requires audited financials, but only E6 is attached. Attach sponsor audit E7?',
        artifact_ref: 'out/grant/compliance-matrix.csv'
      },
      {
        id: 'msg-g-3',
        room: 'intake',
        sender_id: 'approver',
        sender_name: 'You (Approver)',
        sender_badge: 'OWNER',
        timestamp: '16:03',
        addressed_to: '@signoff-analyst',
        content: 'Use the fiscal sponsor audit E7 and hand off to #grant-draft.',
        is_human_gate: true
      },
      {
        id: 'msg-g-4',
        room: 'draft',
        sender_id: 'drafter',
        sender_name: 'signoff-drafter',
        sender_badge: 'AGENT',
        timestamp: '16:04',
        addressed_to: '@Approver',
        content: 'Draft ready in out/grant/draft.md (6 sections within word limits). Ready for review.',
        artifact_ref: 'out/grant/draft.md'
      },
      {
        id: 'msg-g-5',
        room: 'draft',
        sender_id: 'reviewer',
        sender_name: 'signoff-reviewer',
        sender_badge: 'AGENT',
        timestamp: '16:04',
        addressed_to: '@Approver',
        content: 'Score: 78/100 (Hold). Caught 2 issues: uncited 1,240 outcome in Section 3 and unattached audit E7.',
        artifact_ref: 'out/grant/scorecard.md'
      }
    ],
    initialDecisionLog: [
      {
        id: 'dec-g-1',
        actor: 'signoff-analyst',
        role: 'Analyst',
        action: 'Extracted 8 requirements from RWRF-2026-Guidelines.pdf and flagged REQ-ATT-2 audit requirement.',
        timestamp: '2026-11-04 16:02:28 IST',
        room: '#grant-intake',
        artifact: 'out/grant/requirements.json'
      },
      {
        id: 'dec-g-2',
        actor: 'signoff-reviewer',
        role: 'Reviewer',
        action: 'Scored initial draft at 78/100; blocked sign-off on Rule 2 (uncited 1,240 metric) and Rule 5 (unattached E7 audit).',
        timestamp: '2026-11-04 16:04:30 IST',
        room: '#grant-draft',
        artifact: 'out/grant/scorecard.md'
      }
    ]
  },

  bid: {
    id: 'bid',
    number: '02',
    name: 'Bid Room',
    tag: 'REMIX · 20 SEC MONTAGE',
    demoRole: 'B2B Enterprise RFP & Security Questionnaire Engine',
    persona: 'Marcus Vance, Lead Solutions Architect',
    organization: 'Vanguard Cloud Telemetry Inc.',
    counterparty: 'Meridian Health Systems (40-Page Enterprise RFP)',
    sourceDocTitle: 'Meridian-RFP-2026-SecOps.pdf',
    sourceDocPages: 40,
    deadlineText: 'Due in 5 days · $480k ACV Contract',
    stakesText: 'Missing HIPAA BAA addendum or unverified SLA claims triggers procurement disqualification.',
    humanMomentSummary:
      'Analyst flags: "RFP Section 4 requires FedRAMP Moderate or signed HIPAA BAA + HITRUST readiness letter (E5)." Approver authorizes attaching E5 (Signed BAA & HITRUST Letter) and citing E4 on the 99.98% uptime metric.',
    humanDecisionPrompt: 'Attach signed HIPAA BAA & HITRUST letter [E5] for REQ-ATT-1 and cite [E4] on the 99.98% SLA claim. Issue Conditional Go.',
    intakeRoomName: 'bid-intake',
    draftRoomName: 'bid-draft',
    requirements: [
      {
        id: 'RFP-01',
        section: '1. Encryption & Zero-Trust Architecture',
        requirement: 'Detail TLS 1.3 in-transit and AES-256 KMS key rotation architecture for patient telemetry.',
        mandatory: true,
        source_page: 7,
        word_limit: 220,
        rubric_criterion: 'security',
        evidence_ids: ['E1', 'E2'],
        status: 'covered'
      },
      {
        id: 'RFP-02',
        section: '2. Identity, SSO & SCIM Provisioning',
        requirement: 'Support Okta/Entra ID SAML 2.0 SSO and automated SCIM 2.0 role revocation within 60 seconds.',
        mandatory: true,
        source_page: 14,
        word_limit: 200,
        rubric_criterion: 'architecture',
        evidence_ids: ['E3'],
        status: 'covered'
      },
      {
        id: 'RFP-03',
        section: '3. High Availability, DR & Historical SLA',
        requirement: 'Provide 24-month audited uptime percentage, RPO/RTO benchmarks, and multi-region failover proofs.',
        mandatory: true,
        source_page: 22,
        word_limit: 220,
        rubric_criterion: 'reliability',
        evidence_ids: ['E4'],
        status: 'covered'
      },
      {
        id: 'RFP-04',
        section: '4. Implementation Timeline & Dedicated TAM',
        requirement: 'Commit to a 30-day enterprise deployment schedule with named Technical Account Manager support.',
        mandatory: true,
        source_page: 31,
        word_limit: 200,
        rubric_criterion: 'delivery',
        evidence_ids: ['E6'],
        status: 'covered'
      },
      {
        id: 'RFP-ATT-1',
        section: 'Mandatory Exhibit C: Signed HIPAA BAA & HITRUST Letter',
        requirement: 'Countersigned Business Associate Agreement (BAA) and independent HITRUST CSF readiness attestation.',
        mandatory: true,
        source_page: 38,
        is_attachment: true,
        evidence_ids: ['E5'],
        status: 'missing_attachment',
        disqualifier_note: 'PROCUREMENT GATE: Exhibit C requires Legal-countersigned HIPAA BAA [E5] attached before submission.'
      }
    ],
    evidence: [
      {
        id: 'E1',
        type: 'certification',
        title: 'SOC 2 Type II Examination Report (2026)',
        path: 'verticals/bid/answer-library/E1_soc2_type2_2026.pdf',
        date: '2026-04-10',
        issuer: 'Deloitte & Touche LLP',
        attached: true,
        summary: 'Zero exceptions across Security, Availability, and Confidentiality trust principles.'
      },
      {
        id: 'E2',
        type: 'certification',
        title: 'ISO/IEC 27001:2022 Certificate',
        path: 'verticals/bid/answer-library/E2_iso27001_cert.pdf',
        date: '2026-01-22',
        issuer: 'BSI Assurance UK',
        attached: true,
        summary: 'Covers AES-256 customer-managed KMS encryption and hardware security modules.'
      },
      {
        id: 'E3',
        type: 'document',
        title: 'Enterprise Identity & SCIM 2.0 Whitepaper',
        path: 'verticals/bid/answer-library/E3_identity_scim_spec.pdf',
        date: '2026-05-19',
        issuer: 'Vanguard Security Engineering',
        attached: true,
        summary: 'Documents SAML 2.0 / OIDC federation and sub-15-second SCIM deprovisioning.'
      },
      {
        id: 'E4',
        type: 'spreadsheet',
        title: 'Audited StatusPage SLA Telemetry (2024–2026)',
        path: 'verticals/bid/answer-library/E4_sla_uptime_audit.csv',
        date: '2026-10-01',
        issuer: 'Vanguard SRE',
        attached: true,
        summary: '99.98% production availability across 24 months; RPO < 5 min, RTO < 15 min.'
      },
      {
        id: 'E5',
        type: 'letter',
        title: 'Countersigned HIPAA BAA & HITRUST e1 Attestation',
        path: 'verticals/bid/answer-library/E5_hipaa_baa_hitrust.pdf',
        date: '2026-10-28',
        issuer: 'Vanguard General Counsel & Coalfire',
        attached: false,
        summary: 'Standard HIPAA Business Associate Agreement countersigned by Legal with HITRUST e1 letter.'
      },
      {
        id: 'E6',
        type: 'case_study',
        title: '30-Day Healthcare Rollout Playbook & Case Study',
        path: 'verticals/bid/answer-library/E6_healthcare_deployment_case.pdf',
        date: '2026-07-12',
        issuer: 'Vanguard Professional Services',
        attached: true,
        summary: '28-day full deployment across 14 hospital campuses with dedicated Principal TAM.'
      }
    ],
    sections: [
      {
        id: 'bid-sec-1',
        req_id: 'RFP-01',
        title: '1. Encryption & Zero-Trust Architecture',
        word_limit: 220,
        rubric_criterion: 'security',
        content: `All Meridian Health telemetry is encrypted in transit via TLS 1.3 and at rest using FIPS 140-3 validated AES-256 keys with automated 90-day rotation [E1, E2]. Customer-managed encryption keys (CMEK) allow Meridian security administrators to revoke access instantaneously [E2].`
      },
      {
        id: 'bid-sec-2',
        req_id: 'RFP-02',
        title: '2. Identity, SSO & SCIM Provisioning',
        word_limit: 200,
        rubric_criterion: 'architecture',
        content: `Vanguard natively integrates with Microsoft Entra ID and Okta via SAML 2.0 and OIDC, enforcing hardware MFA and RBAC [E3]. Automated SCIM 2.0 lifecycle webhooks propagate user deprovisioning in under 15 seconds across all regional clusters [E3].`
      },
      {
        id: 'bid-sec-3',
        req_id: 'RFP-03',
        title: '3. High Availability, DR & Historical SLA',
        word_limit: 220,
        rubric_criterion: 'reliability',
        content: `Over the past 24 months, our multi-region active-active production clusters achieved 99.98% uptime across 45 enterprise clients.\n\nCross-region PostgreSQL and telemetry replication maintains a verified Recovery Point Objective (RPO) under 5 minutes and Recovery Time Objective (RTO) under 15 minutes [E4].`
      },
      {
        id: 'bid-sec-4',
        req_id: 'RFP-04',
        title: '4. Implementation Timeline & Dedicated TAM',
        word_limit: 200,
        rubric_criterion: 'delivery',
        content: `Our healthcare deployment team executes a proven 28-day onboarding playbook led by a named Principal Technical Account Manager [E6]. Phase 1 sandbox integration completes by Day 10, followed by production cutover by Day 28 [E6].`
      }
    ],
    rubricInitial: [
      {
        criterion: 'security',
        label: 'Security & Compliance Controls',
        weight: 35,
        score: 72,
        rationale: 'HOLD: Exhibit C HIPAA BAA & HITRUST letter [E5] is not attached yet (Rule 5).',
        finding_ids: ['RULE-5']
      },
      {
        criterion: 'architecture',
        label: 'Identity & Technical Architecture',
        weight: 25,
        score: 94,
        rationale: 'SAML 2.0 and sub-15s SCIM deprovisioning verified via [E3].',
        finding_ids: []
      },
      {
        criterion: 'reliability',
        label: 'SLA, Resilience & Disaster Recovery',
        weight: 25,
        score: 68,
        rationale: 'HOLD: 99.98% uptime claim in Section 3 is missing its [E4] citation on line 10 (Rule 2).',
        finding_ids: ['RULE-2']
      },
      {
        criterion: 'delivery',
        label: 'Implementation Speed & Support',
        weight: 15,
        score: 92,
        rationale: '28-day hospital rollout playbook cited to [E6].',
        finding_ids: []
      }
    ],
    rubricFixed: [
      {
        criterion: 'security',
        label: 'Security & Compliance Controls',
        weight: 35,
        score: 96,
        rationale: 'SOC 2 Type II [E1], ISO 27001 [E2], and countersigned HIPAA BAA [E5] verified.',
        finding_ids: []
      },
      {
        criterion: 'architecture',
        label: 'Identity & Technical Architecture',
        weight: 25,
        score: 94,
        rationale: 'SAML 2.0 and SCIM 2.0 architecture verified via [E3].',
        finding_ids: []
      },
      {
        criterion: 'reliability',
        label: 'SLA, Resilience & Disaster Recovery',
        weight: 25,
        score: 95,
        rationale: '99.98% SLA and RPO/RTO metrics properly cited to audited telemetry [E4].',
        finding_ids: []
      },
      {
        criterion: 'delivery',
        label: 'Implementation Speed & Support',
        weight: 15,
        score: 92,
        rationale: '28-day deployment schedule verified via [E6].',
        finding_ids: []
      }
    ],
    initialMessages: [
      {
        id: 'msg-b-1',
        room: 'intake',
        sender_id: 'client',
        sender_name: 'Marcus Vance (Sales Engineer)',
        sender_badge: 'CLIENT · HUMAN',
        timestamp: '11:14:05',
        addressed_to: '@signoff-analyst',
        content: 'Dropped `Meridian-RFP-2026-SecOps.pdf` (40 pages) and our Answer Library `E1–E6`. Need the compliance matrix and Bid/No-Bid memo before Legal review at 2 PM.',
        artifact_ref: 'verticals/bid/Meridian-RFP-2026-SecOps.pdf'
      },
      {
        id: 'msg-b-2',
        room: 'intake',
        sender_id: 'analyst',
        sender_name: 'signoff-analyst',
        sender_badge: 'AGENT · ANYONE',
        timestamp: '11:14:29',
        addressed_to: '@Marcus Vance @Approver',
        content: 'Built RFP matrix (`out/bid/requirements.json`). **Conditional Go (61% Win Prob):** Exhibit C requires a countersigned HIPAA BAA + HITRUST letter (`E5`), currently unattached. Approver must authorize releasing `E5`.',
        artifact_ref: 'out/bid/compliance-matrix.csv'
      },
      {
        id: 'msg-b-3',
        room: 'draft',
        sender_id: 'reviewer',
        sender_name: 'signoff-reviewer',
        sender_badge: 'AGENT · OWNER-ONLY',
        timestamp: '11:16:10',
        addressed_to: '@Approver',
        content: 'Ran `signoff check --vertical bid`. Found 1 uncited SLA metric (`99.98% uptime` in Section 3 missing `[E4]`) and 1 unattached mandatory exhibit (`RFP-ATT-1` -> `E5`). Score: **79/100 (HOLD)**.',
        artifact_ref: 'out/bid/scorecard.md'
      }
    ],
    initialDecisionLog: [
      {
        id: 'dec-b-1',
        actor: 'signoff-analyst',
        role: 'Analyst',
        action: 'Generated Bid/No-Bid memo (Conditional Go) and flagged Exhibit C HIPAA BAA [E5].',
        timestamp: '2026-11-04 11:14:29 IST',
        room: '#bid-intake',
        artifact: 'out/bid/requirements.json'
      }
    ]
  },

  deal: {
    id: 'deal',
    number: '03',
    name: 'Deal Desk',
    tag: 'REMIX · 20 SEC MONTAGE',
    demoRole: 'Agency Client Brief → Scope, Quote & Deposit Invoice Engine',
    persona: 'Elena Rostova, Managing Partner',
    organization: 'Atelier North Digital Studio',
    counterparty: 'Solstice Mobility (Series B EV Charging Network)',
    sourceDocTitle: 'Solstice-Q1-Rebrand-Brief.md',
    sourceDocPages: 6,
    deadlineText: 'Kickoff Monday · $76,400 Fixed-Scope Quote',
    stakesText: 'Uncited rate-card hours or missing scope assumptions cause margin erosion.',
    humanMomentSummary:
      'Analyst maps client brief into 4 deliverables and runs `signoff price`. Reviewer catches an uncited $76,400 fee line in Section 3 and an unattached Master Services Agreement exhibit (E4). Approver signs off to generate the Quote & 40% Deposit Invoice.',
    humanDecisionPrompt: 'Attach Master Services Agreement rate schedule [E4] and cite [E1] on the $76,400 project total. Export Quote & 40% Deposit Invoice.',
    intakeRoomName: 'deal-intake',
    draftRoomName: 'deal-draft',
    requirements: [
      {
        id: 'DLV-01',
        section: '1. Brand Strategy & Design System Foundations',
        requirement: 'Deliver comprehensive design tokens, Figma component library, and telemetry dashboard UI kit.',
        mandatory: true,
        source_page: 2,
        word_limit: 200,
        rubric_criterion: 'scope',
        evidence_ids: ['E1', 'E2'],
        status: 'covered'
      },
      {
        id: 'DLV-02',
        section: '2. WebGL Station Locator & Marketing Web App',
        requirement: 'Build interactive Next.js + WebGL station map with real-time charger availability integration.',
        mandatory: true,
        source_page: 3,
        word_limit: 200,
        rubric_criterion: 'engineering',
        evidence_ids: ['E1', 'E3'],
        status: 'covered'
      },
      {
        id: 'DLV-03',
        section: '3. Commercial Pricing, Margin & Payment Schedule',
        requirement: 'Itemize hours by studio role from the 2026 Rate Card and specify the 40% kickoff deposit.',
        mandatory: true,
        source_page: 5,
        word_limit: 220,
        rubric_criterion: 'pricing',
        evidence_ids: ['E1'],
        status: 'covered'
      },
      {
        id: 'DLV-04',
        section: '4. Scope Assumptions & Revision Guardrails',
        requirement: 'Define two-round revision cap per milestone and change-order hourly billing governance.',
        mandatory: true,
        source_page: 6,
        word_limit: 180,
        rubric_criterion: 'governance',
        evidence_ids: ['E2', 'E4'],
        status: 'covered'
      },
      {
        id: 'DLV-ATT-1',
        section: 'Exhibit A: Countersigned MSA & Rate Schedule',
        requirement: 'Standard Master Services Agreement with 2026 Studio Rate Card attached.',
        mandatory: true,
        source_page: 6,
        is_attachment: true,
        evidence_ids: ['E4'],
        status: 'missing_attachment',
        disqualifier_note: 'DEAL DESK GATE: Finance requires MSA Exhibit A [E4] attached before issuing Deposit Invoice.'
      }
    ],
    evidence: [
      {
        id: 'E1',
        type: 'rate_card',
        title: 'Atelier North 2026 Studio Rate Card (CSV)',
        path: 'verticals/deal/rate-card.csv',
        date: '2026-01-05',
        issuer: 'Atelier North Finance',
        attached: true,
        summary: 'Design Director $220/hr, Senior Product Designer $185/hr, Lead Creative Technologist $210/hr, QA/PM $150/hr.'
      },
      {
        id: 'E2',
        type: 'case_study',
        title: 'Kinetix Mobility Design System Case Study',
        path: 'verticals/deal/evidence/E2_kinetix_benchmark.pdf',
        date: '2025-11-18',
        issuer: 'Atelier North Delivery',
        attached: true,
        summary: 'Completed 42-component automotive design system in 8 weeks with 54% gross studio margin.'
      },
      {
        id: 'E3',
        type: 'document',
        title: 'WebGL Map Architecture & Performance Benchmark',
        path: 'verticals/deal/evidence/E3_webgl_locator_spec.pdf',
        date: '2026-06-09',
        issuer: 'Atelier Engineering',
        attached: true,
        summary: '60fps cluster rendering for 15,000 charging ports on desktop and mobile Safari.'
      },
      {
        id: 'E4',
        type: 'letter',
        title: 'Standard Master Services Agreement (MSA) & SOW Terms',
        path: 'verticals/deal/evidence/E4_studio_msa_2026.pdf',
        date: '2026-02-01',
        issuer: 'Atelier North Legal',
        attached: false,
        summary: 'Includes IP transfer upon final payment, 2-round revision limit, and 40/30/30 milestone billing.'
      }
    ],
    rateCard: [
      {
        id: 'RC-1',
        role: 'Design Director',
        deliverable: 'Brand Architecture & Art Direction',
        hours: 60,
        hourly_rate: 220,
        cost_rate: 95,
        evidence_id: 'E1'
      },
      {
        id: 'RC-2',
        role: 'Senior Product Designer',
        deliverable: 'Figma Token System & 38 UI Components',
        hours: 140,
        hourly_rate: 185,
        cost_rate: 82,
        evidence_id: 'E1'
      },
      {
        id: 'RC-3',
        role: 'Lead Creative Technologist',
        deliverable: 'Next.js Marketing Site + WebGL Charger Map',
        hours: 140,
        hourly_rate: 210,
        cost_rate: 92,
        evidence_id: 'E1'
      },
      {
        id: 'RC-4',
        role: 'Technical Producer & QA',
        deliverable: 'Sprint Governance, Accessibility & Cross-Browser QA',
        hours: 52,
        hourly_rate: 152,
        cost_rate: 68,
        evidence_id: 'E1'
      }
    ],
    sections: [
      {
        id: 'deal-sec-1',
        req_id: 'DLV-01',
        title: '1. Brand Strategy & Design System Foundations',
        word_limit: 200,
        rubric_criterion: 'scope',
        content: `Atelier North will deliver a unified visual identity and multi-brand Figma token architecture comprising 38 production components and charger telemetry widgets over an 8-week schedule [E1, E2].`
      },
      {
        id: 'deal-sec-2',
        req_id: 'DLV-02',
        title: '2. WebGL Station Locator & Marketing Web App',
        word_limit: 200,
        rubric_criterion: 'engineering',
        content: `Our engineering team will build a responsive Next.js marketing platform featuring a hardware-accelerated WebGL station locator capable of rendering 15,000 live charging ports at 60fps [E3].`
      },
      {
        id: 'deal-sec-3',
        req_id: 'DLV-03',
        title: '3. Commercial Pricing, Margin & Payment Schedule',
        word_limit: 220,
        rubric_criterion: 'pricing',
        content: `Based on 392 scoped studio hours across four specialist roles, the total fixed-fee investment is $76,404 with a 40% kickoff deposit due upon signing.\n\nMilestone 2 (30%) bills at Design System sign-off in Week 4, and Milestone 3 (30%) bills upon production launch in Week 8 [E1].`
      },
      {
        id: 'deal-sec-4',
        req_id: 'DLV-04',
        title: '4. Scope Assumptions & Revision Guardrails',
        word_limit: 180,
        rubric_criterion: 'governance',
        content: `Each deliverable includes two structured rounds of consolidated client feedback [E2]. Additional scope requests or third-party OCPP hardware API modifications are billed at standard 2026 rate-card rates [E1].`
      }
    ],
    rubricInitial: [
      {
        criterion: 'scope',
        label: 'Deliverable Clarity & Design Scope',
        weight: 30,
        score: 92,
        rationale: '38-component Figma library and 8-week benchmark cited to [E1, E2].',
        finding_ids: []
      },
      {
        criterion: 'engineering',
        label: 'Technical Architecture & Feasibility',
        weight: 25,
        score: 94,
        rationale: '15,000-port WebGL performance spec cited to [E3].',
        finding_ids: []
      },
      {
        criterion: 'pricing',
        label: 'Rate Card Accuracy & Margin Target',
        weight: 25,
        score: 65,
        rationale: 'HOLD: Section 3 states "$76,404 with a 40% kickoff deposit" without an [E1] citation on line 9 (Rule 2).',
        finding_ids: ['RULE-2']
      },
      {
        criterion: 'governance',
        label: 'MSA Terms & Revision Protection',
        weight: 20,
        score: 62,
        rationale: 'HOLD: Exhibit A Master Services Agreement [E4] is unattached (Rule 5).',
        finding_ids: ['RULE-5']
      }
    ],
    rubricFixed: [
      {
        criterion: 'scope',
        label: 'Deliverable Clarity & Design Scope',
        weight: 30,
        score: 95,
        rationale: 'Deliverables and component counts verified against [E1, E2].',
        finding_ids: []
      },
      {
        criterion: 'engineering',
        label: 'Technical Architecture & Feasibility',
        weight: 25,
        score: 94,
        rationale: 'WebGL performance benchmark cited to [E3].',
        finding_ids: []
      },
      {
        criterion: 'pricing',
        label: 'Rate Card Accuracy & Margin Target',
        weight: 25,
        score: 96,
        rationale: '392 hours ($76,404 total, 56% gross studio margin) cited to 2026 Rate Card [E1].',
        finding_ids: []
      },
      {
        criterion: 'governance',
        label: 'MSA Terms & Revision Protection',
        weight: 20,
        score: 94,
        rationale: 'MSA Exhibit A [E4] attached with 2-round revision cap and 40% kickoff invoice.',
        finding_ids: []
      }
    ],
    initialMessages: [
      {
        id: 'msg-d-1',
        room: 'intake',
        sender_id: 'client',
        sender_name: 'Elena Rostova (Partner)',
        sender_badge: 'CLIENT · HUMAN',
        timestamp: '14:20:10',
        addressed_to: '@signoff-analyst',
        content: 'Uploaded `Solstice-Q1-Rebrand-Brief.md` and `rate-card.csv` (`E1`). Need scope deliverables matrix, margin check, and kickoff deposit invoice.',
        artifact_ref: 'verticals/deal/Solstice-Q1-Rebrand-Brief.md'
      },
      {
        id: 'msg-d-2',
        room: 'intake',
        sender_id: 'analyst',
        sender_name: 'signoff-analyst',
        sender_badge: 'AGENT · ANYONE',
        timestamp: '14:20:35',
        addressed_to: '@Elena Rostova @Approver',
        content: 'Ran `signoff matrix` and `signoff price`. Scoped 392 hours = **$76,404 fee** (**56% studio margin**, **$30,562 kickoff deposit**). Flagged missing attachment `DLV-ATT-1` (`E4` Studio MSA).',
        artifact_ref: 'out/deal/quote-invoice.md'
      },
      {
        id: 'msg-d-3',
        room: 'draft',
        sender_id: 'reviewer',
        sender_name: 'signoff-reviewer',
        sender_badge: 'AGENT · OWNER-ONLY',
        timestamp: '14:22:04',
        addressed_to: '@Approver',
        content: 'Ran `signoff check --vertical deal`. Caught uncited `$76,404` fee claim on line 9 of `draft.md` and unattached MSA `E4`. Score: **80/100 (HOLD)**.',
        artifact_ref: 'out/deal/scorecard.md'
      }
    ],
    initialDecisionLog: [
      {
        id: 'dec-d-1',
        actor: 'signoff-analyst',
        role: 'Analyst',
        action: 'Computed $76,404 quote (56% margin) from rate-card.csv and flagged missing MSA attachment [E4].',
        timestamp: '2026-11-04 14:20:35 IST',
        room: '#deal-intake',
        artifact: 'out/deal/quote-invoice.md'
      }
    ]
  }
};
