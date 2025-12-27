# Email Verification Setup Guide

## Configuration

To enable email verification, you need to configure SMTP settings in your `.env` file.

### 1. Create `.env` file in the backend directory

Copy the `.env.example` file and fill in your email credentials:

```env
# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 2. Gmail Setup (Recommended)

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Go to App Passwords: https://myaccount.google.com/apppasswords
4. Generate an App Password for "Mail"
5. Use this App Password as `SMTP_PASS` (not your regular password)

### 3. Other Email Providers

**Outlook/Hotmail:**
```env
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

**Yahoo:**
```env
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

**Custom SMTP:**
```env
SMTP_HOST=your-smtp-server.com
SMTP_PORT=587
SMTP_USER=your-email@domain.com
SMTP_PASS=your-password
```

## How It Works

1. **User Registration**: When a user signs up, a verification email is sent to their email address
2. **Email Verification**: User clicks the link in the email to verify their account
3. **Login Restriction**: Users cannot login until they verify their email
4. **Resend Email**: Users can request a new verification email if needed

## Testing

To test email functionality:
1. Sign up with a real email address
2. Check your inbox (and spam folder) for the verification email
3. Click the verification link
4. Try logging in

## Troubleshooting

- **Emails not sending**: Check your SMTP credentials and ensure your email provider allows SMTP access
- **Gmail issues**: Make sure you're using an App Password, not your regular password
- **Link not working**: Check that `FRONTEND_URL` in `.env` matches your frontend URL

