declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REDIS_HOST: string,
      REDIS_PORT: number,
      LOGSTREAM: string,
      PORT: number
    }
  }
}

export {}
