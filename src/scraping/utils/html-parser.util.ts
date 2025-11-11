import {
  SEARCH_ENGINE_HOSTNAME,
  SEARCH_ENGINE_RESULT_ITEM_CLASS,
} from '../../config';
import { SearchResultDto } from '../dto/scrape-response.dto';

export class HtmlParser {
  static extractResults(html: string): SearchResultDto[] {
    const results = this.extractFromResultBlocks(html);

    if (results.length > 0) {
      return results;
    }

    return this.extractFromHeaders(html);
  }

  private static extractFromResultBlocks(html: string): SearchResultDto[] {
    const results: SearchResultDto[] = [];

    // Monta regex dinamicamente com a classe de item configurada
    const className = SEARCH_ENGINE_RESULT_ITEM_CLASS.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    );
    const resultBlockRegex = new RegExp(
      `<li[^>]*class="[^"]*${className}[^"]*"[^>]*>([\\s\\S]*?)<\\/li>`,
      'gi',
    );

    let blockMatch: RegExpExecArray | null;
    while ((blockMatch = resultBlockRegex.exec(html)) !== null) {
      const block = blockMatch[1];
      const result = this.parseResultBlock(block);

      if (result) {
        results.push(result);
      }
    }

    return results;
  }

  private static parseResultBlock(block: string): SearchResultDto | null {
    const linkMatch =
      /<h2[^>]*>[\s\S]*?<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i.exec(
        block,
      );

    if (!linkMatch) {
      return null;
    }

    let url = this.cleanUrl(linkMatch[1]);
    const title = this.cleanText(linkMatch[2]);

    if (!url || this.isEngineRedirectUrl(url)) {
      const citeMatch = /<cite[^>]*>([\s\S]*?)<\/cite>/i.exec(block);
      if (citeMatch) {
        const citeUrl = this.cleanText(citeMatch[1]);
        if (citeUrl && !citeUrl.startsWith('http')) {
          url = 'https://' + citeUrl;
        } else if (citeUrl) {
          url = citeUrl;
        }
      }
    }

    if (!title || !url || !url.startsWith('http')) {
      return null;
    }

    return { title, url };
  }

  private static extractFromHeaders(html: string): SearchResultDto[] {
    const results: SearchResultDto[] = [];
    const h2Regex = /<h2[^>]*>[\s\S]*?<a[^>]+>([\s\S]*?)<\/a>/gi;
    let match: RegExpExecArray | null;
    while ((match = h2Regex.exec(html)) !== null) {
      const title = this.cleanText(match[1]);

      if (title) {
        results.push({ title, url: null });
      }
    }

    return results;
  }

  private static isEngineRedirectUrl(url: string): boolean {
    try {
      const u = new URL(url);
      const host = SEARCH_ENGINE_HOSTNAME.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&',
      );
      const hostRegex = new RegExp(`(^|\\.)${host}$`, 'i');
      return hostRegex.test(u.hostname);
    } catch {
      return false;
    }
  }

  private static cleanText(html: string): string {
    return html
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&#(\d+);/g, (_: string, code: string) =>
        String.fromCharCode(parseInt(code)),
      )
      .replace(/&#x([0-9a-fA-F]+);/g, (_: string, hex: string) =>
        String.fromCharCode(parseInt(hex, 16)),
      )
      .trim();
  }

  private static cleanUrl(url: string): string {
    url = url.trim();

    // Corrige apenas entidades HTML dentro da URL
    url = url
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");

    // Se for um redirecionamento do mecanismo de busca, tenta extrair o link real
    if (this.isEngineRedirectUrl(url)) {
      try {
        const urlObj = new URL(url);
        const possibleParams = ['u', 'url', 'q'];
        for (const param of possibleParams) {
          const paramValue = urlObj.searchParams.get(param);
          if (paramValue) {
            const decoded = decodeURIComponent(paramValue);
            // Retorna somente se for um link HTTP(s) válido
            if (/^https?:\/\//i.test(decoded)) {
              return decoded;
            }
          }
        }
      } catch {
        // ignora erros
      }
    }

    // Se a URL não começa com http, tenta normalizar
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    // Retorna a URL limpa, sem decodificações extras
    return url;
  }


  private static safeDecode(value: string): string {
    try {
      const decoded = decodeURIComponent(value);
      if (/^https?:\/\//i.test(decoded)) {
        return decoded;
      }
    } catch {
      // Ignora erros de decoding
    }

    return value
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");
  }

}
