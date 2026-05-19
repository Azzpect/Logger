declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REDIS_HOST: string,
      REDIS_PORT: number,
      STREAM_NAME: string 
    }
  }
}

export {}
