const { Client, Intents, MessageEmbed } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
require('dotenv').config();



async function main() {
    let response = await fetch(`http://api.airvisual.com/v2/city?city=Yan%20Nawa&state=Bangkok&country=Thailand&key=${process.env.API_TOKEN}`);
    let data = await response.json();
    let pm = data.data.current.pollution.aqius
    // update

    let color;
    let status;

    if ( pm <= 50 ){
        color = '00e400'
        status = 'Good'
    } else if ( pm >= 51 & pm <= 100 ){
        color = 'ffff00'
        status = 'Moderate'
    } else if ( pm >= 101 & pm <= 150 ){
        color = 'ff7e00'
        status = 'Unhealthy for Sensitive Groups'
    } else if ( pm >= 151 & pm <= 200 ){
        color = 'ff0000'
        status = 'Unhealthy'
    } else if ( pm >= 201 & pm <= 300 ){
        color = '8f3f97'
        status = 'Very Unhealthy'
    } else if ( pm >= 301 & pm <= 500 ){
        color = '7e0023'
        status = 'Hazardous'
    } else {
        color = '7e0023'
        status = 'Very Hazardous'
    }

    const message = new MessageEmbed()
        .setColor(`#${color}`)
        .setTitle("Yannawa PM2.5")
        .addFields(
            { name: 'Status', value: `${status}`, inline: true },
            { name: 'US AQI', value: `${pm}`, inline: true },
        )
    const Interval = 90 * 60 * 1000

    client.once('ready', async () => {
        console.log(`Logged in as ${client.user.tag}!`);
        channel = client.channels.cache.get(process.env.CHANNEL);

        setInterval(() => {
            channel.send({ embeds: [message] })
            console.log("send!")
        }, Interval)
    });


    client.login(process.env.DISCORD_TOKEN);
}

main()

