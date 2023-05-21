import { ApiProperty, IsNotEmpty, IsUrl } from '@joktec/core';

export class YoutubeRequest {
  @IsUrl()
  @IsNotEmpty()
  @ApiProperty({ description: 'Youtube URL' })
  url: string;
}

export class YoutubeResponse {
  @ApiProperty({ description: 'Youtube URL' })
  url!: string;

  @ApiProperty({ description: 'Title of video' })
  title!: string;

  @ApiProperty({ description: 'Description of video' })
  description!: string;

  @ApiProperty({ description: 'Thumbnail url of video' })
  thumbnail!: string;
}
