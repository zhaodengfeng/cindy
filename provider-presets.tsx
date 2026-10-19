import { BUNDLED_CATALOG } from '@cindy/model-providers';
import { ProviderConnectionDialog } from '../../../src/renderer/components/settings/ProviderConnectionDialog';
import { forbid, mountPage } from '../../ui-page/harness';

void mountPage({
  host: {
    maker: { listProviderPresets: async () => ({ presets: BUNDLED_CATALOG.presets }) },
  },
  render: () => (
    <ProviderConnectionDialog
      existingIds={[]}
      onSaved={forbid('save provider')}
      onClose={forbid('close parent dialog')}
    />
  ),
});
