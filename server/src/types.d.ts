export type RedisResponse = {
  id: string;
  message: Message;
}
export type Message = {
  level: string;
  service: string;
  message: string;
  timestamp: string;
}
