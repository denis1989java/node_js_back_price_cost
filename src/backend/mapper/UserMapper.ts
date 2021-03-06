import { User } from '../entity/User';
import { UserResponseDTO } from '../dto/UserResponseDTO';

const objectMapper = require('object-mapper');

const userResponseDTO = {
    id: 'id',
    email: 'email',
    status: 'status',
    'userInfo.currency': 'currency',
    'userInfo.birthDate': 'birthDate',
    'userInfo.name': 'name',
    'userInfo.surname': 'surname',
    'userInfo.phone': 'phone',
    'userInfo.address.city': 'city',
    'userInfo.address.country': 'country',
    'userInfo.address.street': 'street',
    'userInfo.address.zip': 'zip',
};

export function fromUserToUserResponseDTO(user: User): UserResponseDTO {
    return objectMapper(user, userResponseDTO);
}
