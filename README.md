# 도란도란

담당 Skills & 사용 라이브러리: <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=Node.js&logoColor=white"/> <img src="https://img.shields.io/badge/express-339933?style=flat-square&logo=Node.js&logoColor=white"/> <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/> <img src="https://img.shields.io/badge/WebRTC-FF6C37?style=flat-square&logo=L&logoColor=white"/> <br/>
진행기간: 2022년 3월 2일 → 2022년 5월 31일  <br/>
팀 구성: 백엔드 1명, 프론트엔드 2명  <br/>
한 줄 소개: 편리한 온라인 수업 일정 관리를 위해 캘린더 서비스를 도입한 실시간 온라인 수업 플랫폼 <br/>

### Link

**구현 영상**

[도란도란 실시간 온라인 수업 플랫폼](https://www.youtube.com/watch?v=VXXxPEaxOw0)

### 상세내용
![456](https://user-images.githubusercontent.com/80824750/194249116-0e692461-a914-4210-a6ac-40ea1735fd0c.png)


🏫 교내 캡스톤 디자인 과목에서 진행한 프로젝트입니다. 도란도란은 COVID-19 이후 증가한 온라인 수업을 위한 **실시간 온라인 수업 플랫폼**입니다. 캘린더를 통해 화상 강의 예약 및 조회가 가능하게 함으로써 온라인 수업 일정을 쉽게 관리할 수 있도록 하고자 개발하게 되었습니다. 도란도란은 수업 서버 개설, 수강생 초대, 공지, 일정 생성 및 관리 기능을 제공합니다.


### 사용 기술 및 라이브러리

- NodeJS, express
- MySQL
- WebRTC
- Ubuntu 18.0, NCP
- vscode, DBeaver, MobaXterm, Postman

### 담당한 기능 (BackEnd Server)

- **DB** 설계
- **프로젝트 전반의 API** 개발
    - 로그인, 회원가입, 메인화면
    - 회원, 공지, 일정 기능
- **WebRTC Open Source**를 이용하여 **화상강의** 구현

### 깨달은 점

- 프로젝트 **기획서, 화면 설계서** 작성 과정을 통해 프로젝트 기획 단계의 중요성을 알았다.
- Back-End 와 Front-End 를 분리하여 개발함으로써 **REST API** 에 대한 이해를 하였다.
- 개발한 서버 API를 프론트엔드에 제공하기 위한 방법을 고민하였으며, 그 결과 **Notion** 을 이용하여 API를 문서화 하여 제공하였다.
- WebRTC 를 적용하면서 **Open Source** 를 사용해볼 수 있었다.

### 사용한 OpenSource 에 관한 LICENSE

📱 WebRTC P2P : [MiroTalk](https://github.com/miroslavpejic85/mirotalk)

<details>
<summary>License</summary>

<br/>

![AGPLv3](https://user-images.githubusercontent.com/80824750/179705560-0e4c9fdc-9217-4c75-b6bf-d7a1a2b30a3d.png)

MiroTalk is free and can be modified and forked. But the conditions of the AGPLv3 (GNU Affero General Public License v3.0) need to be respected. In particular modifications need to be free as well and made available to the public. Get a quick overview of the license at [Choose an open source license](https://choosealicense.com/licenses/agpl-3.0/).

</details>
