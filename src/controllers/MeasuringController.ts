import {Authorized, Get, JsonController} from 'routing-controllers';
import { Service } from 'typedi';
import 'reflect-metadata';
import { Measuring } from '../entity/Measuring';
import { MeasuringResponseDTO } from '../dto/MeasuringResponseDTO';

@Service()
@JsonController()
@Authorized()
export class MeasuringController {

    @Get('/measuring')
    find(): MeasuringResponseDTO[] {
        return Object.keys(Measuring).map((key, index) => {
            return new MeasuringResponseDTO(index, key, Measuring[<any>key]);
        });
    }
}
