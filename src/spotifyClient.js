import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { authCreds } from "./authCreds";

export const spotifyClient = SpotifyApi.withUserAuthorization(
  authCreds.client_id,
  authCreds.redirect_uri,
  authCreds.scopes
);