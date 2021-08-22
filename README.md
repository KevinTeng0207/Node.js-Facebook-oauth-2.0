# Node.js-Facebook-oauth-2.0
## 安裝套件
```
npm install express
npm install passport
npm install axios
npm install fs
npm install https
npm install request
npm install cors
```
## Config

## **檔案名稱：config.json**
facebook_client_id 跟 facebook_secret_id 自行設定
```json
{
    "Facebook": {
        "facebook_client_id": "",
        "facebook_secret_id": "",
        "facebook_redirect_uri": "https://localhost:4000/facebookcallback"
    }
}
```
## 執行

```
node index.js
```