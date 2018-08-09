import Bot from './Bot'
import { botToken } from './secret'

const payouts = require('./data/payouts.json')

new Bot(botToken, payouts)
