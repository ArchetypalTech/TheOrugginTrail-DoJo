let client = null;
async function initClient() {
  if (client) {
    return client;
  }
  client = (await import("../../../../src/client")).default;
  return client;
}
function getClient() {
  if (!client) {
    throw new Error("client hasn't been initialized");
  }
  return client;
}
export {
  getClient,
  initClient
};
