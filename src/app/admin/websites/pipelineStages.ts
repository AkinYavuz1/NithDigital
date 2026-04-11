export interface ChecklistItem {
  id: string
  label: string
  automated: boolean
  automation_trigger?: string
  client_action?: boolean
}

export interface PipelineStage {
  index: number
  key: string
  label: string
  icon: string
  estimatedDays: number
  color: string
  defaultChecklist: ChecklistItem[]
}

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    index: 1,
    key: 'discovery',
    label: 'Discovery',
    icon: 'Search',
    estimatedDays: 2,
    color: '#6366f1',
    defaultChecklist: [
      { id: 'd1', label: 'Send discovery questionnaire to client', automated: false, client_action: false },
      { id: 'd2', label: 'Client returns completed questionnaire', automated: false, client_action: true },
      { id: 'd3', label: 'Discovery call scheduled', automated: false, client_action: false },
      { id: 'd4', label: 'Discovery call completed', automated: false, client_action: false },
      { id: 'd5', label: 'Competitor analysis done', automated: false, client_action: false },
    ],
  },
  {
    index: 2,
    key: 'proposal',
    label: 'Proposal',
    icon: 'FileSignature',
    estimatedDays: 2,
    color: '#8b5cf6',
    defaultChecklist: [
      { id: 'p1', label: 'Proposal created in system', automated: false },
      { id: 'p2', label: 'Proposal sent to client', automated: false },
      { id: 'p3', label: 'Proposal accepted by client', automated: false, client_action: true },
      { id: 'p4', label: 'Deposit invoice sent', automated: false },
      { id: 'p5', label: 'Deposit payment received', automated: false, client_action: true },
    ],
  },
  {
    index: 3,
    key: 'briefing',
    label: 'Briefing',
    icon: 'ClipboardList',
    estimatedDays: 2,
    color: '#a78bfa',
    defaultChecklist: [
      { id: 'b1', label: 'Project brief documented', automated: false },
      { id: 'b2', label: 'Scope of work signed off', automated: false, client_action: true },
      { id: 'b3', label: 'Tech stack decided', automated: false },
      { id: 'b4', label: 'Sitemap created', automated: false },
      { id: 'b5', label: 'Kickoff date confirmed', automated: false },
    ],
  },
  {
    index: 4,
    key: 'design',
    label: 'Design',
    icon: 'Figma',
    estimatedDays: 7,
    color: '#ec4899',
    defaultChecklist: [
      { id: 'dsg1', label: 'Wireframes created (v0.dev / Figma)', automated: true, automation_trigger: 'v0_generation' },
      { id: 'dsg2', label: 'Desktop mockups complete', automated: false },
      { id: 'dsg3', label: 'Mobile mockups complete', automated: false },
      { id: 'dsg4', label: 'Design sent to client for review', automated: false },
      { id: 'dsg5', label: 'Client design approval received', automated: false, client_action: true },
    ],
  },
  {
    index: 5,
    key: 'content',
    label: 'Content',
    icon: 'Type',
    estimatedDays: 5,
    color: '#f59e0b',
    defaultChecklist: [
      { id: 'c1', label: 'Content request sent to client', automated: false },
      { id: 'c2', label: 'Page copy received', automated: false, client_action: true },
      { id: 'c3', label: 'Images and assets received', automated: false, client_action: true },
      { id: 'c4', label: 'AI copy drafted for missing sections', automated: true, automation_trigger: 'claude_api' },
      { id: 'c5', label: 'Content reviewed and formatted', automated: false },
    ],
  },
  {
    index: 6,
    key: 'setup',
    label: 'Project Setup',
    icon: 'Server',
    estimatedDays: 1,
    color: '#14b8a6',
    defaultChecklist: [
      { id: 's1', label: 'GitHub repo created', automated: true, automation_trigger: 'github_api' },
      { id: 's2', label: 'Next.js project scaffolded', automated: true, automation_trigger: 'cli_scaffold' },
      { id: 's3', label: 'Vercel project linked', automated: true, automation_trigger: 'vercel_import' },
      { id: 's4', label: 'Staging URL live', automated: true, automation_trigger: 'vercel_preview' },
      { id: 's5', label: 'Domain registered / transferred', automated: false },
      { id: 's6', label: 'Environment variables set', automated: false },
    ],
  },
  {
    index: 7,
    key: 'development',
    label: 'Development',
    icon: 'Code2',
    estimatedDays: 10,
    color: '#3b82f6',
    defaultChecklist: [
      { id: 'dev1', label: 'Design system / globals set up', automated: false },
      { id: 'dev2', label: 'All pages built', automated: false },
      { id: 'dev3', label: 'Navigation and routing complete', automated: false },
      { id: 'dev4', label: 'Forms wired up', automated: false },
      { id: 'dev5', label: 'CMS integrated', automated: false },
      { id: 'dev6', label: 'Analytics installed', automated: true, automation_trigger: 'vercel_analytics' },
      { id: 'dev7', label: 'Third-party integrations working', automated: false },
    ],
  },
  {
    index: 8,
    key: 'seo',
    label: 'SEO & Copy',
    icon: 'Search',
    estimatedDays: 2,
    color: '#10b981',
    defaultChecklist: [
      { id: 'seo1', label: 'Meta titles and descriptions set', automated: true, automation_trigger: 'claude_api' },
      { id: 'seo2', label: 'OG images generated', automated: true, automation_trigger: 'next_og' },
      { id: 'seo3', label: 'Sitemap.xml created', automated: true, automation_trigger: 'next_sitemap' },
      { id: 'seo4', label: 'JSON-LD schema markup added', automated: true, automation_trigger: 'claude_api' },
      { id: 'seo5', label: 'Alt text on all images', automated: true, automation_trigger: 'ai_alt_text' },
      { id: 'seo6', label: 'robots.txt configured', automated: true, automation_trigger: 'next_robots' },
    ],
  },
  {
    index: 9,
    key: 'internal_review',
    label: 'Internal QA',
    icon: 'Eye',
    estimatedDays: 2,
    color: '#f97316',
    defaultChecklist: [
      { id: 'qa1', label: 'Full desktop QA pass', automated: false },
      { id: 'qa2', label: 'Mobile QA pass', automated: false },
      { id: 'qa3', label: 'Lighthouse audit run (score >90)', automated: true, automation_trigger: 'lighthouse_ci' },
      { id: 'qa4', label: 'Accessibility check (WCAG 2.2)', automated: true, automation_trigger: 'axe_audit' },
      { id: 'qa5', label: 'Cross-browser check', automated: false },
      { id: 'qa6', label: 'Forms and CTAs tested', automated: false },
    ],
  },
  {
    index: 10,
    key: 'client_review',
    label: 'Client Review',
    icon: 'MessageSquare',
    estimatedDays: 5,
    color: '#d4a84b',
    defaultChecklist: [
      { id: 'cr1', label: 'Staging link sent to client', automated: false },
      { id: 'cr2', label: 'Revision requests received', automated: false, client_action: true },
      { id: 'cr3', label: 'Revisions implemented', automated: false },
      { id: 'cr4', label: 'Final sign-off received', automated: false, client_action: true },
    ],
  },
  {
    index: 11,
    key: 'launch_prep',
    label: 'Launch Prep',
    icon: 'Rocket',
    estimatedDays: 1,
    color: '#ef4444',
    defaultChecklist: [
      { id: 'lp1', label: 'DNS records prepared', automated: false },
      { id: 'lp2', label: 'SSL certificate ready', automated: true, automation_trigger: 'vercel_ssl' },
      { id: 'lp3', label: 'Client given CMS / admin access', automated: false },
      { id: 'lp4', label: 'Handover document prepared', automated: false },
      { id: 'lp5', label: 'Final invoice sent', automated: false },
    ],
  },
  {
    index: 12,
    key: 'deployment',
    label: 'Deployment',
    icon: 'CloudUpload',
    estimatedDays: 1,
    color: '#1B2A4A',
    defaultChecklist: [
      { id: 'dep1', label: 'Production deploy triggered', automated: true, automation_trigger: 'git_push_main' },
      { id: 'dep2', label: 'Custom domain assigned in Vercel', automated: false },
      { id: 'dep3', label: 'DNS pointed and propagated', automated: false },
      { id: 'dep4', label: 'Live site smoke test', automated: false },
      { id: 'dep5', label: 'Error monitoring active (Sentry)', automated: true, automation_trigger: 'sentry_setup' },
    ],
  },
  {
    index: 13,
    key: 'post_launch',
    label: 'Post-Launch',
    icon: 'CheckCircle2',
    estimatedDays: 3,
    color: '#22c55e',
    defaultChecklist: [
      { id: 'pl1', label: 'Google Search Console submitted', automated: false },
      { id: 'pl2', label: 'Analytics verified live', automated: false },
      { id: 'pl3', label: 'Testimonial request sent', automated: false },
      { id: 'pl4', label: 'Referral email sent', automated: false },
      { id: 'pl5', label: 'Maintenance plan agreed', automated: false },
      { id: 'pl6', label: 'Project marked complete', automated: false },
    ],
  },
]

export const TOTAL_ESTIMATED_DAYS = PIPELINE_STAGES.reduce((sum, s) => sum + s.estimatedDays, 0)
