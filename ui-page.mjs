import assert from 'node:assert/strict';

// Temporary acceptance scenario for PR #6016; product modules are never stubbed.
export default {
  name: 'pr6016-presets',
  entry: './provider-presets.tsx',
  viewport: { width: 900, height: 700 },
  real: 'ProviderConnectionDialog, shared Popover/Radix Dialog, production styles, fonts, themes and bundled preset catalog',
  notCovered: 'Provider saving, credentials, network requests, full Desktop, physical trackpad and Windows OS; only the read-only catalog IPC is supplied as fixture data',
  cases: {
    default: { about: 'Preset menu: wheel, final option selection and Escape focus return' },
    short: {
      about: '420px viewport: the same menu stays inside the window and remains scrollable',
      viewport: { width: 900, height: 420 },
    },
  },
  async ready(page) {
    const name = await page.evaluate(() => window.__uiPage.t('settings.providers.custom.fields.namePlaceholder'));
    await page.getByPlaceholder(name, { exact: true }).waitFor();
    const label = await page.evaluate(() => window.__uiPage.t('settings.providers.custom.presets.label'));
    await page.getByRole('button', { name: label, exact: true }).click();
    await page.getByRole('listbox', { name: label }).waitFor();
  },
  async check(page, ui) {
    const label = await ui.t('settings.providers.custom.presets.label');
    const trigger = page.getByRole('button', { name: label, exact: true });
    const list = page.getByRole('listbox', { name: label });
    const menu = list.locator('..');
    const geometry = await menu.evaluate((el) => ({
      height: el.clientHeight,
      scrollHeight: el.scrollHeight,
      bottom: el.getBoundingClientRect().bottom,
    }));
    assert.ok(geometry.scrollHeight > geometry.height, 'the real preset catalog overflows');
    const box = await menu.boundingBox();
    await page.mouse.move(box.x + box.width / 2, Math.min(box.y + box.height / 2, ui.viewport.height - 20));
    await page.mouse.wheel(0, 600);
    // Browser event/scroll settling; this scenario runs in the UI tier, not unit.
    await page.waitForTimeout(250);
    await ui.capture('after-wheel');
    const scrollTop = await menu.evaluate((el) => el.scrollTop);
    assert.ok(scrollTop > 0, `wheel must scroll the menu (actual scrollTop=${scrollTop})`);
    assert.ok(geometry.bottom <= ui.viewport.height, `menu bottom ${geometry.bottom} must fit viewport`);
    await page.keyboard.press('Escape');
    await list.waitFor({ state: 'hidden' });
    assert.ok(await trigger.evaluate((el) => document.activeElement === el), 'Escape returns focus to trigger');
    await trigger.click();
    await list.waitFor();
    const last = list.getByRole('option').last();
    await last.scrollIntoViewIfNeeded();
    await ui.capture('last-option');
    const selected = (await last.textContent()).trim();
    await last.click();
    await list.waitFor({ state: 'hidden' });
    assert.equal((await trigger.textContent()).trim(), selected, 'last option can be selected');
  },
};
