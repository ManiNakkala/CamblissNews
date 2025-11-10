# Copy & Paste Your API Keys Here

## File 1: `.env` (Root Folder)

Open the file `.env` in the project root folder and find this section:

```env
# ElevenLabs API Configuration
# Get your API key from: https://elevenlabs.io/
# Sign up for free tier or subscribe for more usage
# PASTE YOUR KEY BELOW (remove the # and add your key):
# VITE_REACT_APP_ELEVENLABS_API_KEY=your_key_here
```

**Change line 9 from:**
```
# VITE_REACT_APP_ELEVENLABS_API_KEY=your_key_here
```

**To:**
```
VITE_REACT_APP_ELEVENLABS_API_KEY=sk_abc123xyz789paste_your_actual_key
```

(Remove the `#` and replace `your_key_here` with your real ElevenLabs API key)

---

## File 2: `server/.env` (Server Folder)

Open the file `server/.env` in the server folder and find these lines:

```env
# Test Mode Keys (for development)
RAZORPAY_KEY_ID=
RAZORPAY_SECRET=
```

**Change from:**
```
RAZORPAY_KEY_ID=
RAZORPAY_SECRET=
```

**To:**
```
RAZORPAY_KEY_ID=rzp_test_abc123xyz789paste_your_key_id
RAZORPAY_SECRET=paste_your_secret_key_here
```

(Paste your actual Razorpay Test Keys)

---

## Get Your API Keys

### ElevenLabs (Optional - AI Voice):
1. Go to https://elevenlabs.io/
2. Sign up (free)
3. Go to Profile → API Keys
4. Copy your key (starts with `sk_`)
5. Paste in `.env` file

### Razorpay (Required - Payments):
1. Go to https://razorpay.com
2. Sign up / Login
3. Go to Settings → API Keys
4. Click "Generate Test Keys"
5. Copy both Key ID and Secret
6. Paste in `server/.env` file

---

## Test Cards (For Development)

Use these test cards to try payments:

**Success Card:**
- Number: `4111 1111 1111 1111`
- CVV: `123`
- Expiry: Any future date (e.g., 12/25)

**Failure Card:**
- Number: `4000 0000 0000 0002`
- CVV: `123`
- Expiry: Any future date

---

## Run the App

After pasting your keys:

```bash
npm run dev:full
```

Or run separately:
```bash
# Terminal 1
cd server
npm start

# Terminal 2 (new terminal)
npm run dev
```

---

## Demo Login

Email: `john.doe@example.com`
Password: `password`

---

## That's It!

Just paste your keys and start the app. The voice reading and payment features will work automatically.
