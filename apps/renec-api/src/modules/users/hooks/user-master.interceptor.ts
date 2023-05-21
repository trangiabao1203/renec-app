import { CallHandler, ExecutionContext, ForbiddenException, Injectable, NestInterceptor } from '@joktec/core';
import { Observable } from 'rxjs';
import { UserRepo } from '../user.repo';
import { User } from '../models';

@Injectable()
export class UserMasterInterceptor implements NestInterceptor {
  constructor(private userRepo: UserRepo) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req = context.switchToHttp().getRequest();
    const loggedUser = req['loggedUser'] as User;

    if (req.method === 'GET' && !loggedUser.isMaster) {
      req.query.condition = { ...req.query.condition, isMaster: false };
    }

    if (req.method === 'POST' && !loggedUser.isMaster) {
      delete req.body.isMaster;
    }

    if (['PUT', 'PATCH', 'DELETE'].includes(req.method) && !loggedUser.isMaster) {
      const user = await this.userRepo.findOne({ condition: { _id: req.params.id } });
      if (user?.isMaster) throw new ForbiddenException('PERMISSION_DENIED');
    }

    return next.handle();
  }
}
