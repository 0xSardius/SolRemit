/** CDP client config. The app runs fine without these — wallet features just stay off. */

export const CDP_PROJECT_ID = process.env.NEXT_PUBLIC_CDP_PROJECT_ID ?? "";

/** True once a CDP project id is present. Gates all embedded-wallet UI. */
export const isCdpConfigured = CDP_PROJECT_ID.length > 0;
