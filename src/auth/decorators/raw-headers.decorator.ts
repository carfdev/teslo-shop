import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RowHeaders = createParamDecorator((_, ctx: ExecutionContext) => {
  const req: { rawHeaders: string[] } = ctx.switchToHttp().getRequest();

  return req.rawHeaders;
});
