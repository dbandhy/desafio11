import dotenv from 'dotenv'
import process from 'process'
import path from 'path'


dotenv.config()


export const PORT = process.env.PORT ?? 8080
export const MONGOURL = process.env.MONGOURL