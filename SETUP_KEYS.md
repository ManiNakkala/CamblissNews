# API Keys Setup Instructions

## Quick Setup (2 minutes)

### 1. ElevenLabs AI Voice (Optional - for enhanced voice reading)

**File:** `.env` (in project root)

1. Go to https://elevenlabs.io/
2. Sign up for free account
3. Go to your profile settings
4. Copy your API key
5. Open `.env` file
6. Find the line: `# VITE_REACT_APP_ELEVENLABS_API_KEY=your_key_here`
7. Remove the `#` and replace `your_key_here` with your actual key
8. Save the file

Example:
```
VITE_REACT_APP_ELEVENLABS_API_KEY=sk_abc123xyz456...
```

**Note:** If you skip this, the app will use browser's built-in voice synthesis (still works great!)

---

### 2. Razorpay Payment Gateway (Required for subscriptions)

**File:** `server/.env` (in server folder)

#### Get Test Keys (for development):
1. Go to https://razorpay.com
2. Sign up / Login
3. Navigate to **Settings** → **API Keys**
4. Click **Generate Test Keys**
5. Copy both:
   - Key ID (starts with `rzp_test_`)
   - Key Secret

#### Add to server/.env:
1. Open `server/.env` file
2. Find these lines:
   ```
   RAZORPAY_KEY_ID=
   RAZORPAY_SECRET=
   ```
3. Paste your keys:
   ```
   RAZORPAY_KEY_ID=rzp_test_abc123xyz
   RAZORPAY_SECRET=your_secret_key_here
   ```
4. Save the file

**Test Card for Development:**
- Card Number: `4111 1111 1111 1111`
- CVV: `123`
- Expiry: Any future date
- This card will NOT charge real money

---

## Running the Application

After adding your keys:

```bash
# Install dependencies (if not already done)
npm install
cd server && npm install && cd ..

# Run both frontend and backend
npm run dev:full
```

Or run separately:

```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
npm run dev
```

---

## Verification

### Check if ElevenLabs is working:
1. Open the app
2. Click on any article
3. Click the voice/speaker icon
4. If you see "AI Voice" badge, it's working!

### Check if Razorpay is working:
1. Login with demo account:
   - Email: `john.doe@example.com`
   - Password: `password`
2. Click "Premium" button in header
3. Select a plan
4. You should see Razorpay checkout modal

---

## Production Keys (When Ready)

### For Live Payments:
1. Complete KYC verification on Razorpay
2. Get live keys (start with `rzp_live_`)
3. Update `server/.env`:
   ```
   RAZORPAY_KEY_ID=rzp_live_your_key
   RAZORPAY_SECRET=your_live_secret
   ```

---

## Troubleshooting

### "Payment system is loading"
- Wait 5 seconds for Razorpay script to load
- Check if backend is running on port 5000

### "Voice not working"
- Check if ElevenLabs API key is correct
- Check browser console for errors
- App will fallback to browser voice automatically

### Backend not starting
- Check if port 5000 is available
- Make sure you added Razorpay keys
- Check server console for error messages

---

## File Locations

```
project/
├── .env                    # Frontend env (ElevenLabs key)
└── server/
    └── .env               # Backend env (Razorpay keys)
```

---

## Security Notes

- NEVER commit `.env` files to git
- Keep your secret keys confidential
- Use test keys during development
- Switch to live keys only in production
- The `.env` files are already in `.gitignore`

---

## Need Help?

Check these documentation files:
- `QUICKSTART_SUBSCRIPTION.md` - Quick start guide
- `SUBSCRIPTION_SETUP.md` - Detailed setup
- `README_SUBSCRIPTION.md` - Complete overview

---

**That's it! Just paste your keys and you're ready to go.**
