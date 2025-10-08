Secure Vault

**Secure Vault** is an internal SaaS platform for **secure file sharing and downloading**, built with a focus on **privacy, encryption, and data protection**.

---

## 🚀 Features

- **🔐 Hybrid Encryption (RSA + AES)**  
  Files are encrypted using a hybrid encryption model combining the efficiency of AES (symmetric) and the security of RSA (asymmetric).  

- **⬇️ Secure File Downloading**  
  Users can safely download encrypted files with built-in integrity verification.  

- **📤 Secure File Sharing & Decryption**  
  Authorized users can share encrypted files and decrypt received ones securely using their private keys.  

- **📊 React Dashboard**  
  A modern, user-friendly React dashboard for managing uploads, downloads, and encryption operations seamlessly.  


Secure File Sharing Process (AES + RSA Hybrid Encryption)
Step 1: File Encryption by Sender (Alice)

Alice selects a file (e.g., File.txt).

She encrypts it using her AES key (symmetric encryption).

The AES key is stored securely in the File Key Database (FileKeyDB), encrypted with Alice’s RSA private key.

Step 2: Initiating File Transfer

Alice provides:

File ID

Recipient’s (Bob’s) email

Her password (for authentication)

The system fetches:

The file and metadata

The sender (Alice) and recipient (Bob) records from their respective databases

Step 3: Key Retrieval and Re-encryption

Fetch Alice’s encrypted file key from the FileKeyDB.

Decrypt it using Alice’s private RSA key (the salt, nonce, and ciphertext are already stored).

Generate a new AES key for this sharing session.

Encrypt this new AES key using:

Alice’s AES key, and

Bob’s RSA public key
(ensuring only Bob can decrypt it later).

Step 4: Key Storage and Sharing

Create a new FileKeyDB record with:

file_id

recipient_id

encrypted_AES_key

Store this securely in the database — making the file accessible to Bob.

Step 5: File Access by Recipient (Bob)

Bob downloads the file along with the encrypted AES key.

He decrypts the AES key using his RSA private key.

Using this AES key, Bob decrypts File.txt and retrieves the original content.
