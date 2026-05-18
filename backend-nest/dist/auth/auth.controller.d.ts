import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        data: {
            token: string;
            user: {
                id: import("mongoose").Types.ObjectId;
                name: string;
                email: string;
                role: string;
            };
        };
        _skip_format: boolean;
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        data: {
            token: string;
            user: {
                id: import("mongoose").Types.ObjectId;
                name: string;
                email: string;
                role: string;
            };
        };
    }>;
    getMe(user: any): Promise<{
        message: string;
        data: import("mongoose").Document<unknown, {}, import("../modules/users/schemas/user.schema").UserDocument, {}, import("mongoose").DefaultSchemaOptions> & import("../modules/users/schemas/user.schema").User & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        } & {
            id: string;
        };
    }>;
}
