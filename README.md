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

###  Backend  
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)  
###  Database  
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)  ![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)  
###  Deployment  
![AWS EC2](https://img.shields.io/badge/AWS_EC2-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)  ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)  
###  APIs  
![OpenAI API](https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=openai&logoColor=white)  ![Google Android Developers API](https://img.shields.io/badge/Google_Android_Developers-3DDC84?style=for-the-badge&logo=android&logoColor=white)  
###  CI/CD  
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)  
###  Equipment  
![Nodemailer](https://img.shields.io/badge/Nodemailer-009688?style=for-the-badge&logo=gmail&logoColor=white)


# 🎚️ Achitecture 

<p align="center">
  <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FQKc44%2FbtsMqKcxTYb%2FFOhKrUOnKuUCCsWp6zZ581%2Fimg.png" width="700" alt="whisprrlogo"/>
</p>



# 🔧 Installation & Setup

### 1. source code clone
```bash
$ git clone https://github.com/DevCamp-TeamSparta/whisprr_backend.git
$ cd whisprr_backend
```

### 2. docker and docker compose installation in ubuntu 
```bash
$ sudo apt update -y
$ sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
$ sudo add-apt-repository "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

$ sudo apt update -y
$ sudo apt install -y docker-ce docker-ce-cli containerd.io
$ sudo systemctl start docker
$ sudo systemctl enable docker

$ sudo usermod -aG docker $USER
$ newgrp docker
```

```bash
$ sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

$ sudo chmod +x /usr/local/bin/docker-compose
```

### 3. Build and run the project

```bash
$ docker compose build
$ docker compose up
```

## 💡 Future Plans

🔥 기본 회고 질문 사용자 커스텀 기능

## 🔗 Links

- Project notion: https://www.notion.so/teamsparta/Whisprr-1752dc3ef514802aac1afe3fd4308850

- Landing page: https://whisprr.spartastudio.app/

## Stay in touch

- Website - [https://whisprr.spartastudio.app/](https://whisprr.spartastudio.app/)

