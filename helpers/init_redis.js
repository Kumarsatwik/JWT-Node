const redis = require("redis");
const client = redis.createClient({
  port: 6379,
  host: "127.0.0.1",
});

client.on("connect", () => {
  console.log("client connected to redis server");
});

client.on("ready", () => {
  console.log("Client connected to redis and ready to use ... ");
});

client.on("error", () => {
  console.log("Error ", error.message);
});

client.on("end", () => {
  console.log("Client disconnected from redis server");
});

process.on("SIGINT", () => {
  client.quit();
});

module.exports = client;
