# ALPACA

> ALgorithm Powerup Along with Coding study Assistance

### 소개

알고리즘 실력 향상을 위한 스터디 서비스
<br>
스터디 일정 관리, 스터디 문제 관리, 공동 문서편집 기능을 통한 소스코드 첨삭 기능을 추가한 알고리즘 스터디 플랫폼

1. solved.ac (https://solvedac.github.io/unofficial-documentation/#/) 비공식 문서 api 사용
2. JDOODLE (https://www.jdoodle.com/ ) 코드 컴파일러 사용
3. yjs docs (https://docs.yjs.dev/ ) 공유 문서 편집기 사용
4. OpenVidu (https://openvidu.io/ ) WebRTC 오픈소스

### 주요 기능

- 코드리뷰 및 동시 편집

![코드리뷰](https://user-images.githubusercontent.com/55776650/170498477-1bd99fea-e36e-4c13-ad79-314662eb4ccb.gif)

<br>

- 화상스터디 & 화면공유 & 타이머

![스터디_라이브](https://user-images.githubusercontent.com/55776650/170498560-d875e866-e8dd-46af-a5e3-0f04164aea61.gif)

<br>

- 코드 컴파일

![컴파일](https://user-images.githubusercontent.com/55776650/170499469-a83f1154-3c95-4869-bc1e-0f2b12c2c095.gif)

### 세부기능

- 전체 스터디 주 단위 관리

![전체_스터디_주_단위_관리](https://user-images.githubusercontent.com/55776650/170499483-dec72bfa-ace0-4d3e-9a0f-db882dd3ad31.gif)

<br>

- 스터디 일정 관리

![월별_스터디_일정_관리](https://user-images.githubusercontent.com/55776650/170499486-356ed2ef-5d00-49a4-abe1-3537b6522bf7.gif)

<br>

- 오늘의 문제 추천

![데일리_문제추천](https://user-images.githubusercontent.com/55776650/170499490-79412fc0-440f-473a-977c-7088b0115177.gif)

<br>

- 채팅

![채팅](https://user-images.githubusercontent.com/55776650/170499493-f3890b21-bc47-404b-b3a8-35fc44af8e61.gif)

<br>

- 문제 관리 및 스터디 멤버의 코드확인

![문제관리](https://user-images.githubusercontent.com/55776650/170499494-af346e74-f774-43f0-b5f0-1d033b5a0f28.gif)

### 아키텍쳐

- 주요 기술스택 &

  ![Typescript](https://img.shields.io/badge/Typescript-3178C6?style=flat&logo=typescript&logoColor=ffffff) ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=ffffff) ![redux](https://img.shields.io/badge/redux-764ABC?style=flat&logo=react&logoColor=ffffff) ![MUI](https://img.shields.io/badge/MUI-%230081CB.svg?style=flat&logo=mui&logoColor=white) ![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=flat&logo=webpack&logoColor=black) ![Figma](https://img.shields.io/badge/figma-%23F24E1E.svg?style=flat&logo=figma&logoColor=white)

  ![Spring](https://img.shields.io/badge/SpringBoot-6DB33F?style=flat&logo=SpringBoot&logoColor=ffffff) ![Gradle](https://img.shields.io/badge/Gradle-02303A.svg?style=flat&logo=Gradle&logoColor=white) ![mysql](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=MySQL&logoColor=ffffff) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white&style=flat-square) ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white&style=flat-square) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=flat&logo=docker&logoColor=white) ![Jenkins](https://img.shields.io/badge/jenkins-%232C5263.svg?style=flat&logo=jenkins&logoColor=white)

<br>

- 아키텍처

![아키텍처](https://lab.ssafy.com/s06-final/S06P31E106/uploads/e36f6c7dd069f8176bb64dbf3733bdf1/아키텍처.jpg)

### 코드 정적분석 결과

![sonarqube](https://lab.ssafy.com/s06-final/S06P31E106/uploads/26ab620b7841693950fdf6e792b5eb47/sonarqube.jpg)

### 설치

#### 개발 환경

- MySQL 8.0.28

  ```mysql
  CREATE DATABASE alpaca default CHARACTER SET UTF8;
  CREATE user `alpaca`@`%` IDENTIFIED BY 'didaudrbs';
  GRANT ALL PRIVILEGES ON `alpaca`.* TO `alpaca`@`%`
  FLUSH PRIVILEGES
  ```

- MongoDB 5.0.7

  - config setting

  ```ini
  # C:\Program Files\MongoDB\Server\5.0\bin\mongod.conf
  ```

  - auth

  ```sh
  mongo
  use admin
  db.createUser({
      user: '****',
      pwd: '****',
      roles: ['userAdminAnyDatabase']
  })
  use admin
  db.auth('****','****')
  use alpaca
  db.createUser({user: "alpaca",
  pwd: "didaudrbs1",
  roles:["readWrite"],
  mechanisms:["SCRAM-SHA-1"]})
  })
  ```

- [Redis](https://github.com/microsoftarchive/redis/releases) 3.0.504 설치

- frontend (`node 16.13.2` / `react: 18.0.0`)

  > node 16.13.2
  >
  > react 18.0.0
  >
  > visual studio code 1.63.2

  ```bash
  # root/frontend
  npm install
  npm start
  ```

- backend

  > OpenJDK 11.0.13
  >
  > Spring-boot 2.6.6
  >
  > IntelliJ IDEA 2021.3.2

  ```
  build by gradle
  ```

#### 배포 환경

- exec 참조

### 사용 예시

### 팀원

- [박준영]([JUNYOUNG31 · GitHub](https://github.com/JUNYOUNG31)) :crown: Frontend

- [강동옥]([okdongdong (Dongok Kang) · GitHub](https://github.com/okdongdong)) Frontend
- [성아영]([Sungayoung · GitHub](https://github.com/Sungayoung)) Frontend
- [양지훈]([Sungayoung · GitHub](https://github.com/Sungayoung)) Backend
- [이승훈]([SeungHunL (LEE) · GitHub](https://github.com/SeungHunL)) Backend
- [정성우]([jsw3788 · GitHub](https://github.com/jsw3788)) Backend
