import { describe, it } from 'node:test';
import assert from 'node:assert';
import { calculateBMR, calculateTDEE, calculateTargets } from '../js/core/nutrition.js';

describe('nutrition', () => {
  it('calculates male BMR correctly', () => {
    // Example: 30y, 170cm, 75kg male
    const bmr = calculateBMR('male', 30, 170, 75);
    assert.ok(bmr > 1600 && bmr < 1800, `BMR ${bmr} out of expected range`);
  });

  it('calculates targets with deficit', () => {
    const targets = calculateTargets({
      sex: 'male', age: 30, height: 170, weight: 75, goalWeight: 70, activity: 1.375
    });
    assert.ok(targets.calories < targets.tdee);
    assert.ok(targets.proteinG > 100);
    assert.ok(targets.fatG > 40);
    assert.ok(targets.warnings.length === 0 || targets.calories >= targets.bmr);
  });
});
