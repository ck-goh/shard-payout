import Discord from 'discord.js'

class Channel {
    constructor(client, name, channelId) {
        this.client = client;
        this.channelId = channelId;
        this.data = require('./data/' + name + '/payouts.json');
        this.channel = this.client.channels.get(this.channelId);

        this.parseXlsx()
    }

    async initialize() {
        const messages = await this.channel.fetchMessages()
        if (messages.array().length === 0) {
            try {
                this.message = await chan.send({embed: new Discord.RichEmbed()})
            } catch (err) {
                console.log(err)
            }
        } else {
            if (messages.first().embeds.length === 0) {
                await messages.first().delete()
                this.message = await chan.send({embed: new Discord.RichEmbed()})
            } else {
                this.message = messages.first()
            }
        }
    }

    async process () {
        try {
            if (this.message) {
                this.calculateSecondsUntilPayout()
                await this.sendMessage()
            }
        } catch (err) {
            console.log(err)
        }
    }

    parseXlsx () {
        this.mates = []
        for (let i in this.data) {
            const user = this.data[i]
            this.mates.push({
                name: user.Name,
                //payout: parseInt(user.UTC.substr(0,2))
                payout: ((h,m) => h * 60 + m).apply(null, user.UTC.split(':').map(n => parseInt(n)))
            })
        }
        const matesByTime = {}
        for (let i in this.mates) {
            const mate = this.mates[i]
            if (!matesByTime[mate.payout]) {
                matesByTime[mate.payout] = {
                    payout: mate.payout,
                    mates: []
                }
            }
            matesByTime[mate.payout].mates.push(mate)
        }
        this.mates = Object.values(matesByTime)
    }

    calculateSecondsUntilPayout () {
        const now = new Date()
        for (let i in this.mates) {
            const mate = this.mates[i]
            const p = new Date()
            p.setUTCHours(Math.floor(mate.payout/60), mate.payout % 60, 0, 0)
            if (p < now) p.setDate(p.getDate() + 1)
            mate.timeUntilPayout = p.getTime() - now.getTime()
            let dif = new Date(mate.timeUntilPayout)
            const round = dif.getTime() % 60000
            if (round < 30000) {
                dif.setTime(dif.getTime() - round)
            } else {
                dif.setTime(dif.getTime() + 60000 - round)
            }
            mate.time = `${String(dif.getUTCHours()).padStart(2, '00')}:${String(dif.getUTCMinutes()).padStart(2, '00')}`
        }
        this.mates.sort((a, b) => {
            return a.timeUntilPayout - b.timeUntilPayout
        })
    }

    async sendMessage () {
        let embed = new Discord.RichEmbed().setColor(0x00AE86)
        let desc = '**Time until next payout**:'
        for (let i in this.mates) {
            let fieldName = String(this.mates[i].time)
            let fieldText = ''
            for (const mate of this.mates[i].mates) {
                fieldText += `${mate.name}\n` // Discord automatically trims messages
            }
            embed.addField(fieldName, fieldText, true)
        }
        embed.setDescription(desc)
        await this.message.edit({embed})
    }

}

export default Channel;
