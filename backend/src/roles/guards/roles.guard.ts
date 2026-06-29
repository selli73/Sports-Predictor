import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private _reflector: Reflector) {}

    canActivate(context: ExecutionContext) {
        
        const requiredRoles = this._reflector.get(ROLES_KEY, context.getHandler());

        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        console.log(user)

        return requiredRoles.includes(user.role);
    }
}