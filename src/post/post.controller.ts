import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import type { AuthenticatedRequest } from 'src/auth/types/authenticated-request.type';
import { PostResponseDto } from './dto/post-response.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('me')
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() createPostDto: CreatePostDto,
  ) {
    const user = req.user;
    const post = await this.postService.create(createPostDto, user);

    return new PostResponseDto(post);
  }

  @Get()
  async findAllPublished() {
    const posts = await this.postService.findAll({ published: true });
    return posts.map((post) => new PostResponseDto(post));
  }

  @Get(':slug')
  async findOnePublished(@Param('slug') slug: string) {
    const post = await this.postService.findOneOrFail({
      slug,
      published: true,
    });

    return new PostResponseDto(post);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findAllOwned(@Req() req: AuthenticatedRequest) {
    const user = req.user;
    const posts = await this.postService.findAllOwned(user);
    return posts.map((post) => new PostResponseDto(post));
  }
  @UseGuards(JwtAuthGuard)
  @Get('me/:id')
  async findOneOwned(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const user = req.user;
    const post = await this.postService.findOneOwnedOrFail({ id }, user);

    return new PostResponseDto(post);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me/:id')
  async updateOwned(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdatePostDto,
  ) {
    const post = await this.postService.update({ id }, dto, req.user);
    return new PostResponseDto(post);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/:id')
  removeOwned(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const user = req.user;
    return this.postService.remove(id, user);
  }
}
