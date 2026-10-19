# PR #6016 temporary UI validation scenario

Product source: cf581dc8d0834e344922cb1099bde1bb037b3892.
Baseline: c48eb7161e4ab545161d1f162d9b0dc8a563b92e.

Copy provider-presets.tsx and ui-page.mjs to
apps/desktop/scripts/fixtures/pr6016-validation/ in that checkout, install
from the frozen lockfile, and run:

```sh
pnpm ui:check --changed --theme all
pnpm ui:check --page pr6016-presets --case all --theme all --compare c48eb7161e4ab545161d1f162d9b0dc8a563b92e
```

The two untracked fixture files are the only worktree changes recorded by
worktreeDirty=true. Product source was unchanged. All three changed-run
overviews and the comparison overview were visually inspected.

Changed run: 14/14 passed; changed UI UNCOVERED=[]; no module replacement.
Comparison: four current variants pass; all four baseline variants stop at
the wheel-scroll check with scrollTop=0. Baseline checks stop there, so later
baseline interactions are not claimed as completed.

This is an Electron single-page production-component harness with a
read-only catalog IPC fixture. Full Desktop login, provider persistence,
network, physical trackpad and Windows are outside this run. Optional
appearance/lifecycle hostMissing entries are retained in the summaries.

Screenshots were generated unchanged by ui:check:publish --dry-run and the
exact generated Git objects were transported to this fork through the
authenticated GitHub plugin and a one-time fork Actions workflow.

These orphan-history evidence branches are not for merging into the project.

## Final merge verification

The upstream branch advanced during publication. Final product head:
`e5933d59798f89118cfe2246c242d73e946bd69c`, based on
`cb1002069c5bd75aab0ee0839693b4b52fba82ba`.
Only the generated design-inventory conflict was resolved; the two production
components, regression test, frozen lockfile and temporary UI scenario are
byte-identical to the earlier validated head. The current `--changed --theme all`
run again passed 14/14, UNCOVERED=[], and is retained in final-summary.json.
The final run's overviews were inspected (two are byte-identical to the earlier
images); all screenshots remain unedited. The comparison summary still refers
explicitly to the earlier head and baseline; it is not relabeled as a new run.
78 related tests, desktop typecheck, design-inventory and DCO also passed at
the final head. This does not claim full Desktop or Windows validation.
