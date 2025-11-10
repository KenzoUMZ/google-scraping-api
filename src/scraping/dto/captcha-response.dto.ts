export class CaptchaResponseDto {
  id!: string; // uuid
  captcha!: boolean;
  message?: string;
}
