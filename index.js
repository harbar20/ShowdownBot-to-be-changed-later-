const Discord = require('discord.js');
const fs = require('fs');
const oakdexPokedex = require('oakdex-pokedex');
const bot = new Discord.Client({disableEveryone: true});
let PlayerPoke = JSON.parse(fs.readFileSync('C:/Users/korea/source/repos/ConsoleApplication1/discord/other_bots/PokemonBot/json files/pokemonlist.json', 'utf8'));
let playerPokeFile = "C:/Users/korea/source/repos/ConsoleApplication1/discord/other_bots/PokemonBot/json files/pokemonlist.json";
const botconfig = require('../other_bots/PokemonBot/settings.json')
bot.on('warn', console.warn);

bot.on('error', console.error);

bot.on('disconnect', () => console.log('I just disconnected!'));

bot.on('reconnecting', () => console.log('I am reconnecting now!'));

bot.on('ready', async () => {
    console.log("ready");
})
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);
    
    let jsFile = files.filter(f => f.split(".").pop() === "js");
    if(jsFile.length <= -0){
        console.log("couldn't find commands");
        return;
    }
    jsFile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded!`);
        bot.commands.set(props.help.name, props);
    });
});
bot.on("message", async message => {
    let spawn1 = Math.floor(Math.random() *10) + 1;
    let spawn2 = Math.floor(Math.random() *10) + 1;
    console.log(`${spawn1}-${spawn2}`);

    if(spawn1 == spawn2){
        let pokespawn = Math.floor(Math.random() * 807) + 1;
        const spawnpokemon = oakdexPokedex.findPokemon(pokespawn);
        console.log(spawnpokemon.names.en);
        spawnname = spawnpokemon.names.en;
    }

    let prefix = "p."
    if(message.content.toLowerCase().includes(prefix)){
        let messageArray = message.content.split(" ");
        let cmd = messageArray[0];
          let args = messageArray.slice(1);
        console.log(`${message.guild.name} - ${message.content.split(" ")}`);
        if(cmd === `${prefix}catch`){
            let _try = args[0];
            if(_try === spawnname){
                let addpoke = PlayerPoke[message.author.id].pokemon.length + 1;
                if(!PlayerPoke[message.author.id]) PlayerPoke[message.author.id] = {
                        pokemon: {
                                poke: {
                                id:addpoke,
                                name: spawnname
                            }
                        }
                    } 
                fs.writeFile(playerPokeFile, JSON.stringify(PlayerPoke), (err) => {
                    if(err) console.log(err);
                })
                
                PlayerPoke[message.author.id] = {
                    pokemon: {
                            poke: {
                            id:addpoke,
                            name: spawnname
                        }
                    }
                }
                fs.writeFile(playerPokeFile, JSON.stringify(PlayerPoke), (err) => {
                    if(err) console.log(err);
                })
                return;
            }
                else{
                    message.channel.send('incorrect');
                }
            }

        if(cmd === `${prefix}pokemon`){
            for (var key in PlayerPoke[message.author.id].pokemon.poke.id) {
                console.log(key);
                console.log(PlayerPoke[message.author.id].pokemon.poke.id[key]);
                message.channel.send(`${key}-${PlayerPoke[message.author.id].pokemon.poke.id[key]}`);
            }
    }
}
});
bot.login();