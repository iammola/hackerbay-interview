<img src="https://raw.githubusercontent.com/hackerbay/interview/master/companylogo.png" alt="HackerBay Logo" width="100" height="100">

# HackerBay Interview

This is my attempt at the HackerBay Interview Backend Task.

## Tasks :hammer_and_wrench:

- [x] API Routes
- [x] Unit Test Suite
- [x] Code Coverage Reports
- [x] Dockerize
- [x] Documentation
- [x] Extra Documentation (JSDoc)
- [ ] Logging/Monitoring

## Authorization :key:

All API requests required the use of a JWT token. You can get your JWT token by navigating to the `/api/auth/` endpoint with your username and password.

To authenticate an API request, you should provide your JWT key in the `Authorization` Bearer header.

### Request

```http
POST /api/endpoint/
Authorization: "Bearer <YOUR_JWT_TOKEN>"
```

## Endpoints :door:

The endpoints to the app are described below.

### Authorization

Get JWT token

#### Request

```http
POST /api/auth/
Content-Type: "application/json"
```

##### Request Body

| Name       | Type     | Description                 |
| :--------- | :------- | :-------------------------- |
| `username` | `string` | **Required.** Your Username |
| `password` | `string` | **Required.** Your Password |

#### Response

```json
{
  "token": "<YOUR_JWT_TOKEN>"
}
```

---

### JSON Patching :adhesive_bandage:

Applies a patch to the original JSON object and returns the patched object

#### Request

```http
POST /api/patch
Authorization: "Bearer <YOUR_JWT_TOKEN>"
```

##### Request Body

| Name    | Type                                  | Description                            |
| :------ | :------------------------------------ | :------------------------------------- |
| `doc`   | `Record<string, unknown>`             | **Required.** The original JSON object |
| `patch` | [`PatchObject[]`](src/types/index.ts) | **Required.** The patch JSON object    |

#### Response

```ts
{
  result: Record<string, unknown>; // The patched document
}
```

---

### Image Thumbnail Generation :camera:

Scales the provided image down to 50x50 pixels and returns the thumbnail.

#### Request

```http
POST /api/thumbnail/
Authorization: "Bearer <YOUR_JWT_TOKEN>"
```

##### Request Body

| Name      | Type                                                                      | Description                                     |
| :-------- | :------------------------------------------------------------------------ | :---------------------------------------------- |
| `url`     | `string`                                                                  | **Required.** URL to public image               |
| `format?` | `heif`, `avif`, `jpeg`, `jpg`, `png`, `raw`, `tiff`, `tif`, `webp`, `gif` | Format of resulting image (**default** - `png`) |

#### Response

`File` - The `50x50` thumbnail

## Setup :shopping_cart:

Clone the project

```bash
git clone https://github.com/iammola/hackerbay-interview my-project
```

Go to the project directory and install dependencies

```bash
cd my-project
npm install
```

Start the dev server

```bash
npm run dev
```

### Docker :dolphin:

This project has a working Dockerfile and has pushed to [DockerHub](https://hub.docker.com/r/iammola/hackerbayinterviewbackend)

#### Build the Image

```bash
docker build --pull --rm -f "Dockerfile" -t backend:latest "."
```

#### Start a new container

```bash
docker run -d --rm backend:latest
```

## Major Packages :package:

- [Docker](https://docker.com)
- [Restify](https://npmjs.com/package/restify)
- [Got](https://npmjs.com/package/got)
- [Jose](https://npmjs.com/package/jose)
- [JsonPatch](https://npmjs.com/package/jsonpatch)
- [Sharp](https://npmjs.com/package/sharp)
- [Mocha](https://npmjs.com/package/mocha)
- [NYC Istanbul](https://npmjs.com/package/nyc)
- [Chai](https://npmjs.com/package/chai)
- [Typescript](https://npmjs.com/package/typescript)
- [ESLint](https://npmjs.com/package/eslint)
- [Prettier](https://npmjs.com/package/prettier)
