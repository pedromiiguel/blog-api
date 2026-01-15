import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UseGuards,
  Req,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request.type';
import { UserResponseDto } from './dto/user-response.dto';
import { UpdatePasswordUserDto } from './dto/update-password-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);

    return new UserResponseDto(user);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findOne(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const user = await this.userService.findOne(userId);

    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async update(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const userId = req.user.id;
    const user = await this.userService.update(userId, updateUserDto);

    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  async updatePassword(
    @Req() req: AuthenticatedRequest,
    @Body() updatePasswordUserDto: UpdatePasswordUserDto,
  ) {
    const userId = req.user.id;
    const user = await this.userService.updatePassword(
      userId,
      updatePasswordUserDto,
    );

    return new UserResponseDto(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async remove(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const user = await this.userService.remove(userId);
    return new UserResponseDto(user);
  }
}
