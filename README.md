# 專案說明文件

此專案為使用 React 與 TypeScript 開發之應用程式，並配置了適合開發與自動化部署的設定。

## 快速開始

**先決條件**: 確保已安裝 Node.js (推薦 v22 以上)。

### 1. 安裝與執行

首先，安裝所有相依套件：
```bash
npm install
```

如需使用金鑰或環境變數，請參考 `.env.example` 建立 `.env*` 檔案。

然後啟動開發伺服器：
```bash
npm run dev
```

### 2. GitHub Actions 自動部署

本專案已設定 GitHub Actions，只要推播 (Push) 程式碼至 `main` 分支，便會自動進行建置並發布至 GitHub Pages。
工作流程設定檔位於：`.github/workflows/deploy.yml`。
**注意**：請確保 GitHub 儲存庫設定已開啟 GitHub Pages 功能 (Settings > Pages > Build and deployment > Source 選擇 GitHub Actions)。

### 3. .gitignore 設定

專案已預先設置了詳細的 `.gitignore` 規則，幫助排除編譯輸出 (例如 `dist/`)、安裝套件 (例如 `node_modules/`)、環境變數檔案 (例如 `.env`) 以及各作業系統的無用與暫存檔案，確保儲存庫的純淨度與隱私資訊安全。
