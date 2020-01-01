# FIGLE
### - Step 1 : 
1. 사용자 정보 검색
2. 매치 기록 검색 

### - 구성도(초안) :

![figle_configure](https://user-images.githubusercontent.com/20256618/71319993-9b9d2080-24e8-11ea-9768-714bddb8f14e.jpg)


### - 검색 플로우 :

0. 시작
1. [WEB/APP]에서 [SERVER]로 검색을 요청한다.
2. [SERVER]는 (PARSER)를 통해 요청을 토대로 메시지를 구성한다.
3. [SERVER]는 [API Collection]에서 [WEB/APP]에서 받은 요청에 관련된 API를 찾는다.
4. [SERVER]는 API에 메시지를 담아 [FIFA ONLINE SERVER]에 요청한다.
5. [SERVER]는 [FIFA ONLINE SERVER]로 부터 받은 메시지를 (PARSER)에게 전달한다.
6. [SERVER]는 (PARSER)로 부터 파싱된 메시지를 [WEB/APP]에 전달한다.
7. [WEB/APP]은 메시지를 분석하여 UI를 갱신한다.
8. 종료

### - 실행 방법:
1. ```npm install```
2. pacakge.json의 start 실행 
   ```react-scripts start```
