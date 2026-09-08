# Mema Chatbot — GitHub + Vercel Guide

## Path A — GitHub website + Git commands

### 1. Create the repository

Go to GitHub, choose **New repository**, name it something like `mema-chatbot`, and choose Public if your instructor requires a public repository.

Do **not** add another README, `.gitignore`, or license during repository creation because this project already contains those files.

### 2. Open the downloaded project

Unzip the downloaded `mema-chatbot.zip` file.

Open a terminal inside the extracted `mema-chatbot` folder.

### 3. Run these commands

```bash
git init
git add .
git commit -m "Build Mema Chatbot"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/mema-chatbot.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username and use your actual repository URL.

### 4. Verify GitHub

Refresh the repository page. You should see `app`, `README.md`, `package.json`, and the other project files.

There should NOT be a real `.env.local` file or a real API key in the repository.

---

## Path B — GitHub Desktop

1. Install/open GitHub Desktop.
2. Add the extracted `mema-chatbot` folder as an existing repository.
3. Enter a commit message such as `Build Mema Chatbot`.
4. Commit the files.
5. Choose **Publish repository**.
6. Choose the repository name and visibility.
7. Publish it.

---

## Vercel deployment

### 1. Sign in

Open Vercel and sign in with GitHub.

### 2. Import the project

Choose **Add New → Project**, select the `mema-chatbot` GitHub repository, and click **Import**.

The project is already a Next.js application, so Vercel should detect the framework automatically.

### 3. Add the secret

Before deploying, find **Environment Variables** and add:

```text
GROQ_API_KEY = your real Groq API key
```

Select Production, and also Preview/Development if you want the same variable there.

### 4. Deploy

Click **Deploy**.

After deployment finishes, open the `.vercel.app` URL.

### 5. Test

Test all of these:

- Send a normal message.
- Send a second message that depends on the first message.
- Refresh the browser and confirm the chat remains.
- Create a second chat.
- Switch between chats.
- Delete a chat.
- Test the site in an incognito/private browser window.

### 6. If you add/change an environment variable later

Redeploy the project after changing environment variables so the new value is available to the deployment.

---

## Important API/model clarification

The requested combination is possible in this project because Groq provides an OpenAI-compatible API and currently hosts OpenAI's open-weight GPT-OSS models.

The project uses:

- API key: **Groq** (`GROQ_API_KEY`)
- API endpoint: **Groq OpenAI-compatible endpoint**
- Model: **OpenAI GPT-OSS 20B** (`openai/gpt-oss-20b`)

This does **not** use an OpenAI Platform API key.
