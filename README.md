## Configuração do Projeto

```bash
pnpm install
```

## Pré-requisitos

Antes de executar o projeto, certifique-se de que você tenha o Node.js e o pnpm instalados.

Métodos de instalação recomendados:

- macOS (Homebrew):

```bash
brew update
brew install node
```

- macOS / Linux (nvm - Node Version Manager):

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.4/install.sh | bash
# Em seguida, ou reinicie seu shell ou carregue o nvm e instale a versão LTS:
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \.
"$NVM_DIR/nvm.sh"
nvm install --lts
nvm use --lts
```

- Windows: use nvm-windows (https://github.com/coreybutler/nvm-windows) ou instale o instalador oficial do Node.js em https://nodejs.org/.

Instalação do pnpm (duas opções):

- Prefira usar o Corepack (embarcado com versões mais novas do Node):

```bash
corepack enable
corepack prepare pnpm@latest --activate
```

- Ou instale via npm (global):

```bash
npm install -g pnpm
```

Após instalar o Node e o pnpm, execute a configuração do projeto:

```bash
pnpm install
```

## Compilar e executar o projeto

```bash
# desenvolvimento
pnpm dev
```

## Executar testes

```bash
# testes unitários
pnpm run test
```

Notas:
- Os testes unitários estão localizados em `src/**.spec.ts` (Jest está configurado com `rootDir: src`).
- Para evitar problemas de concorrência em testes que iniciam um servidor local, você pode executar: `pnpm test --runInBand`.

## Clonando o repositório

Para começar, clone este repositório:

```bash
git clone https://github.com/KenzoUMZ/bing_scraping_api.git
```

## Acesso ao Swagger

Ao rodar o backend, o Swagger fica exposto e pode ser acessado através da URL: `http://0.0.0.0:8080/api`. Isso permite visualizar e interagir com a API de forma mais fácil e intuitiva.