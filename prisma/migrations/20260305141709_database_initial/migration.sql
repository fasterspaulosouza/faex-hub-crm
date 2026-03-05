-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `senha` VARCHAR(255) NOT NULL,
    `telefone` VARCHAR(20) NULL,
    `documento` VARCHAR(20) NULL,
    `aniversario` DATE NULL,
    `genero` ENUM('MASCULINO', 'FEMININO') NULL,
    `observacao` TEXT NULL,
    `foto` VARCHAR(255) NULL,
    `status` ENUM('NOVO', 'APROVADO') NOT NULL DEFAULT 'NOVO',
    `funcao` ENUM('ADMIN', 'USUARIO', 'PROFESSOR', 'ALUNO') NOT NULL DEFAULT 'USUARIO',
    `departamento` ENUM('CADASTRO', 'CANAL_RELACIONAMENTO', 'COMUNICACAO', 'FINANCEIRO', 'RECURSOS_HUMANOS', 'TECNOLOGIA', 'SEM_DEPARTAMENTO') NOT NULL DEFAULT 'SEM_DEPARTAMENTO',
    `verificado` BOOLEAN NOT NULL DEFAULT false,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(0) NULL,

    UNIQUE INDEX `usuarios_email_key`(`email`),
    UNIQUE INDEX `usuarios_documento_key`(`documento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios_recuperacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(255) NOT NULL,
    `codigo` CHAR(6) NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `resetAt` DATETIME(0) NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_recuperacoes_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios_mfa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `segredo` VARCHAR(255) NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT false,
    `tentativasErro` INTEGER NOT NULL DEFAULT 0,
    `bloqueadoAte` DATETIME(0) NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_mfa_usuarioId_key`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios_mfa_backup_codes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioMfaId` INTEGER NOT NULL,
    `codigoHash` VARCHAR(255) NOT NULL,
    `utilizado` BOOLEAN NOT NULL DEFAULT false,
    `utilizadoEm` DATETIME(0) NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `modulos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `descricao` VARCHAR(255) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(0) NULL,

    UNIQUE INDEX `modulos_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grupos_acesso` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(100) NOT NULL,
    `descricao` VARCHAR(255) NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(0) NULL,

    UNIQUE INDEX `grupos_acesso_nome_key`(`nome`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grupos_acesso_membros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `grupoAcessoId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `grupos_acesso_membros_grupoAcessoId_usuarioId_key`(`grupoAcessoId`, `usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `grupos_acesso_permissoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `grupoAcessoId` INTEGER NOT NULL,
    `moduloId` INTEGER NOT NULL,
    `nivel` ENUM('NENHUM', 'LEITURA', 'ESCRITA', 'EXCLUSAO') NOT NULL DEFAULT 'NENHUM',
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `grupos_acesso_permissoes_grupoAcessoId_moduloId_key`(`grupoAcessoId`, `moduloId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios_permissoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `moduloId` INTEGER NOT NULL,
    `nivel` ENUM('NENHUM', 'LEITURA', 'ESCRITA', 'EXCLUSAO') NOT NULL DEFAULT 'NENHUM',
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `usuarios_permissoes_usuarioId_moduloId_key`(`usuarioId`, `moduloId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `amizades` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `solicitanteId` INTEGER NOT NULL,
    `receptorId` INTEGER NOT NULL,
    `status` ENUM('PENDENTE', 'ACEITO', 'REJEITADO') NOT NULL DEFAULT 'PENDENTE',
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `amizades_solicitanteId_receptorId_key`(`solicitanteId`, `receptorId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `publicacoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `autorId` INTEGER NOT NULL,
    `tipo` ENUM('TEXTO', 'IMAGEM', 'VIDEO') NOT NULL,
    `conteudo` TEXT NULL,
    `midia` VARCHAR(500) NULL,
    `visibilidade` ENUM('PUBLICO', 'AMIGOS') NOT NULL DEFAULT 'AMIGOS',
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `publicacoes_comentarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicacaoId` INTEGER NOT NULL,
    `autorId` INTEGER NOT NULL,
    `conteudo` TEXT NOT NULL,
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `publicacoes_curtidas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicacaoId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `publicacoes_curtidas_publicacaoId_usuarioId_key`(`publicacaoId`, `usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `publicacoes_conhecimento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `autorId` INTEGER NOT NULL,
    `titulo` VARCHAR(255) NOT NULL,
    `descricao` TEXT NULL,
    `urlYoutube` VARCHAR(500) NOT NULL,
    `visibilidade` ENUM('PRIVADO', 'PUBLICO') NOT NULL DEFAULT 'PRIVADO',
    `ativo` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `usuarios_recuperacoes` ADD CONSTRAINT `FK_usuarios_recuperacoes_usuarios` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `usuarios_mfa` ADD CONSTRAINT `FK_usuarios_mfa_usuarios` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `usuarios_mfa_backup_codes` ADD CONSTRAINT `FK_mfa_backup_codes_mfa` FOREIGN KEY (`usuarioMfaId`) REFERENCES `usuarios_mfa`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `grupos_acesso_membros` ADD CONSTRAINT `FK_grupos_acesso_membros_grupos` FOREIGN KEY (`grupoAcessoId`) REFERENCES `grupos_acesso`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `grupos_acesso_membros` ADD CONSTRAINT `FK_grupos_acesso_membros_usuarios` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `grupos_acesso_permissoes` ADD CONSTRAINT `FK_grupos_acesso_permissoes_grupos` FOREIGN KEY (`grupoAcessoId`) REFERENCES `grupos_acesso`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `grupos_acesso_permissoes` ADD CONSTRAINT `FK_grupos_acesso_permissoes_modulos` FOREIGN KEY (`moduloId`) REFERENCES `modulos`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `usuarios_permissoes` ADD CONSTRAINT `FK_usuarios_permissoes_usuarios` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `usuarios_permissoes` ADD CONSTRAINT `FK_usuarios_permissoes_modulos` FOREIGN KEY (`moduloId`) REFERENCES `modulos`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `amizades` ADD CONSTRAINT `FK_amizades_solicitante` FOREIGN KEY (`solicitanteId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `amizades` ADD CONSTRAINT `FK_amizades_receptor` FOREIGN KEY (`receptorId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `publicacoes` ADD CONSTRAINT `FK_publicacoes_usuarios` FOREIGN KEY (`autorId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `publicacoes_comentarios` ADD CONSTRAINT `FK_publicacoes_comentarios_publicacoes` FOREIGN KEY (`publicacaoId`) REFERENCES `publicacoes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `publicacoes_comentarios` ADD CONSTRAINT `FK_publicacoes_comentarios_usuarios` FOREIGN KEY (`autorId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `publicacoes_curtidas` ADD CONSTRAINT `FK_publicacoes_curtidas_publicacoes` FOREIGN KEY (`publicacaoId`) REFERENCES `publicacoes`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `publicacoes_curtidas` ADD CONSTRAINT `FK_publicacoes_curtidas_usuarios` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `publicacoes_conhecimento` ADD CONSTRAINT `FK_publicacoes_conhecimento_usuarios` FOREIGN KEY (`autorId`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
