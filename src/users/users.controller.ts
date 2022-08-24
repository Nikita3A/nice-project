import { Controller, Get, Body, Param, Delete, UseGuards, Logger, ValidationPipe, UsePipes, ParseIntPipe, UseInterceptors, UploadedFile, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserDataFromToken, UserRole } from './interfaces/user.interface';
import { DeleteResult } from 'typeorm';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiResponse } from '@nestjs/swagger';
import { ReqUpdateUserDTO } from './dtos/requests/update-user.dto';
import { ResGetUserDTO } from '../users/dtos/responses/get-users.dto'
import { ResDeleteUsersDTO } from '../users/dtos/responses/delete-user.dto'
import { ResUpdateUserDTO } from '../users/dtos/responses/update-user.dto'
import { UserFromToken } from 'src/auth/decorators/dataFromToken.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
    constructor(
      private readonly usersService: UsersService,
    ) {}

    @HasRoles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    @ApiResponse({ status: 200, description: 'Get users', type: [ResGetUserDTO] })
    @Get()
    getUsers(): Promise<User[]> {
      return this.usersService.getUsers();
    }

    @ApiResponse({ status: 200, description: 'Get one user by id', type: ResGetUserDTO })
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiParam({
      name: 'id', 
      required: true, 
      description: 'id of user', 
      schema: { oneOf: [{type: 'string'}, {type: 'integer'}]}
    })
    @Get('/:id')
    findById(@Param('id', ParseIntPipe) id): Promise<User> {
      return this.usersService.findById(id);
    }
    
    @ApiResponse({ status: 200, description: 'Delete user by id', type: ResDeleteUsersDTO })
    @HasRoles(UserRole.ADMIN)
    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiParam({
      name: 'id', 
      required: true, 
      description: 'id of user', 
      schema: { oneOf: [{type: 'string'}, {type: 'integer'}]}
    })
    @Delete('/:id')
    deleteUserById(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
      return this.usersService.deleteUserById(id);
    }

    @ApiResponse({ status: 200, description: 'Update user by id', type: ResUpdateUserDTO })
    @HasRoles(UserRole.ADMIN)
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiBody({type: ReqUpdateUserDTO})
    @UseGuards(JwtAuthGuard)
    @Patch('/')
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('avatar'))
    async updateUserById(@UserFromToken() user: UserDataFromToken, @Body() data: ReqUpdateUserDTO, @UploadedFile() avatar: Express.Multer.File) {
      return this.usersService.updateUserById(user.id, data, avatar);
    }
}
