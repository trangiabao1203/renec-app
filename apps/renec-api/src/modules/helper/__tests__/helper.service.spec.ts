import { beforeEach, describe, expect, it } from '@jest/globals';
import { Test } from '@nestjs/testing';
import { HelperService } from '../helper.service';
import { CoreModule } from '@joktec/core';
import { HttpModule, HttpService } from '@joktec/http';

describe('AuthService class', () => {
  let helperService: HelperService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CoreModule, HttpModule],
      providers: [HelperService],
    }).compile();

    helperService = moduleRef.get<HelperService>(HelperService);
  });

  it('should be defined', () => {
    expect(helperService).toBeDefined();
  });

  describe('scrapeYoutube method', () => {
    it('should return right YoutubeResponse schema', async () => {
      const url = 'https://www.youtube.com/watch?v=9bZkp7q19f0';
      const response = await helperService.scrapeYoutube(url);
      expect(typeof response.url).toBe('string');
      expect(typeof response.title).toBe('string');
      expect(typeof response.description).toBe('string');
      expect(typeof response.thumbnail).toBe('string');
    });

    it.skip('should return a YoutubeResponse object with right value', async () => {
      const url = 'https://www.youtube.com/watch?v=9bZkp7q19f0';
      const response = await helperService.scrapeYoutube(url);
      expect(response).toEqual({
        url,
        title: 'PSY - GANGNAM STYLE(강남스타일) M/V',
        description:
          "PSY - ‘I LUV IT’ M/V @ https://youtu.be/Xvjnoagk6GUPSY - ‘New Face’ M/V @https://youtu.be/OwJPPaEyqhIPSY - 8TH ALBUM '4X2=8' on iTunes @https://smarturl.it/P...",
        thumbnail: 'https://i.ytimg.com/vi/9bZkp7q19f0/maxresdefault.jpg',
      });
    });
  });
});
