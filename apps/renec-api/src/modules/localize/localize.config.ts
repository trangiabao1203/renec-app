import { toArray, toBool } from '@joktec/core';
import { ConfigurationOptions } from 'i18n';

export interface LocalizeFallbacks {
  [locale: string]: string;
}

export class LocalizeConfig implements ConfigurationOptions {
  locales!: string[];
  defaultLocale?: string;
  fallbacks?: LocalizeFallbacks;
  directory?: string;
  autoReload: boolean;
  syncFiles: boolean;
  objectNotation: boolean;
  updateFiles: boolean;

  constructor(props: Partial<LocalizeConfig>) {
    Object.assign(this, {
      ...props,
      locales: toArray<string>(props?.locales),
      directory: props?.directory || './public/i18n',
      autoReload: toBool(props?.autoReload, true),
      syncFiles: toBool(props?.syncFiles, true),
      objectNotation: toBool(props?.objectNotation, true),
      updateFiles: toBool(props?.updateFiles, true),
    });

    if (!this.defaultLocale) this.defaultLocale = this.locales[0];
    if (!props?.fallbacks) {
      this.fallbacks = this.locales.reduce((acc, locale) => {
        acc[`${locale}-*`] = locale;
        return acc;
      }, {});
    }
  }
}
