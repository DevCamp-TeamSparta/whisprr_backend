import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from './entities/admin.entity';
import { Repository } from 'typeorm';
import { AdminDto } from './dto/admin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private adminRepository: Repository<AdminEntity>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  //1. admin 계정 생성
  public async createAdminAccount(adminDto: AdminDto): Promise<{ message: string }> {
    const IsAdminExist = await this.findAdmin(adminDto.email);
    if (IsAdminExist) {
      throw new ConflictException('Admin exists already');
    }

    if (adminDto.confirmedPassword !== adminDto.password) {
      throw new BadRequestException('Password and confirmedPassword do not match');
    }

    const password = await bcrypt.hash(adminDto.password, 10);

    const admin = this.adminRepository.create({
      email: adminDto.email,
      password,
    });

    await this.adminRepository.save(admin);

    return { message: 'account created succesfully' };
  }

  //2. admin 계정 조회
  private async findAdmin(email: string): Promise<AdminEntity> {
    const admin = await this.adminRepository.findOne({ where: { email } });
    return admin;
  }

  //3. admin 계정 로그인
  public async loginAdminAccount(email: string, password: string): Promise<{ token: string }> {
    const admin = await this.findAdmin(email);
    if (!admin) {
      throw new NotFoundException(`Admin  doesn't exists`);
    }

    if (!(await this.comparePasswords(password, admin.password))) {
      throw new UnauthorizedException('');
    }

    return await this.getAdminToken(email);
  }

  //3.1 비밀 번호 비교 메서드

  private async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  //4. admin 토큰 발급 메소드

  private async getAdminToken(email: string): Promise<{ token: string }> {
    const payload = { email, IsAdmin: true };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
    });
    return { token };
  }
}
