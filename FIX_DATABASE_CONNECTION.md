# Fix MongoDB Atlas Connection

## Current Issue:
Your connection string has `<db_password>` as a placeholder that needs to be replaced.

## Steps to Fix:

### 1. Update your .env file:
Replace this line in your `.env` file:
```env
MONGODB_URI=mongodb+srv://admin:<db_password>@gradeharvest.gvcnvhi.mongodb.net/?retryWrites=true&w=majority&appName=gradeharvest
```

With this (replace YOUR_ACTUAL_PASSWORD with your real password):
```env
MONGODB_URI=mongodb+srv://admin:YOUR_ACTUAL_PASSWORD@gradeharvest.gvcnvhi.mongodb.net/gradeharvest?retryWrites=true&w=majority&appName=gradeharvest
```

### 2. Important Changes:
- Replace `<db_password>` with your actual MongoDB Atlas password
- Added `/gradeharvest` before the `?` to specify the database name
- Make sure there are no spaces in the connection string

### 3. If you forgot your password:
1. Go to MongoDB Atlas dashboard
2. Click on "Database Access" in the left sidebar
3. Find your user (admin) and click "Edit"
4. Click "Edit Password" 
5. Set a new password (write it down!)
6. Update your .env file with the new password

### 4. Example of correct format:
```env
MONGODB_URI=mongodb+srv://admin:MySecurePassword123@gradeharvest.gvcnvhi.mongodb.net/gradeharvest?retryWrites=true&w=majority&appName=gradeharvest
```

### 5. Security Note:
- Never commit your .env file to version control
- Use a strong password with letters, numbers, and special characters
- Avoid using characters that need URL encoding (like @, #, %, etc.) in passwords

## After fixing the .env file:
1. Save the .env file
2. Restart your server (Ctrl+C then npm start)
3. The database connection should work

## Test the connection:
Once you've updated the .env file, restart the server and you should see:
```
MongoDB Connected: gradeharvest-shard-00-02.gvcnvhi.mongodb.net
```
Instead of the connection error.
