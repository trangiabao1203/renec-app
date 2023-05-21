import React from 'react';
import VideoItem from './VideoItem';
import { Video } from '@/models/video';
import { Profile } from '@/models/profile';
import { PostRepository } from '../repositories/post.repository';

interface Props {
  profile: Profile | null;
}

const postRepository = new PostRepository();

const VideoList: React.FC<Props> = ({ profile }) => {
  const [videos, setVideos] = React.useState<Video[]>([]);

  React.useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const data = await postRepository.list();
    setVideos(data || []);
  };

  return (
    <div className="container mx-auto px-4 mt-8 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {videos.map(video => (
          <VideoItem key={video._id} video={video} profile={profile} />
        ))}
      </div>
    </div>
  );
};

export default VideoList;
