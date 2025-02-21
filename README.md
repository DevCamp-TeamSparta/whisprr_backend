<p align="center">
  <a href="https://whisprr.spartastudio.app/" target="blank"><img src="https://whisprr.s3.ap-northeast-2.amazonaws.com/images/logo_lg.png" width="300" alt="whisprrlogo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## 📝 Introduction

Whisprrs는 사용자가 하루 동안의 회고 기록을 입력하면 OpenAI의 AI 모델을 활용하여 자동으로 저널을 생성해주는 서비스입니다.매일의 일상과 감정을 기록하고, AI가 이를 정리하여 멋진 일기 형식으로 변환해줍니다.

## 🚀 Features

🏆 AI 기반 자동 저널 작성: AI와의 대화 기록으로 간편하게 저널을 생성

✍️ 감성 분석 및 회고 요약: 회고 내용을 분석하여 감정 기반 맞춤 저널 제공

📅 일별/월별 아카이브 기능: 자동으로 날짜별 저널 저장 및 검색 기능 제공

🌐 구글 인앱 결제 지원: 정기 결제 서비스 지원

## 🛠️ How it Works?

AI와의 회고 및 기록: AI와 대화한 회고 기록이 자동으로 서버를 통해 데이터베이스에 저장됩니다.

AI 기반 저널 작성, 키워드 추출: open AI에 회고 기록을 발신하여 저널을 작성합니다.

저널 수정 및 저장: AI가 작성해준 저널 초안을 사용자가 필요 시 수정하여 저장할 수 있습니다.

저널 목록 및 날짜별 저널 조회: 작성해온 저널을 목록으로 조회할 수 있으며 날짜를 선택해 열람할 수 있습니다.

## 📦 Tech Stack

Backend: Typescript, Nest.js

Database: MySQL, Redis

Deployment: AWS EC2, Docker compose

APIs: OpenAI API, google android developers API

CI/CD: Github actions

Equipment: Nodemailer

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

```

## 💡 Future Plans

🔥 기본 회고 질문 사용자 커스텀 기능

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Website - [https://whisprr.spartastudio.app/](https://whisprr.spartastudio.app/)
