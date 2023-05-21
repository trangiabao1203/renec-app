import { Request } from '@joktec/core';
import { LocalizeConfig } from './localize.config';

export const extractLocale = (request: Request, cfg: LocalizeConfig): string => {
  const acceptLanguage: string = request.headers['accept-language'];
  if (!acceptLanguage) return cfg.defaultLocale;
  if (cfg.locales.includes(acceptLanguage)) return acceptLanguage;

  const languages = acceptLanguage
    .split(',')
    .map(lang => {
      const [code, q] = lang.trim().split(';q=');
      const quality = q ? parseFloat(q) : 1.0;
      return { code, quality };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const lang of languages) {
    const code = lang.code.split('-')[0];
    if (cfg.locales.includes(code)) return lang.code;
  }

  return cfg.defaultLocale;
};
