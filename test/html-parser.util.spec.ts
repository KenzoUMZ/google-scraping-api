import { HtmlParser } from '../src/scraping/utils/html-parser.util';

describe('HtmlParser', () => {
  it('should extract results from result blocks', () => {
    const html = `
      <ul>
        <li class="b_algo">
          <h2><a href="https://docs.nestjs.com/">NestJS Docs</a></h2>
          <cite>docs.nestjs.com</cite>
        </li>
        <li class="b_algo">
          <h2><a href="https://github.com/nestjs/nest">NestJS GitHub</a></h2>
        </li>
      </ul>
    `;
    const results = HtmlParser.extractResults(html);
    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({
      title: 'NestJS Docs',
      url: 'https://docs.nestjs.com/',
    });
    expect(results[1]).toEqual({
      title: 'NestJS GitHub',
      url: 'https://github.com/nestjs/nest',
    });
  });

  it('should fallback to headers when no result blocks', () => {
    const html = `
      <div>
        <h2><a href="#">Only Title 1</a></h2>
        <h2><a href="#">Only Title 2</a></h2>
      </div>
    `;
    const results = HtmlParser.extractResults(html);
    expect(results).toEqual([
      { title: 'Only Title 1', url: null },
      { title: 'Only Title 2', url: null },
    ]);
  });

  it('should decode redirect url parameters', () => {
    // Using a fake bing redirect style URL with 'url' param
    const html = `
      <li class="b_algo">
        <h2><a href="https://www.bing.com/aclick?url=https%3A%2F%2Fexample.com%2Farticle">Example Article</a></h2>
      </li>
    `;
    const results = HtmlParser.extractResults(html);
    expect(results[0].url).toBe('https://example.com/article');
  });

  it('should handle cite tag with domain correctly', () => {
    const html = `
      <li class="b_algo">
        <h2><a href="https://www.bing.com/ck/a?url=...">Article Title</a></h2>
        <cite>emmaringa.com.br</cite>
      </li>
    `;
    const results = HtmlParser.extractResults(html);
    expect(results[0].url).toBe('https://emmaringa.com.br');
    expect(results[0].url).not.toContain('%20');
    expect(results[0].url).not.toContain('xn--');
  });

  it('should handle cite tag with path and special characters', () => {
    const html = `
      <li class="b_algo">
        <h2><a href="https://www.bing.com/ck/a?url=...">Article Title</a></h2>
        <cite>emmaringa.com.br › curiosidades-sobre-a-cidade-de-maringa</cite>
      </li>
    `;
    const results = HtmlParser.extractResults(html);
    expect(results[0].url).toBe('https://emmaringa.com.br');
  });

  it('should ignore cite tag with invalid content', () => {
    const html = `
      <li class="b_algo">
        <h2><a href="https://example.com/page">Valid URL</a></h2>
        <cite>invalid cite content with spaces</cite>
      </li>
    `;
    const results = HtmlParser.extractResults(html);
    // Should use the href URL since it's not a redirect
    expect(results[0].url).toBe('https://example.com/page');
  });

  it('should decode HTML entities in cite tags', () => {
    const html = `
      <li class="b_algo">
        <h2><a href="https://www.bing.com/ck/a?url=...">Article</a></h2>
        <cite>example.com&nbsp;/&nbsp;test</cite>
      </li>
    `;
    const results = HtmlParser.extractResults(html);
    // Should extract only the domain part
    expect(results[0].url).toBe('https://example.com');
  });
});
