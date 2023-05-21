import {
  BaseController,
  Controller,
  IBaseControllerProps,
  Patch,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  Param,
  Req,
  Request,
  JwtPayload,
} from '@joktec/core';
import { PostService } from './post.service';
import { Post, VoteType } from './models';

const props: IBaseControllerProps<Post> = {
  dto: Post,
  useGuard: false,
};

@Controller('posts')
export class PostController extends BaseController<Post, string>(props) {
  constructor(protected postService: PostService) {
    super(postService);
  }

  @Patch('/:id/vote/:voteType')
  @ApiOperation({ summary: `Vote post` })
  @ApiOkResponse({ type: Post })
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiParam({ name: 'voteType', description: 'Vote Type', enum: VoteType })
  async done(@Param('id') id: string, @Param('voteType') voteType: VoteType, @Req() req: Request): Promise<Post> {
    return this.service.vote(id, voteType, req['payload'] as JwtPayload);
  }
}
