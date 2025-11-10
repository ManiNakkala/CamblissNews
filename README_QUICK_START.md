# Cambliss News - Ready to Launch!

## Setup Complete!

All dependencies are installed and environment files are configured. Just add your API keys and run!

---

## Quick Start (3 Steps)

### Step 1: Add API Keys

#### File 1: `.env` (project root)
```bash
# Line 9 - Remove the # and add your key:
VITE_REACT_APP_ELEVENLABS_API_KEY=paste_your_key_here
```

#### File 2: `server/.env` (server folder)
```bash
# Lines 5-6 - Add your Razorpay test keys:
RAZORPAY_KEY_ID=rzp_test_paste_here
RAZORPAY_SECRET=paste_secret_here
```

### Step 2: Run the App
```bash
npm run dev:full
```

### Step 3: Test It
- Open: http://localhost:5173
- Login: `john.doe@example.com` / `password`
- Try voice reading (click speaker icon)
- Try subscription (click Premium button)

---

## Get Your API Keys

### ElevenLabs (Optional - for AI voice)
1. Visit: https://elevenlabs.io/
2. Sign up (free)
3. Profile → API Keys
4. Copy and paste in `.env`

**Note:** App works without this! It will use browser voice automatically.

### Razorpay (Required - for payments)
1. Visit: https://razorpay.com
2. Sign up / Login
3. Settings → API Keys → Generate Test Keys
4. Copy both keys and paste in `server/.env`

**Test Card:** `4111 1111 1111 1111`, CVV: `123`, Expiry: any future date

---

## What's Included

- Multi-language news (10 Indian languages)
- AI voice reading with ElevenLabs
- Premium subscriptions with Razorpay
- Social journalism platform
- User dashboard with Cambliss Points
- Real-time news updates
- Mobile responsive design
- BBC-style professional UI

---

## Project Structure

```
project/
├── .env                          # ← Add ElevenLabs key here
├── server/
│   └── .env                      # ← Add Razorpay keys here
├── START_HERE.txt                # Quick reference
├── SETUP_KEYS.md                 # Detailed setup guide
├── PASTE_KEYS_HERE.md            # Copy-paste instructions
└── QUICKSTART_SUBSCRIPTION.md    # Subscription guide
```

---

## Help Files

- **START_HERE.txt** - Quick reference guide
- **SETUP_KEYS.md** - Detailed setup instructions
- **PASTE_KEYS_HERE.md** - Exactly where to paste keys
- **QUICKSTART_SUBSCRIPTION.md** - 5-minute subscription setup
- **SUBSCRIPTION_SETUP.md** - Complete subscription guide

---

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- React Router
- Razorpay (payments)
- ElevenLabs (AI voice)
- Supabase (database - auto-configured)
- Express (backend server)

---

## Features

### Free Tier
- Basic news access
- Limited voice reading
- 100 Cambliss Points/month
- Community access

### Premium (₹199/month)
- Unlimited premium articles
- Unlimited AI voice reading
- Ad-free experience
- 500 Cambliss Points/month
- Real-time breaking news

### Pro (₹499/month)
- All Premium features
- AI news analysis
- API access
- 1500 Cambliss Points/month
- Priority support

---

## Troubleshooting

**Backend won't start:**
- Make sure Razorpay keys are added
- Check if port 5000 is available
- Run: `cd server && npm install`

**Voice not working:**
- Check ElevenLabs key
- App will fallback to browser voice automatically
- Check browser console for errors

**Payment modal not showing:**
- Wait 5 seconds for Razorpay script to load
- Check if backend is running on port 5000
- Make sure you're logged in

---

## Production Deployment

When ready for production:

1. Get Razorpay live keys (complete KYC)
2. Update `server/.env` with live keys
3. Run `npm run build`
4. Deploy frontend to Vercel/Netlify
5. Deploy backend to your server
6. Update API endpoints

---

## Support

Need help?
- Check documentation files
- Review console logs
- Verify API keys are correct

---

## Security

- .env files are in .gitignore
- Never commit API keys
- Use test keys for development
- Switch to live keys only in production

---

**You're all set! Just paste your API keys and start coding.**

Built with ❤️ by Cambliss Studio
