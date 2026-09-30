RUDRA AI v2 — Mobile Voice Assistant

এটি একটি মোবাইল-ফ্রেন্ডলি PWA starter:
- animated AI orb/avatar
- বাংলা speech-to-text (browser support থাকলে)
- AI text reply
- বাংলা text-to-speech
- installable app-like interface
- quick action buttons

চালানো:
1. Node.js থাকা computer/server-এ folder খুলুন
2. npm install
3. .env.example কপি করে .env করুন
4. OPENAI_API_KEY=আপনার key
5. চাইলে OPENAI_MODEL=gpt-5.6-luna
6. npm start
7. ফোনে HTTPS URL খুলুন
8. Chrome menu → Add to Home screen / Install App

নোট: ফোনে একেবারে standalone app চালাতে হলে server-টি অনলাইনে deploy করতে হবে। API key কখনো frontend-এ রাখবেন না।
