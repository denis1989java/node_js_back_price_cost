const bcrypt = require('bcrypt');

export default class PasswordUtil {
    static async isValidPassword(persistPassword: string, password: string): Promise<boolean> {
        return await bcrypt.compare(password, persistPassword);
    }
}
