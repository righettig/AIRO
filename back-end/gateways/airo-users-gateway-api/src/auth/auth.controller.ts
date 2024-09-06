import { Body, Controller, Post } from '@nestjs/common';
import { SignupDto } from './models/signup.dto';

@Controller('auth')
export class AuthController {
  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    // handle signup logic here
    return true;
  }
}
