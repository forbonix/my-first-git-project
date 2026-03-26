# ThaniyamHub - Premium Millets Online Store

ThaniyamHub is a premium online store for high-quality, organic millets. This project has been migrated from a Firebase-hosted environment to a local PHP/MySQL stack, optimized for XAMPP.

## 🚀 Getting Started

### Prerequisites
- **XAMPP** (or any local Apache/PHP/MySQL server)
- **Firebase Account** (for Authentication)

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ThaniyamHub.git
   ```
   Move the project folder to your XAMPP `htdocs` directory (e.g., `C:\xampp\htdocs\ThaniyamHub`).

2. **Database Setup**:
   - Start **XAMPP Control Panel** and enable **Apache** and **MySQL**.
   - Open **phpMyAdmin** (`http://localhost/phpmyadmin`).
   - Create a new database named `thaniyamhub`.
   - Import the `backend/schema.sql` file into the `thaniyamhub` database.

3. **Backend Configuration**:
   - Open `backend/db.config.php`.
   - Ensure the database credentials match your local setup (default is usually `localhost`, `root`, no password).

4. **Firebase Configuration**:
   - Open `js/firebase-config.js`.
   - Replace the placeholders with your actual Firebase project configuration (from Firebase Console > Project Settings > General > Your Apps).
   - Ensure **Email/Password** and **Google** authentication are enabled in your Firebase Authentication settings.

5. **Run the App**:
   - Navigte to `http://localhost/ThaniyamHub` in your browser.

## 🛠️ Built With
- **Frontend**: HTML5, Vanilla CSS, JavaScript
- **Backend**: PHP 7.4+
- **Database**: MySQL
- **Authentication**: Firebase Auth (v8 SDK)

## 📁 Project Structure
- `backend/`: PHP API endpoints and database configuration.
- `css/`: Styling files.
- `js/`: Global logic, Firebase configuration, and cart system.
- `images/`: Product images and assets.
- `*.html`: Frontend pages (Shop, Cart, Checkout, Admin, Profile, etc.).

## 🔐 Admin Access
To access the Admin Dashboard:
1. Register/Login as a user.
2. Manually update your role to `admin` in the `users` table of the `thaniyamhub` database.
3. Refresh the page to see the Admin Dashboard link in the account dropdown, or navigate to `admin.html`.

## 📄 License
This project is licensed under the MIT License.
