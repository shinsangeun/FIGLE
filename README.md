# FIGLE

### Step 1 : 
1. 사용자 정보 검색
2. 매치 기록 검색 

### 구성도(초안) :

![figle_configure](https://user-images.githubusercontent.com/20256618/71962331-893b1a80-323c-11ea-892a-e1747bf7d422.jpg)


### 검색 플로우 :

0. 시작
1. 웹이나 앱에서 [WEB Manager]로 Request 한다.
2. [WEB Manager]는 요청에 따라 [Messenger]로 데이터를 전달한다.
3. [Messenger]는 [WEB Manager]으로부터 검색 요청 및 API 기능 호출을 받았을 경우 (API Collection)을 열람한다.
4. [Messenger]는 (Parser)를 통해 API 형식에 맞게 메시지를 파싱한 후 [FIFA ONLINE SERVER]로 전송한다.
5. [Messenger]는 [FIFA ONLINE SERVER]로 부터 받은 메시지를 (Parser)를 통해 파싱한 후 [WEB Manager]로 결과를 전달한다.
6. [WEB Manager]는 요청한 결과 값을 업데이트한다 (UI 갱신)
7. 종료


### 실행 방법:
1. ```npm install```
2. pacakge.json의 start 실행 
   ```react-scripts start``` 또는 npm start


### 출처:
- 템플릿 출처: https://www.creative-tim.com/product/argon-dashboard-react#


### 학습 참고 사이트:
- http://wiki.sys4u.co.kr/pages/viewpage.action?pageId=8553032
- https://medium.com/@ca3rot/%EB%A6%AC%EC%95%A1%ED%8A%B8-%EB%9D%BC%EC%9A%B0%ED%84%B0%EA%B0%80-%EA%B5%90%ED%99%98%EC%9B%90%EC%9D%B4%EB%9D%BC%EB%A9%B4-71ccdd296fc4
- https://medium.com/the-andela-way/understanding-the-fundamentals-of-routing-in-react-b29f806b157e 

--- 
### 스크린샷:
- 유저 아이디 검색
![search](/Images/search.png)

- 유저 아이디 게임 목록 조회


- 게임 상세 조회


