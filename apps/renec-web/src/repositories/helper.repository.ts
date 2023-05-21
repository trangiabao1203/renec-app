import axiosInstance from '@/global/axios.global';
import { YoutubeInfo } from '@/models';
import { BaseResponse } from '@/models/base.response';

export class HelperRepository {
  async scrapeYoutube(url: string): Promise<YoutubeInfo | null> {
    const response = await axiosInstance.request<BaseResponse<YoutubeInfo>>({
      url: '/helper/youtube',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { url },
    });
    return response?.data?.data || null;
  }
}
