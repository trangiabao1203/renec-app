'use client';
import React from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import VoteButton, { VoteType } from '@/components/VoteButton';
import { Video } from '@/models/video';
import { Profile } from '@/models/profile';
import { PostRepository } from '@/repositories/post.repository';

interface Props {
  video: Video;
  profile: Profile | null;
}

const postRepository = new PostRepository();

const VideoItem: React.FC<Props> = ({ video, profile }) => {
  const [vote, setVote] = React.useState<VoteType>(VoteType.NONE);

  React.useEffect(() => {
    if (!profile || !profile?._id) return;
    if (video.likeByIds.includes(profile._id)) {
      setVote(VoteType.UP);
    } else if (video.dislikeByIds.includes(profile._id)) {
      setVote(VoteType.DOWN);
    } else {
      setVote(VoteType.NONE);
    }
  }, [profile, video]);

  const handleOnVote = async (vote: VoteType) => {
    const newVideo = await postRepository.vote(video._id, vote);
    if (newVideo === null) return;
    setVote(vote);
    video.likeByIds = newVideo.likeByIds;
    video.dislikeByIds = newVideo.dislikeByIds;
  };

  return (
    <div className="w-full rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800">
      <img className="w-full" src={video.thumbnail} alt={video.title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 text-black dark:text-white">
          <a href={video.link} target="_blank" rel="noopener noreferrer">
            {video.title}
          </a>
        </div>
        <div className="text-gray-500 text-sm">Shared by: {video?.author?.fullName || 'Unknown'}</div>
        <div className="flex items-center mt-2 mb-2">
          <p className="text-gray-500 mr-2 flex items-center">
            <FaThumbsUp className="text-sm text-blue-500" />
            <span className="ml-1 text-sm">{video.likeByIds.length || 0}</span>
          </p>
          <span className="text-gray-400 mr-2">•</span>
          <p className="text-gray-500 mr-2 flex items-center">
            <FaThumbsDown className="text-sm text-red-500" />
            <span className="ml-1 text-sm">{video.dislikeByIds.length || 0}</span>
          </p>
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          <span className="font-bold">Description</span>: <span className="italic">{video.description}</span>
        </p>
      </div>
      {!!profile && (
        <div className="px-6 py-2 flex justify-end mb-2">
          <VoteButton voted={vote} onVote={v => handleOnVote(v)}></VoteButton>
        </div>
      )}
    </div>
  );
};

export default VideoItem;
