export type RedisResponse = {
  id: string;
  message: Message;
}
export type Message = {
  level: "INFO" | "ERROR";
  service: string;
  message: string;
  timestamp: string;
}
