# Simon's Cat Mini-App Backend


### Raids Endpoints

#### GET /raids/getLeaderBoard
- Description: Get the leaderboard of the raids, NOTE: Only the top 10 players are returned.
- url: http://localhost:3075/api/raid/getLeaderboard

- Response:
```json
{
  "ok": true,
  "data": [
    {
      "userName": "SimonsCat",
      "points": 456898,
      "imgLink": "https://pbs.twimg.com/profile_images/1818648009560698880/W1Xr6uJg_400x400.jpg",
      "position": 1
    }
  ]
}
```

#### GET /raids/getAvailableRaids
- Description: Get the available raids. If the user is not connected to twitter, we dont show his position
- url: http://localhost:3075/api/raid/getAvailableRaids
- params: 
  - tgUserId: string (optional) - The telegram user id of the user
- Response:
- 
```json
{
  "status": true,
  "data": [
    {
      "id": "d2e7cc46-ecf6-443e-985b-392eac5419e5",
      "link": "https://twitter.com/SimonsCatMeme/status/1836704398803890481",
      "createdAt": "2024-09-19T09:54:47.704Z",
      "validUntil": "2024-09-20T09:54:47.704Z",
      "text": "$CAT SZN on Telegram, that’s THE TWEET 😼\n\nPat the cat, tap the tap 😽 https://t.co/6x397R1E52",
      "userRaids": [
        {
          "userId": "456898",
          "raidProof":"https://x.com/userName/status/1836704398803890481",
          "status": "PENDING | SUBMITTED | ACCEPTED | REJECTED",
          "points": 100
        }
      ]
    }
  ]
}
```

#### POST /raids/connectTwitter
- Description: Connect the telegram user with the Twitter user.
- url: http://localhost:3075/api/raid/connectTwitter
- body: 
```json
{
  "tgUserId": "1166240",
  "twitter": {
    "userId": "123456",
    "username": "0xBlasco",
    "image": "https://pbs.twimg.com/profile_images/144031234234234234/0xBlasco_400x400.jpg"
  }
}
```

#### POST /raids/submitRaidProof
- Description: Submit the raid proof.
- url: http://localhost:3075/api/raid/submitRaid
- body: 
```json
{
  "tgUserId": "1166240",
  "raidId": "d2e7cc46-ecf6-443e-985b-392eac5419e5",
  "tweetLink": "https://twitter.com/0xBlasco/status/144031234234234234"
}
```
