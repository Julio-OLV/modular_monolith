# Use a imagem base do Node.js 22.x
FROM node:22

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia apenas os arquivos necessários para rodar a aplicação
COPY dist ./dist

# Expõe a porta em que a aplicação irá rodar
EXPOSE 3000

# Define o comando para iniciar a aplicação a partir do build
CMD ["node", "dist/index.js"]
