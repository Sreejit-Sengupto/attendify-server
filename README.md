![Logo](https://res.cloudinary.com/dagn8yyfi/image/upload/v1729787673/attendifyapplogo_pwluig.png)

# Attendify

This is the server for Attendify client built using Express, if you are looking for the Attendify repo, click [here](https://github.com/Sreejit-Senguptp/attendify).

This server is responsible for implementing the WebAuthentication:

- Registering passkey
- Verifying the registration
- Verifying the passkey when logging in

[Learn more about WebAuthentication](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)

## Installation

Install the project with npm

- Fork/Clone the repository.
- Install all the dependencies.

```bash
  cd attendify-server
  npm install
```

- Create an Appwrite account and create a database with two collections namely, 'organisations' and 'students' with the following attributes (check attendify [repo](https://github.com/Sreejit-Sengupto/attendify/blob/main/README.md#organisations) for database setup instructions)

- Paste the env variables in a .env file.
- Run `npm run dev` to start the application.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`VITE_APPWRITE_PROJECT_ID`

`APPWRITE_API_KEY`

`VITE_APPWRITE_DB_ID`

`VITE_APPWRITE_STD_COLLECTION_ID`

`VITE_APPWRITE_ORG_COLLECTION_ID`

`ENV` - DEV when in development and PROD when in production

## Contributing

Contributions are always welcome!

We are open to all sorts of contributions, be it a bug or a feature. Please feel free to raise an issue and help us improve.

For any help or query you can reach out to me on [Discord](https://discord.gg/39bY6vwg).

## API Reference

Base URL: [http://localhost:3000](http://localhost:3000)

#### Generate passkey registration challenge

```http
  POST /api/v1/passkey/register
```

| Parameter  | Type     | Description                                  |
| :--------- | :------- | :------------------------------------------- |
| `userId`   | `string` | **Required**. User ID from Appwrite Database |
| `category` | `string` | **Required**. "ORG" OR "STD"                 |

#### Verify passkey registration challenge

```http
  POST /api/v1/passkey/verify
```

| Parameter    | Type     | Description                                                     |
| :----------- | :------- | :-------------------------------------------------------------- |
| `userId`     | `string` | **Required**. User ID from Appwrite Database                    |
| `credential` | `Object` | **Required**. options object returned by register challenge API |
| `category`   | `string` | **Required**. "ORG" OR "STD"                                    |

#### Generate login challenge

```http
  POST /api/v1/passkey/login
```

| Parameter  | Type     | Description                                  |
| :--------- | :------- | :------------------------------------------- |
| `userId`   | `string` | **Required**. User ID from Appwrite Database |
| `category` | `string` | **Required**. "ORG" OR "STD"                 |

#### Verify login challenge

```http
  POST /api/v1/passkey/verify-login
```

| Parameter    | Type     | Description                                                     |
| :----------- | :------- | :-------------------------------------------------------------- |
| `userId`     | `string` | **Required**. User ID from Appwrite Database                    |
| `credential` | `Object` | **Required**. options object returned by register challenge API |
| `category`   | `string` | **Required**. "ORG" OR "STD"                                    |

#### Add label to user (Appwrite)

```http
  POST /api/v1/user/label
```

| Parameter | Type     | Description                                  |
| :-------- | :------- | :------------------------------------------- |
| `userId`  | `string` | **Required**. User ID from Appwrite accounts |
| `label`   | `string` | **Required**. "ORG" OR "STD"                 |

## Tech Stack

**Client:** React, TailwindCSS, MaterialUI, Lucide React, Appwrite, SimpleWebAuthn

**Server:** Node, Express, Appwrite, SimpleWebAuthn

## Authors

- [@sahil](https://github.com/capsule11)
- [@atulya](https://github.com/atulya-srivastava)
- [@sreejit](https://github.com/Sreejit-Sengupto)

## Appendix

WebAuthentication has been implemented using simplewebauthn, if you want to learn more about it you can refer to their docs [here](https://simplewebauthn.dev/docs/).

## Feedback

If you have any feedback, please reach out to us at sreesen2003@gmail.com
