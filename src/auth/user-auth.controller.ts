import {
  Controller,
  Post,
  Body,
  Res,
  Param,
  ParseIntPipe,
  HttpCode,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UserAuthService } from './user-auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { SigninUserDto } from '../users/dto/signin-user.dto';
import { Response } from 'express';
import { CookieGetter } from '../common/decorators/cookie-getter.decorator';
import { CrudGuard } from '../common/guards/crud.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('User Auth')
@Controller('auth/user')
export class UserAuthController {
  constructor(private readonly userAuthService: UserAuthService) {}

  @Post('signup')
  @UseGuards(CrudGuard)
  @ApiOperation({ summary: 'User signup' })
  @ApiResponse({ status: 201, description: 'User signed up successfully' })
  signup(@Body() dto: CreateUserDto) {
    return this.userAuthService.signup(dto);
  }

  @HttpCode(200)
  @Post('signin')
  @ApiOperation({ summary: 'User signin' })
  @ApiResponse({ status: 200, description: 'User signed in successfully' })
  signin(
    @Body() dto: SigninUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userAuthService.signin(dto, res);
  }

  @HttpCode(200)
  @Post(':id/refresh')
  // @UseGuards(BaseAuthGuard)
  @ApiOperation({ summary: 'Refresh JWT tokens' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  refresh(
    @Param('id', ParseIntPipe) id: number,
    @CookieGetter('refreshToken') refreshToken: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('refreshToken from cookie:', refreshToken);
    return this.userAuthService.refreshToken(id, refreshToken, res);
  }

  @HttpCode(200)
  @Post(':id/signout')
  // @UseGuards(BaseAuthGuard)
  @ApiOperation({ summary: 'User signout' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'User signed out successfully' })
  signout(
    @Param('id', ParseIntPipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.userAuthService.signout(id, res);
  }

  @HttpCode(200)
  @Get('activate/:activation_link')
  @ApiOperation({ summary: 'Activate user account by link' })
  @ApiParam({ name: 'activation_link', type: String })
  @ApiResponse({ status: 200, description: 'Account activated successfully' })
  activate(@Param('activation_link') activation_link: string) {
    return this.userAuthService.activate(activation_link);
  }
}
