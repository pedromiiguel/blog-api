import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome não pode estar vazia' })
  name: string;
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;
  @IsString({ message: 'Senha deve ser uma string' })
  @IsNotEmpty({ message: 'Senha não pode estar vazia' })
  password: string;
}
