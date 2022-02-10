import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { User } from "../user/user.entity";
import { AuthService } from "./auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {

    constructor(private authService:AuthService) {
        super({ usernameField: 'email' })
    }

    async validate(email: string, password: string): Promise<User> {
        // Do something to check the user is valid
        const user = await this.authService.validateUser(email, password)

        // If not, throw an exception
        if (!user) {
            throw new UnauthorizedException()
        }

        // If everything is OK, we want to return information about the User
        return user
    } 
}