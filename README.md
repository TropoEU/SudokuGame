# Sudoku Game

This project is a Sudoku game built with React and Node.js.

## Live Demo

You can see a working sample of the application [here](https://sudoku-client.onrender.com).

## Available Scripts

### In the client directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

### In the server directory, you can run:

#### `npm run dev`

Runs the backend in development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in your browser.

#### `npm run build`

Builds the backend for production to the `dist` folder.

#### `npm start` or `node dist/server.js`

Runs the built server from the `dist` folder.

## Configure your .env files

### Server (.env)

```plaintext
GOOGLE_CLIENT_ID=your_google_client_id_here
PORT=3001
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_jwt_token_here
```

### Client (.env)

```plaintext
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here
REACT_APP_API_BASE_URL=your_server_address_here (http://localhost:3001 for development)
```
