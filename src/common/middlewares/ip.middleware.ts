import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

@Injectable()
export class RemoteAddrMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.ip?.replace('::ffff:', '') ||
      req.socket.remoteAddress?.replace('::ffff:', '')

    console.log('IP do cliente:', ip)

    req['clientIp'] = ip
    next()
  }
}
