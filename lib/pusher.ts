import Pusher from "pusher";

export function getPusher() {
  if (
    !process.env.PUSHER_APP_ID ||
    !process.env.PUSHER_KEY ||
    !process.env.PUSHER_SECRET ||
    !process.env.PUSHER_CLUSTER
  ) {
    return null;
  }
  return new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
    useTLS: true,
  });
}
