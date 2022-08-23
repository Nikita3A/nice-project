import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UpdateUser, User } from '../users/interfaces/user.interface'
import { Repository } from 'typeorm';
import { TokenEntity } from './models/token.entity';
import { UsersService } from 'src/users/users.service';
import { ReqSignUpDTO } from './dtos/requests/sign-up.dto';
import { ReqSignInDTO } from './dtos/requests/sign-in.dto';
import { ReqResetPasswordDTO } from './dtos/requests/ResetPassword.dto';
import { MailService } from 'src/mail/mail.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(
        @InjectRepository(TokenEntity)
        private tokenRepository: Repository<TokenEntity>,
        private readonly jwtServjce: JwtService,
        private readonly usersService: UsersService,
        private readonly mailService: MailService,
    ) {}

    async signup(userData: ReqSignUpDTO) {
        const user = await this.usersService.findOne({email: userData.email});
        if (user) throw new HttpException('User with such email already exist', HttpStatus.BAD_REQUEST);

        const userToConfirm = {
            email: userData.email,
            name: userData.name
        }

        const tokenForConfirmation = await this.generateJWT(userToConfirm);
        await this.mailService.sendUserConfirmation(userToConfirm, tokenForConfirmation);
        const passwordHash = await this.hashPassword(userData.password);

        return await this.usersService.signup(userData, passwordHash, tokenForConfirmation);
    }

    async signin(credentials: ReqSignInDTO) {
        const isUserExist = await this.usersService.findOne({email: credentials.email});
        if (!isUserExist) throw new HttpException('User with such email does not exist', HttpStatus.FORBIDDEN);
        
        if (isUserExist.isEmailVerified == false) throw new HttpException('Verify your email', HttpStatus.FORBIDDEN);
        
        return await this.validateUser(credentials.email, credentials.password).then((user) => {
            return this.generateJWT(user);
        });  
    }

    validateUser(email: string, password: string) {
        return this.usersService.findOne({email}).then(async (user) => {            
            const isPasswordRight = await this.comparePasswords(password, user.password);
            
            if (isPasswordRight) {
                const {password, ...result} = user;
                return result;
            } else {
                throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
            }
        });
    }

    async verifyEmail(token: string) {        
        const user = await this.usersService.findOne({verification_hash: token});
        return await this.usersService.verifyEmail(user.id);
    }

    async forgotPassword(email: string) {
        const user = await this.usersService.findOne({email});
        
        if (!user) throw new HttpException('User with such email does not exist', HttpStatus.FORBIDDEN);
        
        if (user.isEmailVerified == false) throw new HttpException('Verify your email', HttpStatus.FORBIDDEN);

        const token = await this.generateJWT(user);
        await this.mailService.sendLinkToResetPassword(user, token);
        return 'The letter has been sent то your email';
    }

    async resetPassword(token: string, password: ReqResetPasswordDTO) {        
        const userDataFromToken: User = this.getUserDataFromToken(token);
        const passwordHash = await this.hashPassword(password.password);
        const pass: UpdateUser = {
            password: passwordHash
        };        
        return this.usersService.updateUserById(userDataFromToken.id, pass);
    }

    generateJWT(user: User): Promise <string> {
        return this.jwtServjce.signAsync({user});
    }

    hashPassword(password: string): Promise <string> {
        return bcrypt.hash(password, 12);
    }

    comparePasswords(newPassword: string, passwordHash: string) {
        return bcrypt.compare(newPassword, passwordHash);
    }

    decodeToken(token: string) { 
        const pureToken = token.split(' ')[1];
        if (!pureToken) return this.jwtServjce.decode(token);
        
        return this.jwtServjce.decode(pureToken);
    }

    blackListToken(token: string) {
        return this.tokenRepository.save({token: token, created_at: new Date()});
    }

    findBlackListedToken(token: string): Promise<TokenEntity> {
        return this.tokenRepository.findOne({token: token});
    }

    getUserDataFromToken(token: string) {
        const payLoad = this.decodeToken(token); 
        return Object(payLoad)["user"];
    }

    @Cron(CronExpression.EVERY_DAY_AT_10AM)
    async deleteBlackListedTokens() {
        const date = new Date();
        date.setSeconds(date.getSeconds() - 10000);
        
        await this.tokenRepository.query(`
        DELETE FROM token_entity
        WHERE created_at <= '${date.toISOString()}';`);

        console.log(`The token's table is cleaned`);        
    }
}