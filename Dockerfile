FROM public.ecr.aws/lambda/nodejs:18

RUN npm install -g yarn

COPY package*.json .
COPY yarn.lock .
RUN yarn install

COPY . .

RUN npm run build

CMD ["dist/lambda.handler"]