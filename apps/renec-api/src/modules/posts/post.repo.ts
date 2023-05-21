import { ICondition, Injectable, JwtPayload } from '@joktec/core';
import { MongoRepo, MongoService } from '@joktec/mongo';
import { Post, VoteType } from './models';

@Injectable()
export class PostRepo extends MongoRepo<Post, string> {
  constructor(protected mongoService: MongoService) {
    super(mongoService, Post);
  }

  async vote(id: string, voteType: VoteType, payload: JwtPayload): Promise<Post> {
    const postModel = this.mongoService.getModel(Post);
    if (voteType === VoteType.NONE) {
      await Promise.all([
        postModel.findByIdAndUpdate(id, { $pull: { likeByIds: payload.sub } }),
        postModel.findByIdAndUpdate(id, { $pull: { dislikeByIds: payload.sub } }),
      ]);
    } else if (voteType === VoteType.UP) {
      await Promise.all([
        postModel.findByIdAndUpdate(id, { $addToSet: { likeByIds: payload.sub } }),
        postModel.findByIdAndUpdate(id, { $pull: { dislikeByIds: payload.sub } }),
      ]);
    } else if (voteType === VoteType.DOWN) {
      await Promise.all([
        postModel.findByIdAndUpdate(id, { $addToSet: { dislikeByIds: payload.sub } }),
        postModel.findByIdAndUpdate(id, { $pull: { likeByIds: payload.sub } }),
      ]);
    }
    return this.findOne({ condition: { _id: id } });
  }
}
