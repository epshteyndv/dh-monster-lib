## Requirements

### Requirement: Node.js 24 in GitHub Actions

The continuous integration workflow that installs Node.js for this repository SHALL use **Node.js 24** (for example via `actions/setup-node` with `node-version` set to `"24"` or an equivalent that resolves to the Node 24 release line).

#### Scenario: Workflow installs Node 24

- **WHEN** the Pages deploy workflow runs on a push to a configured branch
- **THEN** the job step that configures Node SHALL select the Node.js 24.x line for `npm ci` and `npm run build`.

### Requirement: Declared Node version for contributors

The repository SHALL declare the expected Node.js major version for local development so it matches CI. This MUST include at least one of: a root **`.nvmrc`** file containing `24`, or **`engines.node`** in `package.json` constraining Node to version 24 or compatible. The **README** SHALL state that contributors SHOULD use Node.js 24.

#### Scenario: Contributor reads version hints

- **WHEN** a developer opens the repository root or README before running npm scripts
- **THEN** they MUST be able to see that Node.js 24 is the supported line for this project.

### Requirement: Build succeeds on Node 24

After the toolchain update, the standard build command (`npm run build` or the documented equivalent) SHALL complete successfully when run with Node.js 24 in a clean install (`npm ci`).

#### Scenario: Clean CI build

- **WHEN** dependencies are installed with `npm ci` using Node 24 and the project build script runs
- **THEN** the build SHALL exit with success without engine or runtime errors attributable to the Node version change.
