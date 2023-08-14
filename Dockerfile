FROM public.ecr.aws/lambda/nodejs:18

COPY package*.json .
RUN npm install

ADD dist ./dist

ENV NODE_ENV='production'

CMD ["dist/lambda.handler"]