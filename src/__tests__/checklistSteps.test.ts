import { CHECKLIST_STEPS, ChecklistStep } from '@/lib/checklistSteps'

describe('CHECKLIST_STEPS structure', () => {
  test('contains exactly 10 steps', () => {
    expect(CHECKLIST_STEPS).toHaveLength(10)
  })

  test('steps are numbered 1 through 10 in order', () => {
    CHECKLIST_STEPS.forEach((step, i) => {
      expect(step.n).toBe(i + 1)
    })
  })

  test('every step has required fields: n, icon, title, why, actions', () => {
    for (const step of CHECKLIST_STEPS) {
      expect(typeof step.n).toBe('number')
      expect(typeof step.icon).toBe('string')
      expect(step.icon.length).toBeGreaterThan(0)
      expect(typeof step.title).toBe('string')
      expect(step.title.length).toBeGreaterThan(0)
      expect(typeof step.why).toBe('string')
      expect(step.why.length).toBeGreaterThan(0)
      expect(Array.isArray(step.actions)).toBe(true)
      expect(step.actions.length).toBeGreaterThan(0)
    }
  })

  test('every action has a non-empty text field', () => {
    for (const step of CHECKLIST_STEPS) {
      for (const action of step.actions) {
        expect(typeof action.text).toBe('string')
        expect(action.text.length).toBeGreaterThan(0)
      }
    }
  })

  test('action hrefs, when present, are strings', () => {
    for (const step of CHECKLIST_STEPS) {
      for (const action of step.actions) {
        if (action.href !== undefined) {
          expect(typeof action.href).toBe('string')
        }
      }
    }
  })

  test('provider fields are valid when present', () => {
    for (const step of CHECKLIST_STEPS) {
      if (step.providers) {
        expect(Array.isArray(step.providers)).toBe(true)
        for (const p of step.providers) {
          expect(typeof p.name).toBe('string')
          expect(typeof p.cost).toBe('string')
          expect(typeof p.cover).toBe('string')
          expect(typeof p.bestFor).toBe('string')
          expect(typeof p.link).toBe('string')
        }
      }
    }
  })

  test('only the last step has isCompletion = true', () => {
    const completionSteps = CHECKLIST_STEPS.filter((s) => s.isCompletion)
    expect(completionSteps).toHaveLength(1)
    expect(completionSteps[0].n).toBe(10)
  })

  test('step 1 is insurance (first legal requirement)', () => {
    expect(CHECKLIST_STEPS[0].title).toMatch(/insurance/i)
  })

  test('step 2 is HMRC registration', () => {
    expect(CHECKLIST_STEPS[1].title).toMatch(/HMRC|self.employed/i)
  })

  test('step 3 is business bank account', () => {
    expect(CHECKLIST_STEPS[2].title).toMatch(/bank/i)
  })

  test('step 10 has at least one action referencing startup bundle', () => {
    const step10 = CHECKLIST_STEPS[9]
    const hasBundle = step10.actions.some((a) =>
      /bundle|promo/i.test(a.text)
    )
    expect(hasBundle).toBe(true)
  })

  test('steps with providers have at least 2 providers', () => {
    const withProviders = CHECKLIST_STEPS.filter((s) => s.providers)
    for (const step of withProviders) {
      expect(step.providers!.length).toBeGreaterThanOrEqual(2)
    }
  })

  test('tip field, when present, is a non-empty string', () => {
    for (const step of CHECKLIST_STEPS) {
      if (step.tip !== undefined) {
        expect(typeof step.tip).toBe('string')
        expect(step.tip.length).toBeGreaterThan(0)
      }
    }
  })

  test('subItems field, when present, is a non-empty array of strings', () => {
    for (const step of CHECKLIST_STEPS) {
      if (step.subItems !== undefined) {
        expect(Array.isArray(step.subItems)).toBe(true)
        expect(step.subItems.length).toBeGreaterThan(0)
        for (const item of step.subItems) {
          expect(typeof item).toBe('string')
        }
      }
    }
  })
})
