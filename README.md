Description

NextGen Shopping Cart is a web-based application for browsing products, adding them to a cart, and proceeding to checkout. It uses HTML, CSS, JavaScript, and Node.js.


Features

- Browse products
- Add products to the cart
- Adjust item quantities
- Remove items from the cart
- Dynamic price calculation
- Stripe checkout integration
- User authentication (register, login, logout)


 Running the Server

1. Start the server:  npm start
    

2. Open the application:
    Open your browser and navigate to:  http://localhost:3000 
     
Project Structure
  
- `index.html`: 	Main HTML file
- `style.css`: CSS file for styling
- `main.js`: Client-side JavaScript
- `server.js`: Node.js server
- `cancel.html`: Checkout cancellation page
- `success.html`: Checkout success page
- `login.html`: Login page
- `signup.html`: Signup page
- `logout.html`: Logout page
-  controllers/user.js
    Handles user registration, login, and logout.
- models/User.js
    Mongoose schema for user data.
- routes/user.js
    Routes for user authentication.

