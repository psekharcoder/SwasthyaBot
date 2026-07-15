// Imports the Express application from app.js
const app = require("./app");

// Reads the PORT number from the .env file
// If PORT is not found, it uses 5000 by default
const PORT = process.env.PORT || 5000;


// Starts the backend server
app.listen(PORT, () => {

    // Prints this message once the server starts successfully
    console.log(`🚀 Server running on http://localhost:${PORT}`);

});