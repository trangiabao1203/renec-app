import React, { useState } from 'react';
import { FaDownload, FaTimes } from 'react-icons/fa';
import { HelperRepository } from '@/repositories';
import { YoutubeInfo } from '@/models';
import { PostRepository } from '@/repositories/post.repository';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
}

const helperRepository = new HelperRepository();
const postRepository = new PostRepository();

const ShareModal: React.FC<ShareModalProps> = ({ open, onClose }) => {
  const [url, setUrl] = useState<string>('');
  const [videoInfo, setVideoInfo] = React.useState<YoutubeInfo | null>(null);

  const handleScrapYoutube = async (url: string) => {
    setUrl(url);
    if (!url) {
      setVideoInfo(null);
      return;
    }

    try {
      const info: YoutubeInfo | null = await helperRepository.scrapeYoutube(url);
      setVideoInfo(info);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleShare = async () => {
    if (videoInfo === null) return;
    await postRepository.shared(videoInfo);
  };

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center overflow-auto z-50 ${open ? 'visible' : 'invisible'}`}
    >
      <div className="fixed inset-0 backdrop-filter backdrop-blur-lg bg-opacity-50" />
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 relative sm:w-2/3 lg:w-1/2">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-300 mt-4 mr-4"
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">Share Video</h2>
        <form onSubmit={handleShare}>
          <div className="mb-4">
            <label htmlFor="url" className="block mb-2 font-medium text-white">
              URL
            </label>
            <div className="relative">
              <input
                type="text"
                id="url"
                className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-500 rounded"
                placeholder="Enter URL"
                value={url}
                onChange={e => handleScrapYoutube(e.target.value)}
              />
              {url?.length > 0 && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <FaDownload
                    className="text-gray-400 hover:text-gray-300 cursor-pointer"
                    onClick={() => handleScrapYoutube(url)}
                  />
                </div>
              )}
            </div>
          </div>
          {videoInfo && (
            <div className="flex items-start space-x-4">
              <div>
                <img src={videoInfo.thumbnail} alt="Video Thumbnail" className="rounded-lg h-auto" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-white">{videoInfo.title}</h2>
                <p className="text-gray-300">{videoInfo.description}</p>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              disabled={!url && !videoInfo}
            >
              Share
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShareModal;
