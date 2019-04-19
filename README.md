# daedelus

_Initiative for a dataless websdk, spawned from Foresee Hackathon 2019._

## Installation

- Install MongoDB
- Init DB user:
  - `mongo`
  - `use mainDB`
  - `db.createUser({user:\"api\", pwd:\"M4KgnR32\", roles:[{role:\"readWrite\", db:\"mainDB\"}]})`
- `npm install`
- Start MongoDB engine: `npm run mongod`
- (In a separate terminal) Start web server: `npm start`
