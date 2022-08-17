import { Controller, Delete, Get, Post, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { UserFromToken } from 'src/auth/decorators/dataFromToken.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { UserDataFromToken } from 'src/users/interfaces/user.interface';
import { ReqUploadFileDTO } from './dtos/requests/upload-file.dto';
import { ResDeleteFileFromStorageDTO } from './dtos/responses/delete-file-from-storage.dto';
import { ResGetFileDTO } from './dtos/responses/get-file-from-storage.dto';
import { ResUploadFileDTO } from './dtos/responses/upload-file.dto';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
    constructor(
        private readonly storageService: StorageService,
    ) {}

    @ApiBody({type: ReqUploadFileDTO})
    @ApiResponse({ status: 200, description: 'Upload avatar to Google cloud storage', type: ResUploadFileDTO })
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('avatar'))
    async saveFileToStorage(@UserFromToken() user: UserDataFromToken, @UploadedFile() avatar: Express.Multer.File) {
      return this.storageService.save(user.id, avatar);
    }

    @ApiResponse({ status: 200, description: 'Delete avatar from Google cloud storage', type: ResDeleteFileFromStorageDTO })
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Delete()
    async deleteFileFromStorage(@UserFromToken() user: UserDataFromToken) {
      return this.storageService.delete(user.id);
    }

    @ApiResponse({ status: 200, description: 'Delete avatar from Google cloud storage', type: [ResGetFileDTO] })
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get()
    async getFileFromStorage(@UserFromToken() user: UserDataFromToken) {
      return this.storageService.get(user.id);
    }

}
