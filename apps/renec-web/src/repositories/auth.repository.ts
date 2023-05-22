import { BaseResponse } from '@/models/base.response';
import axiosInstance from '@/global/axios.global';
import { Profile, TokenProfile } from '@/models/profile';

export class AuthRepository {
  async login(email: string, password: string): Promise<Profile | null> {
    const response = await axiosInstance.request<BaseResponse<TokenProfile>>({
      url: '/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { email, password },
    });

    const accessToken = response?.data?.data?.accessToken || '';
    localStorage.setItem('token', accessToken);

    const profile = response?.data?.data?.profile || null;
    localStorage.setItem('profile', JSON.stringify({ data: profile }));

    return profile;
  }

  async register(body: {
    email: string;
    password: string;
    fullName: string;
    confirmedPassword: string;
  }): Promise<Profile | null> {
    const response = await axiosInstance.request<BaseResponse<TokenProfile>>({
      url: '/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { ...body },
    });

    const accessToken = response?.data?.data?.accessToken || '';
    localStorage.setItem('token', accessToken);

    const profile = response?.data?.data?.profile || null;
    localStorage.setItem('profile', JSON.stringify({ data: profile }));

    return profile;
  }

  async getProfile(): Promise<Profile | null> {
    const response = await axiosInstance.request<BaseResponse<Profile>>({
      url: '/profile',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    return response?.data?.data || null;
  }
}
