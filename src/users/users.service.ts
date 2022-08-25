import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UserEntity } from './models/user.entity';
import { UpdateUser, User, UserRole } from './interfaces/user.interface';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class UsersService {
    private readonly logger = new Logger(UsersService.name);
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        private readonly storageService: StorageService,
    ) {}

    signup(user: User, passwordHash: string, hash: string): Promise<User> {
        const newUser = new UserEntity();
        newUser.name = user.name;
        newUser.email = user.email;
        newUser.password = passwordHash;
        newUser.email_verified = false;
        newUser.role = UserRole.USER;
        newUser.created_on = new Date().toLocaleDateString();
        newUser.last_login = new Date().toLocaleDateString();
        newUser.verification_hash = hash;
        return this.usersRepository.save(newUser);
    }

    getUsers(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(param: any): Promise<User> {
        return this.usersRepository.findOne(param);
    }

    findById(id: number): Promise<User> {
        return this.usersRepository.findOne(id);
    }

    deleteUserById(id: number): Promise<DeleteResult> {
        return this.usersRepository.delete(id);
    }

    verifyEmail(id: number): Promise<UpdateResult> {        
        return this.usersRepository.update(id, {email_verified: true});
    }

    async updateUserById(id: number, data: UpdateUser, avatar?: Express.Multer.File) {        
        let updatedUser, updatedAvatar, updatedPassword;
        if (data.name) updatedUser = await this.usersRepository.update(id, {name: data.name});
        if (avatar) updatedAvatar = await this.storageService.updateAvatar(id, avatar);
        if (data.password) updatedPassword = await this.usersRepository.update(id, {password: data.password});
        return {updatedPassword, updatedUser, updatedAvatar}
    }
}
