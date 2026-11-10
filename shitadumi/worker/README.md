# 下積みモード 匿名意見送信 Worker

この Worker はフォームから受け取った内容だけを GitHub Issue に登録します。ブラウザーから氏名・メールアドレス・GitHubアカウント情報は送信しません。

## デプロイ手順（初回のみ）
1. Cloudflare Dashboard で **Workers & Pages → Create → Worker** を選択。
2. Worker 名を `shitadumi-feedback` にする。
3. `worker.js` の内容を貼り付けて Deploy。
4. Worker の Settings → Variables and Secrets で `GITHUB_TOKEN` を Secret として追加。
5. トークンは専用のGitHub botアカウントで発行し、`knotspace/study` リポジトリの Issues: Read and write のみを許可する。
6. Worker URL が `https://shitadumi-feedback.<your-subdomain>.workers.dev` になる場合、`shitadumi/opinion/opinion.js` の API 定数をそのURL + `/feedback` に合わせる。

## 匿名性について
- フォームは投稿者の名前、メールアドレス、GitHubユーザー名を送信しません。
- Issue の作成者として表示されるのは、設定した専用botアカウントです。個人アカウントのPATを使うと、そのアカウント名が表示されるので使用しないでください。
- Cloudflare/GitHubの運用ログやネットワーク情報まで含めた完全な匿名性を保証するものではありません。
- 公開リポジトリにトークンを絶対に置かないでください。
