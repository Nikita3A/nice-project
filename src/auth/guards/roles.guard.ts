import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UsersService } from 'src/users/users.service';
import { User } from '../../users/interfaces/user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private reflector: Reflector,

        @Inject(forwardRef(() => UsersService))
        private usersService: UsersService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {        
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        
        if (!roles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user: User = request.user;
      
        return await this.usersService.findOne(user.id).then((user) => {
            const hasRole = () => roles.indexOf(user.role) > -1;
            let hasPermission = false;

            if (hasRole()) {
                hasPermission = true;
            }
            
            return user && hasPermission;
        });
    }
}