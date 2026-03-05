import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'
import { LogInterceptor } from './common/interceptors/log.interceptor'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      const allowedOrigins = ['http://localhost:3000']

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        console.warn(`Bloqueado pelo CORS: ${origin}`)
        callback(new Error('Origem não permitida pelo CORS'))
      }
    },
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  })

  const config = new DocumentBuilder()
    .setTitle('FAEX HUB')
    .setDescription('API Sistema FAEX HUB.')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, document)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  app.useGlobalInterceptors(new LogInterceptor())

  // Habilitar recuperação do IP do cliente
  const httpAdapter = app.getHttpAdapter()
  const instance = httpAdapter.getInstance()
  instance.set('trust proxy', 1)

  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
