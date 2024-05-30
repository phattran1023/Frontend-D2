import { Expose, Type } from "class-transformer";
import { Default } from "../../core/decorators/default.decorator";
import { BaseModel } from "../../core/models/base.model";
import 'reflect-metadata';

export class UserProfileModel {
    @Expose()
    designation: string;
}

export class UserModel extends BaseModel {
    @Expose()
    id!: number;

    @Default('')
    @Expose()
    phoneNumber!: string;

    @Expose()
    firstName!: string;

    @Expose()
    lastName!: string;

    @Type(() => Date) 
    @Expose()
    dob!: Date; 

    @Expose()
    @Type(() => UserProfileModel)
    profile: UserProfileModel;

    @Expose()
    get name(): string {
        return [this.firstName, this.lastName].join(' '); 
    }
}