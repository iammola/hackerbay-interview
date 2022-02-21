<img src="https://raw.githubusercontent.com/hackerbay/interview/master/companylogo.png" alt="HackerBay Logo" width="100" height="100">

# HackerBay Interview

This is my attempt at the HackerBay Interview Backend Task.

## Authorization

All API requests required the use of a JWT token. You can get your JWT token by navigating to the `/api/auth/` endpoint with your username and password.

To authenticate an API request, you should provide your JWT key in the `Authorization` Bearer header.

### Request

```http
POST /api/endpoint/
Authorization: "Bearer <YOUR_JWT_TOKEN>"
```

## Endpoints

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
  "jwt": "<YOUR_JWT_TOKEN>"
}
```

---

### JSON Patching

Applies a patch to the original JSON object and returns the patched object

#### Request

```http
POST /api/patch
Authorization: "Bearer <YOUR_JWT_TOKEN>"
```

##### Request Body

| Name    | Type                                  | Description              |
| :------ | :------------------------------------ | :----------------------- |
| `doc`   | `Record<string, unknown>`             | The original JSON object |
| `patch` | [`PatchObject[]`](src/types/index.ts) | The patch JSON object    |

#### Response

```ts
{
  result: Record<string, unknown>; // The patched document
}
```

---

### Image Thumbnail Generation

Scales the provided image down to 50x50 pixels and returns the thumbnail.

#### Request

```http
POST /api/thumbnail/
Authorization: "Bearer <YOUR_JWT_TOKEN>"
```

##### Request Body

| Name  | Type     | Description         |
| :---- | :------- | :------------------ |
| `url` | `string` | URL to public image |

#### Response

`File` - The `50x50` thumbnail
