const request = require('request-promise-native');

export default class CommonRequest {
    static async get(url: string): Promise<any> {
        const options = {
            uri: url,
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
            },
            json: true, // Automatically parses the JSON string in the response
        };

        return await request(options);
    }
}
