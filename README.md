## Project setup

```bash
pnpm install
```

## Prerequisites

Before running the project, make sure you have Node.js and pnpm installed.

Recommended installation methods:

- macOS (Homebrew):

```bash
brew update
brew install node
```

- macOS / Linux (nvm - Node Version Manager):

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
# Then either reopen your shell or source nvm and install the LTS release:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm install --lts
nvm use --lts
```

- Windows: use nvm-windows (https://github.com/coreybutler/nvm-windows) or install the official Node.js installer from https://nodejs.org/.

pnpm installation (two options):

- Prefer using Corepack (shipped with newer Node versions):

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

- Or install via npm (global):

```bash
npm install -g pnpm
```

After installing Node and pnpm, run the project setup:

```bash
pnpm install
```

## Compile and run the project

```bash
# development
pnpm dev
```

## Run tests

```bash
# unit tests
pnpm run test
```

Notes:
- Unit tests are located in `src/**.spec.ts` (Jest is configured with `rootDir: src`).
- To avoid concurrency issues in tests that start a local server, you can run: `pnpm test --runInBand`.