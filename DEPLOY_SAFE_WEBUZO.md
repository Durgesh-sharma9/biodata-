# 🚀 HireHub (hirehub.webncode.in) - Safe Deployment Guide

Ye guide Webuzo Server par **HireHub** ko bina kisi risk ke update karne ke liye hai.
Is process se server par chal rahe baki kisi bhi project (`campuscrm`, `testmaster`, `feeflow`, `wbpro`, etc.) par koi effect nahi padega.

---

## ⚡ 1. Quick One-Liner (Fastest & Safest)
Agar server par koi extra code edit nahi kiya gaya hai, toh Webuzo Terminal me direct ye ek line run karein:

```bash
cd /home/webncode/public_html/hirehub && git pull origin main && cd client && npm install && npm run build && cd .. && chown -R webncode:webncode /home/webncode/public_html/hirehub
```

---

## 📋 2. Step-by-Step Safe Execution

### Step 1: Sirf HireHub Folder me jaayein
```bash
cd /home/webncode/public_html/hirehub
```
> **Security Note:** Hum specifically `/home/webncode/public_html/hirehub` ke andar execute kar rahe hain, isliye baki folders bilkul untouched aur safe rahenge.

---

### Step 2: Git Conflicts Se Bachte Hue Pull Karein
Agar server par koi local file modified ho:
```bash
git stash
git pull origin main
```

---

### Step 3: Frontend (Client) Build Karein
```bash
cd client
npm install
npm run build
cd ..
```

---

### Step 4: Backend PM2 Process Restart Karein (Sirf HireHub)
Pehle check karein HireHub ka process name kya hai:
```bash
pm2 list
```
Fir sirf HireHub process ko restart karein:
```bash
pm2 restart hirehub
```
*(Agar process name alag hai jaise `biodata-server` ya `hirehub-backend`, toh wahi naam daalein. Baki apps safely chalte rahenge).*

---

### Step 5: Webuzo File Permissions Fix Karein
Webuzo user (`webncode`) ko ownership ensure karne ke liye:
```bash
chown -R webncode:webncode /home/webncode/public_html/hirehub
```

---

## 🛠️ Troubleshooting & Safety Checks

| Problem | Safe Solution |
| :--- | :--- |
| **Git error: Local changes would be overwritten** | `git stash` chalayein aur fir `git pull origin main` karein. |
| **Node / NPM build me memory error** | `NODE_OPTIONS="--max-old-space-size=1024" npm run build` chalayein. |
| **Changes website par nahi dikh rahe** | Browser me `Ctrl + Shift + R` (Hard Refresh) karein ya Cloudflare / Server cache purge karein. |
| **PM2 me process nahi mila** | `pm2 list` karke id ya correct name check karein, ya server directory me jaakar `pm2 restart server/src/index.js --name hirehub` karein. |

---

## 🔒 Safety Guarantee
- Har command `hirehub` path ke context me scoped hai.
- Root path (`/var/www`, `/home/webncode/public_html` ke baki folders) me koi delete/overwrite command nahi hai.
- Webuzo user permissions sirf `hirehub` directory par apply hoti hain.
