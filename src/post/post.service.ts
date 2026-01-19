import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { User } from 'src/user/entities/user.entity';
import { createSlugFromText } from 'src/common/utils/create-slug-from-text';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, author: User) {
    const post = this.postRepository.create({
      slug: createSlugFromText(createPostDto.title),
      title: createPostDto.title,
      content: createPostDto.content,
      excerpt: createPostDto.excerpt,
      coverImageUrl: createPostDto.coverImageUrl,
      author,
    });

    const created = await this.postRepository
      .save(post)
      .catch((err: unknown) => {
        if (err instanceof Error) {
          this.logger.error('Erro ao criar post', err.stack);
        }

        throw new BadRequestException('Erro ao criar o post');
      });

    return created;
  }

  async findAll(postDate: Partial<Post>) {
    const posts = await this.postRepository.find({
      where: postDate,
      order: {
        createdAt: 'DESC',
      },
      relations: ['author'],
    });
    return posts;
  }

  async findOne(postDate: Partial<Post>) {
    const post = await this.postRepository.findOne({
      where: postDate,
      relations: ['author'],
    });
    return post;
  }

  async findOneOrFail(postDate: Partial<Post>) {
    const post = await this.findOne(postDate);

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    return post;
  }

  async findAllOwned(author: User) {
    const posts = await this.postRepository.find({
      where: {
        author: { id: author.id },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: ['author'],
    });
    return posts;
  }

  async findOneOwned(postDate: Partial<Post>, author: User) {
    const post = await this.postRepository.findOne({
      where: {
        ...postDate,
        author: { id: author.id },
      },
      relations: ['author'],
    });
    return post;
  }

  async findOneOwnedOrFail(postDate: Partial<Post>, author: User) {
    const post = await this.findOneOwned(postDate, author);

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    return post;
  }

  async update(postData: Partial<Post>, dto: UpdatePostDto, author: User) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Dados não enviados');
    }

    const post = await this.findOneOwnedOrFail(postData, author);

    post.title = dto.title ?? post.title;
    post.content = dto.content ?? post.content;
    post.excerpt = dto.excerpt ?? post.excerpt;
    post.coverImageUrl = dto.coverImageUrl ?? post.coverImageUrl;
    post.published = dto.published ?? post.published;

    return this.postRepository.save(post);
  }

  async remove(postId: string, author: User) {
    const post = await this.findOneOwnedOrFail({ id: postId }, author);
    await this.postRepository.delete({ id: postId, author: { id: author.id } });
    return post;
  }
}
