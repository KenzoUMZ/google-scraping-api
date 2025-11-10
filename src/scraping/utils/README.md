# Scraping Utils

Utilitários modulares para scraping de resultados de busca.

## Estrutura

```
utils/
├── index.ts                      # Barrel export
├── http-client.util.ts           # Cliente HTTP com suporte a redirects e compressão
├── captcha-detector.util.ts      # Detector de CAPTCHA/bloqueios
├── bing-html-parser.util.ts      # Parser especializado para Bing
└── search-url-builder.util.ts    # Construtor de URLs de busca
```

## HttpClient

Responsável por fazer requisições HTTP/HTTPS com:
- ✅ Suporte a redirects automáticos (até 5)
- ✅ Descompressão automática (gzip, deflate, brotli)
- ✅ Headers otimizados para evitar detecção de bot
- ✅ Timeout configurável (15s padrão)

**Uso:**
```typescript
const html = await HttpClient.fetchHtml('https://www.bing.com/search?q=test');
```

## CaptchaDetector

Detecta páginas de CAPTCHA ou bloqueios através de:
- Lista de indicadores comuns (captcha, verify, etc.)
- Análise case-insensitive do HTML
- Validação de tamanho mínimo da página

**Uso:**
```typescript
const hasCaptcha = CaptchaDetector.detect(html);
if (hasCaptcha) {
  // Tratar CAPTCHA
}
```

## BingHtmlParser

Parser especializado para extrair resultados do Bing:
- Extração de blocos `<li class="b_algo">`
- Parse de títulos e URLs
- Limpeza automática de HTML e texto
- Fallback para métodos alternativos

**Uso:**
```typescript
const results = BingHtmlParser.extractResults(html);
// [{ title: '...', url: '...' }, ...]
```

## SearchUrlBuilder

Constrói URLs de busca formatadas para diferentes motores:
- ✅ Bing (implementado)
- ⏳ Google (preparado)
- ⏳ DuckDuckGo (preparado)

**Uso:**
```typescript
const url = SearchUrlBuilder.buildBingUrl('typescript', 10);
// https://www.bing.com/search?q=typescript&count=10
```

## Vantagens da Modularização

1. **Separação de Responsabilidades**: Cada utilitário tem uma função específica
2. **Testabilidade**: Fácil criar testes unitários para cada componente
3. **Manutenibilidade**: Mudanças isoladas não afetam outros módulos
4. **Reusabilidade**: Utilitários podem ser usados em outros contextos
5. **Extensibilidade**: Fácil adicionar suporte a novos motores de busca
6. **Legibilidade**: Código da service fica limpo e focado na orquestração

## Fluxo de Execução

```
ScrapingService.scrapeBingResults()
    │
    ├─> SearchUrlBuilder.buildBingUrl()      // 1. Constrói URL
    │
    ├─> HttpClient.fetchHtml()               // 2. Faz request HTTP
    │
    ├─> CaptchaDetector.detect()             // 3. Verifica CAPTCHA
    │
    └─> BingHtmlParser.extractResults()      // 4. Extrai resultados
```

## Adicionando Novo Motor de Busca

Para adicionar suporte a um novo motor (ex: Google):

1. Adicionar método em `SearchUrlBuilder`:
```typescript
static buildGoogleUrl(searchTerm: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
}
```

2. Criar parser específico:
```typescript
// google-html-parser.util.ts
export class GoogleHtmlParser {
  static extractResults(html: string): GoogleResultDto[] {
    // Implementar lógica específica do Google
  }
}
```

3. Adicionar método na service:
```typescript
async scrapeGoogleResults(dto: ScrapeRequestDto) {
  const url = SearchUrlBuilder.buildGoogleUrl(dto.searchTerm);
  const html = await HttpClient.fetchHtml(url);
  if (CaptchaDetector.detect(html)) return this.createCaptchaResponse();
  return GoogleHtmlParser.extractResults(html);
}
```
