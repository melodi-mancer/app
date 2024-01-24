View on [GitHub Pages](https://melodi-mancer.github.io/app/)

<img src="https://github.com/melodi-mancer/app/blob/main/src/content/img/icon/melodimancer-logo.svg?raw=true" width="100px" alt="Melodimancer logo">

### Melodimancer App

## Before you build

For authorization helpers to work, create a ```.js``` file named ```authCreds``` under ```src``` folder with:

```
export const authCreds =
{
    client_id: 'your_client_id',
    redirect_uri: 'http://localhost:3000',
    scopes: [ "user-read-private", "user-top-read", "playlist-modify-private" ],
};
```
