![헤더](https://github.com/sdoram/b4_exhibitions_backend/assets/125722304/8d39b374-f3c4-41a2-97e4-23bf7cfe239a)
# Project-Exhibition-Frontend - <a href="https://github.com/sdoram/b4_exhibitions_backend">Backend 바로가기!</a>
DRF를 기반으로 Machine Learning 기능을 추가한 각종 전시 및 체험활동 예약 및 추천 커뮤니티 사이트
<br>
<br>

## 🖥️ 프로젝트 소개 - <a href="https://www.notion.so/S-A-d04b7899646e45e59da17fbec7cdacfb">S.A. 바로가기!</a>
지금은 전시상황! 프로젝트는 서울 공공서비스 체험, 전시, 그리고 다양한 활동들을 한 눈에 볼 수 있는 웹사이트입니다. 추천 기능을 통해 현재 보고 있는 활동과 비슷한 활동을 추천 받을 수 있고, 해당 활동에 대한 후기를 확인할 수 있습니다. 또한 댓글을 통해 다양한 활동을 함께 할 친구를 구할 수 있는 공간이 마련되어 있습니다.
<br>
<br>

## 🕰️ 개발 기간
* 23.06.05 - 23.07.09
<br>
<br>

## 🧑‍🤝‍🧑 팀원 구성 및 역할 분담
- 팀장😄 <a href="https://github.com/sdoram">김세만</a><br>
[BE] 페이지네이션, 전시 상세 페이지(리뷰, 동행구하기)조회 기능, 검색 기능, 카테고리   
[FE] js 연결(메인, 백오피스 메인, 카테고리, 검색, 로그인, 회원가입, 회원정보 조회 및 수정, 회원탈퇴)
- 팀원😄 <a href="https://github.com/goodminjeong">구민정</a><br> 
[BE] 동행 구하기/신청하기 CUD, 동행 채택 기능, 전시 추천 기능, 인기 전시 조회, 구글로그인   
[FE] js 연결(전시 상세페이지, 추천바, 리뷰/동행구하기/신청하기, 동행 채택, 인기 전시, 구글로그인)
- 팀원😄 <a href="https://github.com/OCmonet">이동현</a><br>
[BE] 회원가입, 로그인, 유저 정보 조회 및 수정, 회원 탈퇴   
[FE] 전체 페이지(html) 및 css 담당
- 팀원😄 <a href="https://github.com/mijinleee">이미진</a><br>
[BE] 리뷰 CUD, 배포(EC2, Docker)   
[FE] 배포(Netlify)
- 팀원😄 <a href="https://github.com/banghyunjae">방현재</a><br>
[BE] 전시 CRUD, 전시 데이터 API 자동 업데이트, 날씨 API   
[FE] 날씨 API, 지도 API
<br>
<br>

## ⚙️ 개발 환경 (Tech Stack)
- **Language** : `Python 3.8.10`
- **IDE** : `Visual Studio Code`
- **Framework** : `Django-Rest-Framework 3.14.0`
- **Database** : `PostgreSQL 15`
- **Packaging-tool** : `requirements.txt`
- **BACKEND** : <a href="https://github.com/sdoram/b4_exhibitions_backend">백엔드 깃허브 바로가기!</a>

### <b>🦊 BE 😼</b>

<img src="https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white"> <img src="https://img.shields.io/badge/django-092E20?style=for-the-badge&logo=django&logoColor=white"> <img src="https://img.shields.io/badge/postgresql-4169E1?style=for-the-badge&logo=postgresql&logoColor=white"> <img src="https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=white"> <img src="https://img.shields.io/badge/scikitlearn-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white"/> <img src="https://img.shields.io/badge/pandas-150458?style=for-the-badge&logo=pandas&logoColor=white"/> <img src="https://img.shields.io/badge/numpy-013243?style=for-the-badge&logo=numpy&logoColor=white"/> <img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/> <img src="https://img.shields.io/badge/gunicorn-499848?style=for-the-badge&logo=gunicorn&logoColor=white"> <img src="https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=nginx&logoColor=white"/> <img src="https://img.shields.io/badge/amazonec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white"/>
<br>
<br>

### <b>😈 FE 👽</b>

<img src="https://img.shields.io/badge/html5-E34F26?style=for-the-badge&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/css-1572B6?style=for-the-badge&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> <img src="https://img.shields.io/badge/netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white"/>
<br>
<br>

### <b>🦝ETC🦄</b>

<img src="https://img.shields.io/badge/visualstudiocode-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white"/> <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"> <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white"> 
<br>
<br>

## 📌 주요 기능
#### 로그인 
- DB값 검증
- 로그인 시 JWT Token 생성
- 소셜 로그인(구글)

#### 회원가입 
- 선택 항목과 필수 항목으로 나눠짐

#### 회원탈퇴
- 회원탈퇴 시 is_active 상태가 true에서 false로 전환

#### 마이페이지
- 프로필 정보 수정(프로필 사진, 비밀번호, 닉네임, 성별, 자기소개)
- 좋아요 누른 전시 조회
- 사용자 본인의 프로필만 수정, 회원탈퇴 버튼이 보임

#### 좋아요 기능
- 메인페이지 또는 상세페이지에서 좋아요 클릭 가능
- 좋아요 누른 게시글은 마이페이지에서 확인 가능함
- 비로그인 사용자는 좋아요 누를 수 없음

#### 메인 페이지 
- 검색 기능 : 게시글의 제목, 내용, 장소를 기준으로 검색할 수 있음
- 전시 종료 날짜가 빠른순으로 정렬되어 있음
- 종료된 전시는 메인페이지에서 확인할 수 없지만 검색 또는 좋아요 누른 게시글 확인 가능
- 현재 예약 가능한 전시 중 좋아요 상위 5개 게시글 보여주는 랭킹바
- 상세보기 클릭 시 상세페이지로 이동
- 예약하기 클릭 시 예약페이지로 이동
- 글 8개마다 페이지네이션 적용

#### 백오피스 메인 페이지 
- is_admin = True인 사용자가 로그인 시 백오피스 메인페이지로 연결됨
- 전시 등록 가능함
- 수정, 삭제 가능하며 이미지 클릭 시 상세페이지로 이동함
- 글 8개마다 페이지네이션 적용

#### 전시 등록, 수정 및 삭제
- 게시글 수정 시 원래 내용 불러오는 기능
- 수정하지 않은 내용은 그대로 다시 DB에 저장됨
- 관자리자만 등록, 수정, 삭제 가능

#### 랭킹바
- 좋아요 개수 상위 5개 게시글을 보여줌
- 현재 예약 가능한 전시로 필터링 함

#### 상세 페이지
- 전시 제목, 장소, 기간, 내용, 이미지 확인 가능
- 우측에 해당 전시와 비슷한 전시를 추천하는 추천 바가 있음
- 이용후기 버튼 클릭 시 후기 작성하기 버튼과 이용후기 목록 뜸
- 동행 구해요! 버튼 클릭 시 동행구하기 버튼과 동행 구하는 글 목록이 뜸
- 예약하기 버튼 클릭 시 예약페이지로 이동함

#### 추천바
- 현재 보고 있는 전시와 비슷한 키워드를 가진 5개의 전시를 추천함
- 클릭 시 해당 전시의 상세페이지로 이동함
- 제목 부분부터 예약하기 버튼 사이에 추천바가 뜨고 스크롤이 예약하기 버튼 아래에 위치할 땐 추천바가 사라짐
- 기능의 존재감을 위해 처음엔 안 보이다가 스크롤을 움직이면 추천바가 보임

#### 이용후기
- 비로그인 사용자는 이용후기 글을 작성할 수 없음
- 닉네임 클릭 시 해당 유저의 페이지로 이동함
- 작성 시 이미지는 선택 사항이며, 내용을 작성하지 않거나 별점을 선택하지 않는 경우 그에 맞는 경고창을 띄움
- 수정 시 원래 데이터를 확인할 수 있음
- 삭제 시 "정말 삭제하시겠습니까?" 확인 창이 뜨고 확인 누르면 삭제, 취소 누르면 삭제되지 않음

#### 동행 구해요!
- 비로그인 사용자는 동행 구하기 글을 작성할 수 없음
- 닉네임 클릭 시 해당 유저의 페이지로 이동함
- 작성 시 목표인원, 동행시간, 내용 작성하지 않는 경우 그에 맞는 경고창을 띄움
- 동행 시간 설정 시 종료시간이 시작시간보다 앞설 수 없음
- 수정 시 원래 데이터를 확인할 수 있음
- 삭제 시 "정말 삭제하시겠습니까?" 확인 창이 뜨고 확인 누르면 삭제, 취소 누르면 삭제되지 않음

#### 동행 신청하기
- 비로그인 사용자는 동행 신청하기 글을 작성할 수 없음
- 닉네임 클릭 시 해당 유저의 페이지로 이동함
- 내용만 작성하면 되고, 내용 작성하지 않은 채로 입력완료 누르면 경고창이 뜸
- 수정 시 원래 데이터를 확인할 수 있음
- 삭제 시 "정말 삭제하시겠습니까?" 확인 창이 뜨고 확인 누르면 삭제, 취소 누르면 삭제되지 않음
- 동행 구해요 글 작성자가 신청글을 달면 안내 문구로 "이런 사람을 구해요!"가 뜨고, 다른 사용자가 글쓰면 "저도 갈래요!" 문구가 뜸

#### 동행 채택하기
- 닉네임 클릭 시 해당 유저의 페이지로 이동함
- 동행 구하기 글을 작성한 사용자는 본인 글에 달린 신청글에 대해 동행 수락을 할 수 있음
- 동행 수락 버튼을 누르면 해당 신청자가 쓴 신청글의 동행 신청 버튼이 취소 버튼으로 바뀌고 수락 도장이 찍힘
- 목표인원이 채워지면 다른 신청자를 수락할 수 없으며 목표인원을 수정하거나 다른 신청자의 수락을 취소해야 함
<br>
<br>

***
💜 [ERD](https://www.erdcloud.com/d/ftoBoJc3WCLvnTqca)
------
ERD 클릭 시 ERDCloud로 연결됩니다.
![image](https://github.com/sdoram/b4_exhibitions_backend/assets/125722304/c20f45f1-3af6-426c-9cf4-26bef0700d6c)
<br>
<br>

***
💚 [API 명세](https://www.notion.so/S-A-d04b7899646e45e59da17fbec7cdacfb?pvs=4#1d8b724ee81745669e6042a4c6076517)
------
API 명세를 클릭해 주세요!
