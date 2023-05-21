import { Injectable, LogService } from '@joktec/core';
import { HttpService } from '@joktec/http';
import { load } from 'cheerio';
import { head } from 'lodash';
import { YoutubeResponse } from './models';

@Injectable()
export class HelperService {
  constructor(private logger: LogService, private httpService: HttpService) {}

  async scrapeYoutube(url: string): Promise<YoutubeResponse> {
    try {
      this.logger.info(`Scraping Youtube info from ${url}`);
      const response = await this.httpService.request({ url });
      const $ = load(response.data);

      const title = $('meta[property="og:title"]').attr('content') || '';
      const description = $('meta[property="og:description"]').attr('content') || '';
      const thumbnail = $('meta[property="og:image"]').attr('content') || '';

      return { url, title, description, thumbnail };
    } catch (err) {
      this.logger.error(err, 'Error scraping Youtube info');
    }
    return { url, title: '', description: '', thumbnail: '' };
  }
}
