const Discord = require('discord.js');
const fs = require('fs');
const oakdexPokedex = require('oakdex-pokedex');
const bot = new Discord.Client({disableEveryone: true});
let PlayerPoke = JSON.parse(fs.readFileSync('C:/Users/korea/source/repos/ConsoleApplication1/discord/other_bots/PokemonBot/json files/pokemonlist.json', 'utf8'));
let playerPokeFile = "C:/Users/korea/source/repos/ConsoleApplication1/discord/other_bots/PokemonBot/json files/pokemonlist.json";
const botconfig = require('C:/Users/korea/source/repos/ConsoleApplication1/discord/other_bots/PokemonBot/settings.json')
const pokemonGif = require('pokemon-gif');
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
    let spawn1 = Math.floor(Math.random() * 50) + 1;
    let spawn2 = Math.floor(Math.random() * 50) + 1;
    console.log(`${spawn1}-${spawn2}`);
    if(spawn1 == spawn2){
        let pokespawn = Math.floor(Math.random() * 807) + 1;
        const spawnpokemon = oakdexPokedex.findPokemon(pokespawn);
        console.log(spawnpokemon.names.en);
        spawnname = spawnpokemon.names.en;
        
        let spawnEmbed = new Discord.RichEmbed()
        .setTitle("A Pokemon Has Appeared.")
        .setDescription("To catch it type out ``p.catch <pokemon name>`` !")
        .setImage(pokemonGif(spawnname));
        message.channel.send(spawnEmbed);
    }

    let prefix = "p."
    if(message.content.toLowerCase().includes(prefix)){
        let messageArray = message.content.split(" ");
        let cmd = messageArray[0];
          let args = messageArray.slice(1);
        console.log(`${message.guild.name} - ${message.content.split(" ")}`);
        if(cmd === `${prefix}catch`){
            let _try = args[0];
            if(_try.toLowerCase() === spawnname.toLowerCase()){
                let spawnLvl = Math.floor(Math.random() * 50) + 1;
                let spawnHp = Math.floor(Math.random() * 31) + 1;
                let spawnAtk = Math.floor(Math.random() * 31) + 1;
                let spawnDef = Math.floor(Math.random() * 31) + 1;
                let spawnSpAtk = Math.floor(Math.random() * 31) + 1;
                let spawnSpDef = Math.floor(Math.random() * 31) + 1;
                let spawnSpeed = Math.floor(Math.random() * 31) + 1;
                let ivTotal = (((spawnHp + spawnAtk + spawnDef + spawnSpAtk + spawnSpDef + spawnSpeed)/186)*100)
                console.log(`Hp-${spawnHp}\nAtk-${spawnAtk}\nDef-${spawnDef}\nSpAtk-${spawnSpAtk}\nSpDef-${spawnSpDef}\nSpe-${spawnSpeed}\n\nTotal IV: ${ivTotal}`);
                console.log(spawnLvl);
                message.channel.send(`Congratulations, <@${message.author.id}>, you caught a **Level ${spawnLvl} ${spawnname}**!`);
                if(!PlayerPoke[message.author.id]) return message.channel.send(`you need a starter before you can catch pokemon(type in 'p.start'`);
            }
                else{
                    message.channel.send('incorrect');
                }
            }
        if(cmd === `${prefix}start`){
            let poke = args[0];
            let startEmbed = new Discord.RichEmbed()
            .setTitle('Start')
            .setDescription('Welcome type in "p.start <starter name"')
            if(!poke) return message.channel.send(startEmbed);
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
bot.login(botconfig.token);
