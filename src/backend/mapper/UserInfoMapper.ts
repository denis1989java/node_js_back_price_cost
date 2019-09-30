import { UserInfo } from '../entity/UserInfo';
import { UserInfoResponseDTO } from '../dto/UserInfoResponseDTO';

const objectMapper = require('object-mapper');

const userInfoResponseDTO = {
    id: 'id',
    currency: 'currency',
    birthDate: 'birthDate',
    name: 'name',
    surname: 'surname',
    phone: 'phone',
    'address.city': 'city',
    'address.country': 'country',
    'address.street': 'street',
    'address.zip': 'zip',
};

export function fromUserInfoToUserInfoResponseDTO(userInfo: UserInfo): UserInfoResponseDTO {
    return objectMapper(userInfo, userInfoResponseDTO);
}
