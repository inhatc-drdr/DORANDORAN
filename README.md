# <p align="center">Real-Time-Online-Class-Platform</p>

<p align="center">
<img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/>
<img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/>
<img src="https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=Postman&logoColor=white"/>
</p>

## 💻 프로젝트 설명

COVID-19로 수업 방식이 오프라인에서 온라인으로 변화함에따라 온라인 플랫폼의 사용 빈도가 증가하였다. 이에 효율적인 온라인 수업을 진행할 수 있는 플랫폼을 구현하였다.

본 프로젝트의 목표는 캘린터를 통해 온라인 수업(화상 강의)를 예약 및 조회할 수 있는 플랫폼을 구현하는 것이다.

![Alt Text](/images/video.gif)

## ⚙ HOW TO USE

NPM 모듈 설치

```
npm install
```

실행

```
npm run dev
```

Open http://localhost:3000 in browser

## 🔧 프로젝트 구조

```
DEMO-NODE
⊢ models    // DB 관련 스키마, 연결 코드
⊢ config    // crypto, passport 등 모듈
⊢ routes    // 라우터
⊢ app.js    // 서버
⊢ package.json
⊢ nodemon.json
⊢ babel.cofing.json
⊢ .env      // 환경변수, 비밀번호 등 보호되어야할 정보들이 담긴 파일
⊢ readme.md
⊢ setting  // 설정 정리 파일
⊢ images  // 이미지 파일
```

### 🗂️ 메뉴 구조 및 기능

![menuStructure](https://user-images.githubusercontent.com/80824750/179705391-408ee6c3-5edf-4000-b7ca-5d68a368d18e.png)
![menuFeatures](https://user-images.githubusercontent.com/80824750/179705376-009530ec-840a-40bc-b809-8c0cdbf9fbc4.png)

### 📑 DB 설계

![DB](https://user-images.githubusercontent.com/80824750/179705494-f8dbf7ee-6b7b-4bd0-ab89-4310a30bd0df.png)

## 📈 ROUTES

| Name           | Description                           |
| -------------- | ------------------------------------- |
| send           | Response 전송                         |
| auth           | 계정관련 전반적인 기능                |
| jwt            | jwt 발급, 유효성 검사                 |
| setting        | 계정 정보 조회 및 이름, 비밀번호 변경 |
| home           | 서버 목록(검색 가능) 조회             |
| required       | 서버 접근 권한 검사                   |
| server         | 서버 접속 및 정보 조회, 추가          |
| notice         | 공지 목록 및 상세 내용 조회, 추가     |
| calendar       | 일정 목록 및 상세 내용 조회, 추가     |
| member         | 서버 수강생 조회, 초대, 삭제          |
| video          | 화상강의 참여 수강생 이름 조회        |
| socket, Logger | 화상강의 socket                       |

## 📃 LICENSE

📱 WebRTC P2P : [MiroTalk](https://github.com/miroslavpejic85/mirotalk)

<details>
<summary>License</summary>

<br/>

![AGPLv3](https://user-images.githubusercontent.com/80824750/179705560-0e4c9fdc-9217-4c75-b6bf-d7a1a2b30a3d.png)

MiroTalk is free and can be modified and forked. But the conditions of the AGPLv3 (GNU Affero General Public License v3.0) need to be respected. In particular modifications need to be free as well and made available to the public. Get a quick overview of the license at [Choose an open source license](https://choosealicense.com/licenses/agpl-3.0/).

</details>

<details>
<summary>수정 및 사용 파일</summary>

<br/>

| MiroTalk | 프로젝트 적용 | 설명                 |
| -------- | ------------- | -------------------- |
| server   | app           | https server         |
| server   | socket        | webRTC socket server |
| Logger   | Logger        |                      |

</details>

## ✅ 추후 구현 예정

    - 서버, 공지, 일정 삭제 기능
    - 채팅 기능
