export default class DateUtil {
    static async isDateExpired(expirationDate: Date): Promise<boolean> {
        return expirationDate <= new Date();
    }
}
