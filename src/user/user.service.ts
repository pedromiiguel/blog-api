import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/common/hashing/hashing.service';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async findByOrFail(userData: Partial<User>) {
    const user = await this.userRepository.findOneBy(userData);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  async findOneByEmailOrFail(email: string) {
    const emailExists = await this.userRepository.existsBy({
      email,
    });

    if (emailExists) {
      throw new ConflictException('Usuário com esse e-mail já cadastrado.');
    }
  }

  async create(createUserDto: CreateUserDto) {
    await this.findOneByEmailOrFail(createUserDto.email);

    const hashedPassword = await this.hashingService.hash(
      createUserDto.password,
    );

    const newUser = {
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
    };

    const createdUser = this.userRepository.create(newUser);
    await this.userRepository.save(createdUser);

    return createdUser;
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  save(user: User) {
    return this.userRepository.save(user);
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOne(userId: string) {
    const user = await this.findByOrFail({ id: userId });
    return user;
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    if (!updateUserDto?.email && !updateUserDto?.email) {
      throw new BadRequestException('Dados não enviados.');
    }

    const user = await this.findByOrFail({ id: userId });

    user.name = updateUserDto.name ?? user.name;

    if (updateUserDto.email && updateUserDto.email !== user.email) {
      await this.findOneByEmailOrFail(updateUserDto.email);
      user.email = updateUserDto.email;
      user.forceLogout = true;
    }

    return this.save(user);
  }

  async updatePassword(
    userId: string,
    updatePasswordUserDto: UpdatePasswordUserDto,
  ) {
    const user = await this.findByOrFail({ id: userId });

    const isCurrentPasswordValid = await this.hashingService.compare(
      updatePasswordUserDto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Senha atual incorreta.');
    }

    if (
      updatePasswordUserDto.currentPassword ===
      updatePasswordUserDto.newPassword
    ) {
      throw new BadRequestException(
        'A nova senha deve ser diferente da senha atual.',
      );
    }

    const hashedNewPassword = await this.hashingService.hash(
      updatePasswordUserDto.newPassword,
    );

    user.password = hashedNewPassword;
    user.forceLogout = true;

    return this.save(user);
  }

  async remove(userId: string) {
    const user = await this.findByOrFail({ id: userId });
    await this.userRepository.delete({ id: userId });
    return user;
  }
}
