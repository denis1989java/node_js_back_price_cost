import { Authorized, Body, CurrentUser, Get, JsonController, Param, Post, Put } from 'routing-controllers';
import { Service } from 'typedi';
import UserInfoService from '../service/UserInfoService';
import { UserInfoCreateDTO } from '../dto/UserInfoCreateDTO';
import { UserInfoResponseDTO } from '../dto/UserInfoResponseDTO';
import { UserInfoUpdateDTO } from '../dto/UserInfoUpdateDTO';
import { inject } from 'inversify';
import { TYPES } from '../types';
import { User } from '../entity/User';

@Service()
@JsonController()
@Authorized()
export class UserInfoController {
    constructor(@inject(TYPES.UserInfoService) private readonly userInfoService: UserInfoService) {}

    @Get('/userInfo/:id')
    findOne(@Param('id') id: number): Promise<UserInfoResponseDTO> {
        return this.userInfoService.findOne(id);
    }

    @Post('/userInfo')
    save(@Body() request: UserInfoCreateDTO, @CurrentUser() user?: User): Promise<UserInfoResponseDTO> {
        return this.userInfoService.save(request, user);
    }

    @Put('/userInfo')
    update(@Body() request: UserInfoUpdateDTO): Promise<UserInfoResponseDTO> {
        return this.userInfoService.update(request);
    }
}
