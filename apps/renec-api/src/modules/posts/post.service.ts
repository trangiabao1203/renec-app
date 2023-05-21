import { BaseService, ICondition, Injectable, JwtPayload } from '@joktec/core';
import { Post, VoteType } from './models';
import { PostRepo } from './post.repo';

@Injectable()
export class PostService extends BaseService<Post, string> {
  constructor(protected postRepo: PostRepo) {
    super(postRepo);
  }

  async vote(id: string, voteType: VoteType, payload: JwtPayload): Promise<Post> {
    return this.postRepo.vote(id, voteType, payload);
  }
}
