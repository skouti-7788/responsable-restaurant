import { describe, expect, it } from 'vitest'
import translations from './translations'

const requiredPlanKeys = [
  'planFeatureLocked',
  'upgradeLimitTitle',
  'upgradeLimitDescription',
  'upgradeFeatureTitle',
  'upgradeFeatureDescription',
  'appearanceUpgradeDescription',
  'upgradePlan',
  'planStatusUnavailable',
  'retry',
  'subscriptionCurrent',
  'subscriptionEndsAt',
  'subscriptionCancel',
  'subscriptionCancelConfirm',
  'subscriptionCancelSuccess',
  'subscriptionCancelError',
  'subscriptionCancelScheduled',
  'subscriptionCanceling',
  'subscriptionNoActive',
  'subscriptionSignIn',
  'subscriptionManage',
]

describe('plan and subscription translations', () => {
  it.each(['en', 'fr', 'ar'])('defines all plan and subscription messages in %s', (language) => {
    for (const key of requiredPlanKeys) {
      expect(translations[language][key], `${language} is missing translation: ${key}`)
        .toEqual(expect.any(String))
      expect(translations[language][key].trim()).not.toBe('')
    }
  })
})
