import { TokenValidationDTO } from '../dto/TokenValidationDTO';

const jwt = require('jsonwebtoken');

export default class TokenUtil {
    static async create(email: string): Promise<string> {
        const payload = { user: email };
        const options = { expiresIn: process.env.TOKEN_EXPIRE_TIME };
        const secret = process.env.LOGIN_SECRET;

        return await jwt.sign(payload, secret, options);
    }

    static async validate(token: string, secret: string): Promise<TokenValidationDTO> {
        return await jwt.verify(token, secret);
    }
}
