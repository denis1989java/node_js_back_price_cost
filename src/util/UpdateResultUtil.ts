import { UpdateResult } from 'typeorm';

export default class UpdateResultUtil {
    static async isSuccess(updateResult: UpdateResult): Promise<boolean> {
        return updateResult.raw.changedRows === 1;
    }
}
