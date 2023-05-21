import React from 'react';
import { FaThumbsDown, FaThumbsUp } from 'react-icons/fa';

export enum VoteType {
  UP = 'up',
  DOWN = 'down',
  NONE = 'none',
}

interface Props {
  voted: VoteType;
  onVote: (vote: VoteType) => void;
}

const VoteButton: React.FC<Props> = ({ voted, onVote }) => {
  const handleVote = (vote: VoteType) => {
    if (voted === vote) {
      onVote(VoteType.NONE);
    } else {
      onVote(vote);
    }
  };

  return (
    <div className="inline-flex rounded-md shadow-sm" role="group">
      <button
        type="button"
        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-l-lg ${
          voted === VoteType.UP ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
        onClick={() => handleVote(VoteType.UP)}
      >
        <FaThumbsUp className="text-sm" />
        <span className="ml-1">Vote up</span>
      </button>
      <button
        type="button"
        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-r-md ${
          voted === VoteType.DOWN ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
        }`}
        onClick={() => handleVote(VoteType.DOWN)}
      >
        <FaThumbsDown className="text-sm" />
        <span className="ml-1">Vote down</span>
      </button>
    </div>
  );
};

export default VoteButton;
