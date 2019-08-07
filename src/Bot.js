import Discord from 'discord.js'

import path from 'path'

import Channel from './Channel';

const channelId = process.env.CHANNEL_ID;

class Bot {
  constructor (botToken) {
    this.main = this.main.bind(this)

    this.botToken = botToken
    this.channels = {};

    this.client = new Discord.Client()
    this.client.on("ready", async () => {
      this.client.user.setActivity('live countdowns until payout');
      for (const ch of channelId.split(',')) {
          const [name, chId] = ch.split(':');
          console.log('Adding channel ' + name + ' on id ' + chId);
          this.channels[chId] = new Channel(this.client, name, chId);
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
    this.client.on("message", async msg => {
        if (msg.content.startsWith("?payout ")) {
            const cmd = msg.content.substring(8).trim();
            try {
                if (msg.channel.id in this.channels) {
                    msg.reply(this.channels[msg.channel.id].execute(cmd));
                }
            } catch (err) {
                console.log(err);
                msg.reply(err.toString());
            }
        }
    })

    this.client.login(botToken)

    this.main()
  }

  formatTime (date) {
      return `${String(date.getUTCHours()).padStart(2, '00')}:${String(date.getUTCMinutes()).padStart(2, '00')}`;
  }

    async main () {
        for (let chId in this.channels) {
            const chan = this.channels[chId];
            await chan.process();
        }
        setTimeout(this.main, 60000 - Date.now() % 60000)
    }

  async initializeBot () {
    for (let chId in this.channels) {
        const chan = this.channels[chId];
        await chan.initialize();
    }
  }

}

export default Bot;
