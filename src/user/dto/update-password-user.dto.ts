import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordUserDto {
  @IsString({ message: 'Nova senha deve ser uma string' })
  @IsNotEmpty({ message: 'Nova senha não pode estar vazia' })
  @MinLength(6, { message: 'Nova senha deve ter no mínimo 6 caracteres' })
  newPassword: string;
  @IsString({ message: 'Senha atual deve ser uma string' })
  @IsNotEmpty({ message: 'Senha atual não pode estar vazia' })
  @MinLength(6, { message: 'Senha atual deve ter no mínimo 6 caracteres' })
  currentPassword: string;
}
