import {
  ApiBearerAuth,
  ApiBody,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  BaseValidationPipe,
  Body,
  Controller,
  Delete,
  Get,
  JwtGuard,
  Put,
  Req,
  Request,
  UseGuards,
  UsePipes,
} from '@joktec/core';
import { ProfileService } from './profile.service';
import { UserFcmDto, UserLogoutDto, UserPasswordDto, UserProfile, UserProfileDto, UserRevokeDto } from './models';

@Controller('profile')
@ApiTags('profile')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('/')
  @ApiOperation({ summary: `Get Profile` })
  @ApiOkResponse({ type: UserProfile })
  async getProfile(@Req() req: Request): Promise<any> {
    return this.profileService.getProfile(req['payload']);
  }

  @Put('/')
  @ApiOperation({ summary: `Update Profile` })
  @ApiBody({ type: UserProfileDto })
  @ApiOkResponse({ type: UserProfile })
  @UsePipes(new BaseValidationPipe({ skipMissingProperties: true }))
  async updateProfile(@Body() input: UserProfileDto, @Req() req: Request): Promise<UserProfile> {
    return this.profileService.updateProfile(input, req['payload']);
  }

  @Put('/password')
  @ApiOperation({ summary: `Change Password` })
  @ApiBody({ type: UserPasswordDto })
  @ApiOkResponse({ type: UserProfile })
  @UsePipes(new BaseValidationPipe())
  async changePassword(@Body() input: UserPasswordDto, @Req() req: Request): Promise<UserProfile> {
    return this.profileService.changePassword(input, req['payload']);
  }

  @Put('/fcm')
  @ApiOperation({ summary: `Update Registration ID` })
  @ApiBody({ type: UserFcmDto })
  @ApiOkResponse({ type: UserProfile })
  @UsePipes(new BaseValidationPipe())
  async updateRegistrationID(@Body() input: UserFcmDto, @Req() req: Request): Promise<UserProfile> {
    return this.profileService.updateRegistrationID(input, req['payload']);
  }

  @Delete('/')
  @ApiOperation({ summary: `Logout` })
  @ApiOkResponse({ type: UserLogoutDto })
  async logout(@Req() req: Request): Promise<UserLogoutDto> {
    return this.profileService.revokedMe(req['payload']);
  }

  @Delete('/revoke')
  @ApiOperation({ summary: `Revoke session` })
  @ApiBody({ type: UserRevokeDto })
  @ApiOkResponse({ type: UserLogoutDto })
  @ApiExcludeEndpoint()
  @UsePipes(new BaseValidationPipe())
  async revoke(@Body() input: UserRevokeDto, @Req() req: Request): Promise<UserLogoutDto> {
    return this.profileService.revokedOther(input.tokenIds, req['payload']);
  }

  @Delete('/delete')
  @ApiOperation({ summary: `Delete account` })
  @ApiOkResponse({ type: UserLogoutDto })
  async delete(@Req() req: Request): Promise<UserLogoutDto> {
    return this.profileService.deleteAccount(req['payload']);
  }
}
