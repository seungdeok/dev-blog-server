#!/bin/bash

# 배포 Stage 설정 (deploy를 실행 시 Production 배포 실행)
if [ "$npm_lifecycle_event" == "deploy:dev" ]; then
  stage="dev"
else
  stage="prod"
fi

# serverless 파일 복사
if [ "$stage" == "dev" ]; then
  cp serverless.dev.yaml serverless.yaml
else
  cp serverless.prod.yaml serverless.yaml
fi

# 배포 수행
if [ "$stage" == "dev" ]; then
  sls offline --stage $stage
else
  sls deploy --stage $stage
fi