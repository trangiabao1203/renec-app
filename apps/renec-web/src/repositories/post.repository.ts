import { BaseResponse } from '@/models/base.response';
import axiosInstance from '@/global/axios.global';
import { Video, VideoList, YoutubeInfo } from '@/models';
import { VoteType } from '@/components/VoteButton';

export class PostRepository {
  async list(): Promise<Video[]> {
    const response = await axiosInstance.request<BaseResponse<VideoList>>({
      url: '/posts',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      params: { 
        populate: { author: '*' }, 
       },
    });
    return response?.data?.data?.items || [];
  }

  async shared(videoInfo: YoutubeInfo): Promise<Video | null> {
    const response = await axiosInstance.request<BaseResponse<Video | null>>({
      url: '/posts',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { 
        title: videoInfo.title,
        description: videoInfo.description,
        image: videoInfo.thumbnail,
        thumbnail: videoInfo.thumbnail,
        link: videoInfo.url,
        },
    });
    return response?.data?.data || null;
  }

  async vote(videoId: string, voteType: VoteType): Promise<Video | null> {
    const response = await axiosInstance.request<BaseResponse<Video | null>>({
      url: `/posts/${videoId}/vote/${voteType}`,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    return response?.data?.data || null;
  }
}
