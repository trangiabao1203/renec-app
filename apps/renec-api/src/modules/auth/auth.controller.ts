import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiTags,
  BaseValidationPipe,
  Body,
  ClientInfo,
  Controller,
  Post,
  Req,
  Request,
  UsePipes,
} from '@joktec/core';
import { AuthService } from './auth.service';
import { Otp, OTPStatus } from '../otpLogs';
import {
  LoginDto,
  LoginSsoDto,
  RefreshTokenDto,
  RegisterDto,
  ResetDto,
  SendOtpDto,
  SendOtpResponse,
  TokeResponseDto,
  VerifyOtpDto,
  VerifyOtpResponse,
} from './models';

@Controller('auth')
@ApiTags('auth')
@UsePipes(new BaseValidationPipe())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/send')
  @ApiBody({ type: SendOtpDto })
  @ApiOkResponse({ type: SendOtpResponse })
  @ApiExcludeEndpoint()
  async sendOTP(@Body() input: SendOtpDto): Promise<SendOtpResponse> {
    const otp: Otp = await this.authService.send(input);
    if (otp.publicCode === '000000') {
      const verifyOtp = await this.authService.verifyOtp({ publicCode: otp.publicCode, privateCode: otp.privateCode });
      return { activeCode: verifyOtp.activeCode };
    }

    if (otp.status === OTPStatus.ACTIVATED && otp.publicCode !== '000000') {
      // TODO: Implement send OTP in here
      // const msg = `Ma xac thuc cua ban la: ${otp.publicCode}`;
      // await this.smsService.send(otp.phone, msg);
    }
    return {
      publicCode: otp.publicCode,
      privateCode: otp.privateCode,
      retry: otp.retry,
      expiredInSeconds: otp.expiredInSeconds,
    };
  }

  @Post('/verify')
  @ApiBody({ type: VerifyOtpDto })
  @ApiOkResponse({ type: VerifyOtpResponse })
  @ApiExcludeEndpoint()
  async verifyOTP(@Body() input: VerifyOtpDto): Promise<VerifyOtpResponse> {
    const otp: Otp = await this.authService.verifyOtp(input);
    return { activeCode: otp.activeCode };
  }

  @Post('/register')
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ type: TokeResponseDto })
  async register(@Body() input: RegisterDto, @Req() req: Request): Promise<TokeResponseDto> {
    const clientInfo: ClientInfo = req['clientInfo'];
    return this.authService.register(input, clientInfo);
  }

  @Post('/login')
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: TokeResponseDto })
  async login(@Body() input: LoginDto, @Req() req: Request): Promise<TokeResponseDto> {
    const clientInfo: ClientInfo = req['clientInfo'];
    return this.authService.login(input, clientInfo);
  }

  @Post('/login-sso')
  @ApiBody({ type: LoginSsoDto })
  @ApiOkResponse({ type: TokeResponseDto })
  @ApiExcludeEndpoint()
  async loginSSO(@Body() input: LoginSsoDto, @Req() req: Request): Promise<TokeResponseDto> {
    const clientInfo: ClientInfo = req['clientInfo'];
    return this.authService.loginSSO(input, clientInfo);
  }

  @Post('/reset')
  @ApiBody({ type: ResetDto })
  @ApiOkResponse({ type: TokeResponseDto })
  @ApiExcludeEndpoint()
  async reset(@Body() input: ResetDto, @Req() req: Request): Promise<TokeResponseDto> {
    const clientInfo: ClientInfo = req['clientInfo'];
    return this.authService.reset(input, clientInfo);
  }

  @Post('/refresh')
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ type: TokeResponseDto })
  @ApiExcludeEndpoint()
  async refresh(@Body() input: RefreshTokenDto, @Req() req: Request): Promise<TokeResponseDto> {
    const clientInfo: ClientInfo = req['clientInfo'];
    return this.authService.refresh(input, clientInfo);
  }
}
