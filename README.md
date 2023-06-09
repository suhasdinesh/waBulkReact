# WhatsApp Bulk Messaging App

This is a simple WhatsApp bulk messaging app built using React and the Ionic Framework. The app allows users to send messages to multiple contacts at once by uploading a CSV file containing contact information or importing from existing WhatsApp contacts.

## Features

- Upload a CSV file containing contact names and phone numbers
- Preview and manage the imported contacts
- Import contacts from existing WhatsApp contacts
- Set a custom server URL for sending messages
- Compose a message to be sent
- Send messages to all or selected contacts
- Track the progress of sent messages
- Delete all contacts from the app

## Installation

1. Clone the repository:

git clone https://github.com/suhasdinesh/waBulkReact.git


2. Install dependencies:

cd waBulkReact
npm install


3. Run the app in development mode:

ionic serve


## Usage

1. Import contacts by uploading a CSV file with the following format:

Name,Telephone
John Doe,+1 234 567 8901
Jane Smith,+1 234 567 8902


2. Preview the imported contacts, select all or specific contacts, and manage the contact list.

3. Import contacts from existing WhatsApp contacts by clicking "Sync" in the Settings page.

4. Set a custom server URL for sending messages in the Settings page.

5. Compose your message in the provided message editor.

6. Select the contacts you want to send the message to, and click "Send Message".

7. Track the progress of sent messages in the "Sent Messages" tab.

8. Delete all contacts from the app by clicking "Delete" in the Settings page.
