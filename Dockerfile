# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /app

# package.json を先にコピー（キャッシュ効く）
COPY package*.json ./

# 依存関係インストール
RUN npm install

# アプリ本体コピー
COPY . .

# Next.js をビルド
RUN npm run build


# --- Production Stage ---
FROM node:20-alpine AS runner

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "run", "start"]