## REMOVED Requirements

### Requirement: Party size for encounter difficulty
**Reason**: Party size is no longer a user-managed setting in the UI; metrics are displayed for fixed party sizes (3/4/5) in the title hover summary.
**Migration**: Remove party-size state/actions used for header editing and compute metrics from fixed values at render time.

### Requirement: Persistent client settings in localStorage
**Reason**: For the updated header metrics flow, no user setting is required to be persisted in `localStorage`.
**Migration**: Remove or stop using settings persistence for this scenario; stale keys MAY be ignored or cleaned up safely.
