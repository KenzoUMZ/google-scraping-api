/**
 * Utilitário para detectar páginas de CAPTCHA ou bloqueio de bot
 */
export class CaptchaDetector {
    /**
     * Indicadores comuns de páginas de CAPTCHA ou verificação
     */
    private static readonly CAPTCHA_INDICATORS = [
        'detected unusual traffic',
        'captcha',
        'please verify',
        'are you human',
        'g-recaptcha',
        'recaptcha',
        'security check',
        'verify you are human',
        'please complete the security check',
        'access denied',
        'blocked',
    ];

    /**
     * Verifica se o HTML contém indicadores de CAPTCHA
     * @param html Conteúdo HTML da página
     * @returns true se CAPTCHA for detectado
     */
    static detect(html: string): boolean {
        if (!html || html.trim().length === 0) {
            return false;
        }

        const htmlLowerCase = html.toLowerCase();

        return this.CAPTCHA_INDICATORS.some((indicator) =>
            htmlLowerCase.includes(indicator),
        );
    }

    /**
     * Verifica se o HTML é muito pequeno (possível erro/bloqueio)
     * @param html Conteúdo HTML da página
     * @returns true se o HTML parecer suspeito
     */
    static isSuspiciouslySmall(html: string): boolean {
        return html.length < 500;
    }
}
