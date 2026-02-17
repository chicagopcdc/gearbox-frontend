## Running the live update dev server

## Create Certificate

brew install mkcert

mkcert -install

# Create directory for certificates

mkdir -p .cert

# Generate certificate for localhost

mkcert -key-file .cert/key.pem -cert-file .cert/cert.pem localhost 127.0.0.1 ::1

# Verify files were created

ls -la .cert/

# Should show:

key.pem

cert.pem

# Start dev server

npm install

npm run start:dev

visit https://localhost:3000/ and accept certificate if asked

visit https://<hostname>/dev.html

code changes to the repo will now reflect in the browser while using a real backend
