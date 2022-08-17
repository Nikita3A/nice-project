import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './models/user.entity';
import { User, UserRole } from './interfaces/user.interface';
import { ReqUpdateUserDTO } from './dtos/requests/update-user.dto';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        private readonly storageService: StorageService,
    ) {}

    signup(user: User, passwordHash: string): Promise<User> {
        const newUser = new UserEntity();
        newUser.name = user.name;
        newUser.email = user.email;
        newUser.password = passwordHash;
        newUser.isEmailVerified = false;
        newUser.role = UserRole.USER;
        newUser.created_on = new Date().toLocaleDateString();
        newUser.last_login = new Date().toLocaleDateString();
        return this.usersRepository.save(newUser);
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: number): Promise<User> {
        return this.usersRepository.findOne(id);
    }

    findOneById(id: number): Promise<User> {
        return this.usersRepository.findOne(id);
    }

    findOneByEmail(email: string): Promise<User> {
        return this.usersRepository.findOne({email: email});
    }

    async findByEmail(email: string): Promise<User> {
        return await this.usersRepository.findOne({email: email});
    }

    delete(id: number): Promise<DeleteResult> {
        return this.usersRepository.delete(id);
    }

    async verifyEmail(id: number): Promise<UpdateResult> {        
        return await this.usersRepository.update(id, {isEmailVerified: true});
    }

    async resetPassword(id: number, password: string): Promise<UpdateResult> {        
        return await this.usersRepository.update(id, {password: password});
    }

    async updateById(id: number, data: ReqUpdateUserDTO, avatar?: Express.Multer.File) {
        let updatedUser, updatedAvatar;
        if (data.name) updatedUser = await this.usersRepository.update(id, {name: data.name});
        if (avatar) updatedAvatar = await this.storageService.updateAvatar(id, avatar);

        return {updatedUser, updatedAvatar}
    }
}
