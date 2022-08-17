import { Storage } from "@google-cloud/storage";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AvatarsEntity } from "./models/avatars.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/users/models/user.entity";

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: string;

  constructor(
    @InjectRepository(AvatarsEntity)
    private avatarsRepository: Repository<AvatarsEntity>,
    private readonly configService: ConfigService,
  ) {
    this.storage = new Storage({
      projectId: this.configService.get('PROJECT_ID'),
      credentials: {
        client_email: this.configService.get('CLIENT_EMAIL'),
        private_key: this.configService.get('PRIVATE_KEY').replace(/\\n/gm, '\n'),
      },
    });
    this.bucket = this.configService.get('BUCKET_NAME');
  }

  // export OPENSSL_CONF=/dev/null ! if not working !  

  async save(userId: number, avatar: Express.Multer.File) {  
    const file = await this.avatarsRepository.find({name: avatar.originalname});
    if (file.length > 0) throw new HttpException('You can not upload file with such name', HttpStatus.BAD_REQUEST);

    await this.storage.bucket(this.bucket).file(avatar.originalname).save(avatar.buffer);

    const entity: UserEntity = new UserEntity();
    entity.id = userId;
    const url = `https://storage.cloud.google.com/${this.bucket}/${avatar.originalname}?authuser=1`;

    const data = {
      user: entity,
      name: avatar.originalname,
      link: url,
    }

    return await this.avatarsRepository.save(data); 
  }

  async delete(userId: number) {
    const [avatar] = await this.get(userId);
    if (!avatar) throw new HttpException('File does not exist', HttpStatus.BAD_REQUEST);
    await this.storage.bucket(this.bucket).file(avatar.name).delete();

    return await this.avatarsRepository.delete({name: avatar.name});
  }

  async get(userId: number) {
    return await this.avatarsRepository.query(
      `SELECT avatars_entity.id AS id, avatars_entity.link AS link,
      avatars_entity."userId" AS userId, avatars_entity.name AS name
      FROM "avatars_entity" INNER JOIN "user_entity" ON avatars_entity."userId" = user_entity.id
      WHERE avatars_entity."userId" = ${userId};`
    );
  }

  async updateAvatar(userId: number, avatar: Express.Multer.File) {
    const existingAvatar = await this.get(userId);    
    if (existingAvatar.length > 0) await this.delete(userId);
    return await this.save(userId, avatar);
  }
}