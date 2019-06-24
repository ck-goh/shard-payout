import Discord from 'discord.js'

import path from 'path'

import Channel from './Channel';

const channelId = process.env.CHANNEL_ID;

class Bot {
  constructor (botToken) {
    this.main = this.main.bind(this)

    this.botToken = botToken
    this.channels = [];

    this.client = new Discord.Client()
    this.client.on("ready", async () => {
      this.client.user.setActivity('live countdowns until payout');
      for (const ch of channelId.split(',')) {
          const [name, chId] = ch.split(':');
          this.channels.push(new Channel(this.client, name, chId));
      }

      await this.initializeBot()
      console.log('Bot initialized')
    })
    this.client.on("error", async e => {
      console.log(e);
    })
    this.client.on("reconnecting", async () => {
      console.log("Bot reconnecting");
    })
    this.client.on("disconnect", async e => {
      console.log(e);
      process.exit(1);
    })

    this.client.login(botToken)

    this.main()
  }

  formatTime (date) {
      return `${String(date.getUTCHours()).padStart(2, '00')}:${String(date.getUTCMinutes()).padStart(2, '00')}`;
  }

  async main () {
      for (const chan of this.channels) {
          await chan.process();
      }
      setTimeout(this.main, 60000 - Date.now() % 60000)
  }

  async initializeBot () {
    for (const chan of this.channels) {
        await chan.initialize();
    }
  }

}

export default Bot;
