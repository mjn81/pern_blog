import { Expose } from 'class-transformer';
export class ResponseDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  token: string;
}
