import { ConfigService, Inject, Injectable, Request, REQUEST } from '@joktec/core';
import { HttpService } from '@joktec/http';
import { LocalizeConfig } from './localize.config';
import { extractLocale } from './localize.utils';
import { Localize } from './localize.model';
import dot from 'dot-object';
import { isEmpty, snakeCase } from 'lodash';
import fs from 'fs';

@Injectable()
export class LocalizeService {
  private readonly localizeConfig: LocalizeConfig;
  private readonly i18n: Localize;

  constructor(
    @Inject(REQUEST) private request: Request,
    private configService: ConfigService,
    private httpService: HttpService,
  ) {
    if (!this.localizeConfig) this.localizeConfig = new LocalizeConfig(this.configService.get('i18n'));
    if (!this.i18n) this.i18n = new Localize({ ...this.localizeConfig });
  }

  public t(phrase: string) {
    const locale = extractLocale(this.request, this.localizeConfig);
    return this.i18n.__({ phrase, locale });
  }

  async getTranslate(type: string = 'nonTranslate'): Promise<any> {
    if (type === 'all') return this.i18n.getCatalog();
    const catalog = this.i18n.getCatalog();
    return Object.keys(catalog).reduce((newCatalog, locale) => {
      const dotCatalog = dot.dot(catalog[locale]);
      const nonTranslate = Object.keys(dotCatalog).reduce((result, key) => {
        const value = dotCatalog[key];
        if (value === snakeCase(value).toUpperCase() || key === value) {
          result[key] = value;
        }
        return result;
      }, {});
      newCatalog[locale] = dot.object(nonTranslate);
      return newCatalog;
    }, {});
  }

  async updateTranslate(): Promise<any> {
    const { data: resExportData } = await this.httpService.request(
      {
        url: '/v3/export',
        params: {
          downloadFormat: 'multi-language-json',
        },
      },
      'simplelocalize',
    );
    const url = resExportData?.data?.url;
    if (!url) return { success: false };

    const { data: resLocaleData } = await this.httpService.request({ url });
    if (!resLocaleData) return { success: false };

    await Promise.all(
      this.localizeConfig.locales.map(async locale => {
        const dotCatalog = dot.dot(this.i18n.getCatalog(locale));
        const changeCatalog = resLocaleData[locale] || {};
        if (isEmpty(changeCatalog)) return;

        const newCatalog = dot.object({ ...dotCatalog, ...changeCatalog });
        const filePath = `${this.localizeConfig.directory}/${locale}.json`;
        fs.writeFileSync(filePath, JSON.stringify(newCatalog, null, 2));
      }),
    );

    return { success: true };
  }
}
