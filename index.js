const Discord = require('discord.js');
const fs = require('fs');
const oakdexPokedex = require('oakdex-pokedex');
const bot = new Discord.Client({disableEveryone: true});
let exp = JSON.parse(fs.readFileSync('C:/Users/korea/source/repos/ConsoleApplication1/discord/other_bots/PokemonBot/json files/xp.json'))
let expFile = "C:/Users/korea/source/repos/ConsoleApplication1/discord/other_bots/PokemonBot/json files/xp.json";
let selected = JSON.parse(fs.readFileSync('C:/Users/korea/source/repos/ConsoleApplication1/discord/other_bots/PokemonBot/json files/select.json', 'utf8'));
let selectedFile = "C:/Users/korea/source/repos/ConsoleApplication1/discord/other_bots/PokemonBot/json files/select.json";
let player = JSON.parse(fs.readFileSync('C:/Users/korea/source/repos/ConsoleApplication1/discord/other_bots/PokemonBot/json files/players.json', 'utf8'));
let playerFile = "C:/Users/korea/source/repos/ConsoleApplication1/discord/other_bots/PokemonBot/json files/players.json";
const botconfig = require('C:/Users/korea/source/repos/ConsoleApplication1/discord/other_bots/PokemonBot/settings.json')
const pokemonGif = require('pokemon-gif');
const sprites = "C:/Users/korea/source/repos/ConsoleApplication1/discord/node_modules/oakdex-pokedex-sprites/icons"
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
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;
    let gainExp = 100;
    if(exp[message.author.id]){
        try{
    exp[message.author.id].pokemon[selected[message.author.id].id].current += gainExp;
    fs.writeFile(expFile, JSON.stringify(exp), (err) => {
        if(err) console.log(err);
    })
        } catch(err) {
            if(err) console.log(err);
        }
    
    if(exp[message.author.id].pokemon[selected[message.author.id].id].current >= exp[message.author.id].pokemon[selected[message.author.id].id].total_exp){
        exp[message.author.id].pokemon[selected[message.author.id].id].current =0;
        let level = player[message.author.id].pokemon.id[selected[message.author.id].id].level
        let _xp = (5 * Math.floor(Math.pow(level, 3)) / 20) +1
        console.log(_xp);
        exp[message.author.id].pokemon[selected[message.author.id].id].total_exp = 0;
        fs.writeFile(expFile, JSON.stringify(exp), (err) => {
            if(err) console.log(err);
        })
        exp[message.author.id].pokemon[selected[message.author.id].id].total_exp = _xp;
        fs.writeFile(expFile, JSON.stringify(exp), (err) => {
            if(err) console.log(err);
        })

        player[message.author.id].pokemon.id[selected[message.author.id].id].level++;
        fs.writeFile(playerFile, JSON.stringify(player), (err) => {
            if(err) console.log(err);
        })
        let lvlupEmbed = new Discord.RichEmbed()
        .setTitle(`Congratulations, ${message.author.username}`)
        .setDescription(`Your ${player[message.author.id].pokemon.id[selected[message.author.id].id].pokemon} is now level ${player[message.author.id].pokemon.id[selected[message.author.id].id].level}`);
        message.channel.send(lvlupEmbed);

    }
    if(player[message.author.id].pokemon.id[selected[message.author.id].id].pokemon >= oakdexPokedex.findPokemon(player[message.author.id].pokemon.id[selected[message.author.id].id].pokemon).evolutions.level){
        player[message.author.id].pokemon.id[selected[message.author.id].id].pokemon = oakdexPokedex.findPokemon(player[message.author.id].pokemon.id[selected[message.author.id].id].pokemon).evolutions.to;
        fs.writeFile(playerFile, JSON.stringify(player), (err) => {
            if(err) console.log(err);
        })
    }
}
    let spawn1 = Math.floor(Math.random() * 30) + 1;
    let spawn2 = Math.floor(Math.random() * 30) + 1;
    console.log(`${spawn1}-${spawn2}`);
    if(spawn1 == spawn2){
        let pokespawn = Math.floor(Math.random() * 807) + 1;
        const spawnpokemon = oakdexPokedex.findPokemon(pokespawn);
        console.log(spawnpokemon.names.en);
        spawnname = spawnpokemon.names.en;
        pokeSprite = oakdexPokedex.findPokemon(spawnname);
        if(pokespawn <= 9){
            pokesprite = '00' + pokespawn;
        }
        else if(pokespawn <= 99){
            pokesprite = '0' + pokespawn;
        }
        else{
            pokesprite = pokespawn;
        }
        let spawnEmbed = new Discord.RichEmbed()
        .setTitle("A Pokemon Has Appeared.")
        .setDescription("To catch it type out ``p.catch <pokemon name>`` !")
        .attachFile(`${sprites}/${pokesprite}.png`)
        //.setImage(pokemonGif(spawnname));
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
            let NatureChance = {
            0:"Hardy",
            1:"Lonely",
            2:"Brave",
            3:"Adamant",
            4:"Naughty",
            5:"Bold",
            6:"Docile",
            7:"Relaxed",
            8:"Impish",
            9:"Lax",
            10:"Timid",
            11:"Hasty",
            12:"Serious",
            13:"Jolly",
            14:"Naive",
            15:"Modest",
            16:"Mild",
            17:"Quiet",
            18:"Bashful",
            19:"Rash",
            20:"Calm",
            21:"Gentle",
            22:"Sassy",
            23:"Careful",
            24:"Quirky"
        };
            
            if(_try.toLowerCase() === spawnname.toLowerCase()){
                let spawnNature = Math.floor(Math.random() *25) +1;
                let spawnLvl = Math.floor(Math.random() * 50) + 1;
                let spawnHp = Math.floor(Math.random() * 31) + 1;
                let spawnAtk = Math.floor(Math.random() * 31) + 1;
                let spawnDef = Math.floor(Math.random() * 31) + 1;
                let spawnSpAtk = Math.floor(Math.random() * 31) + 1;
                let spawnSpDef = Math.floor(Math.random() * 31) + 1;
                let spawnSpeed = Math.floor(Math.random() * 31) + 1;
                let ivTotal = (((spawnHp + spawnAtk + spawnDef + spawnSpAtk + spawnSpDef + spawnSpeed)/186)*100)
                console.log(`Hp-${spawnHp}/nAtk-${spawnAtk}/nDef-${spawnDef}/nSpAtk-${spawnSpAtk}/nSpDef-${spawnSpDef}/nSpe-${spawnSpeed}/n/nTotal IV: ${ivTotal}`);
                console.log(spawnLvl);
                message.channel.send(`Congratulations, <@${message.author.id}>, you caught a **Level ${spawnLvl} ${spawnname}**!`);
                if(!player[message.author.id]) return message.channel.send(`you need a starter before you can catch pokemon(type in 'p.start'`);
                for(key in player[message.author.id].pokemon.id)
                {
                    console.log(player[message.author.id].pokemon.id[key]);
                }
                let _xp = (5 * (Math.floor(Math.pow(spawnLvl, 3))) / 20) + 1;
                let _nature = NatureChance[spawnNature];
                let _id = player[message.author.id].pokemon.id.length + 1;
                player[message.author.id].pokemon.id.push({
                                id: _id,
                                pokemon: `${spawnname}`,
                                level: spawnLvl,
                                nature: `${_nature}`,
                                iv: {
                                    ivHp: spawnHp,
                                    ivAtk: spawnAtk,
                                    ivDef: spawnDef,
                                    ivSpAtk: spawnSpAtk,
                                    ivSpDef: spawnSpDef,
                                    ivSpe: spawnSpeed
                                }
                            })
                exp[message.author.id].pokemon.push({
                    id: _id,
                   total_exp: _xp,
                   current: 0
                })
            }
        else{
            message.channel.send('incorrect');
        }
    }
            if(cmd === `${prefix}select`){
                let select = args[0];
                if(select == 1) select = 0;
                else select -= 1;
                 if(!player[message.author.id]) return message.author.send("you don't have a pokemon yet. type in \"p.start\" to start.");
                else if(!player[message.author.id].pokemon.id[select]) return message.channel.send("Please chose a valid pokemon");
                else{

                    selected[message.author.id] ={
                        id: select
                    }
                    fs.writeFile(selectedFile, JSON.stringify(selected), (err) => {
                        if(err) console.log(err);
                    })
                    message.channel.send(`You have selected your **Level ${player[message.author.id].pokemon.id[select].level} ${player[message.author.id].pokemon.id[select].pokemon}**`);
                }
            }
            
        if(cmd === `${prefix}start`){
            let poke = args[0];
            let startEmbed = new Discord.RichEmbed()
            .setTitle('Start')
            .setDescription('Welcome type in "p.start <starter name"')
            .addField("Gen 1", "charmander, bulbasaur, squirtle")
            .addField("Gen 2", "chikorita, totodile, cyndaquil")
            .addField("Gen 3", "mudkip, treecko, torchic")
            .addField("Gen 4", "turtwig, chimchar, piplup")
            .addField("Gen 5","oshawott, snivy, tepig")
            .addField("Gen 6", "froakie, fennekin, chespin")
            .addField("Gen 7", "rowlet, litten, popplio")
            if(!poke) return message.channel.send(startEmbed);
            if(!(poke == "charmander" || poke == "bulbasaur" || poke == "squirtle" 
            || poke == "chikorita" || poke == "totodile" || poke == "cyndaquil" 
            || poke == "mudkip" || poke == "treecko" || poke == "torchic"
            || poke == "turtwig" || poke == "chimchar" || poke == "piplup"
            || poke == "oshawott" || poke == "snivy" || poke == "tepig"
            || poke == "froakie" || poke == "fennekin" || poke == "chespin"
            || poke == "rowlet" || poke == "litten" || poke == "poplio")) return message.channel.send("That is not a valid starter pokemon");
            if(poke == "charmander")
                poke = "Charmander";
            else if( poke == "bulbasaur")
                poke = "Bulbasaur";
            else if(poke == "squirtle")
                poke = "Squirtle";
            else if( poke == "chikorita")
                poke = "Chikorita";
            else if( poke == "totodile")
                poke = "Totodile";
            else if( poke == "cyndaquil")
                poke = "Cyndaquil";
            else if( poke == "mudkip")
                poke = "Mudkip";
            else if( poke == "treecko")
                poke = "Treecko";
            else if( poke == "torchic")
                poke = "Torchic";
            else if(poke == "turtwig")
                poke = "Turtwig";
            else if(poke == "chimchar")
                poke = "Chimchar";
            else if(poke == "piplup")
                poke = "Piplup";
            else if(poke == "oshawott")
                poke = "Oshawott";
            else if(poke == "snivy")
                poke = "Snivy";
            else if( poke == "tepig")
                poke = "Tepig";
            else if(poke == "froakie")
                poke = "Froakie";
            else if(poke == "fennekin")
                poke = "Fennekin";
            else if( poke == "chespin")
                poke = "Chespin";
            else if(poke == "rowlet")
                poke = "Rowlet";
            else if( poke == "litten")
                poke = "Litten";
            else if(poke == "poplio")
                poke = "Poplio";
            else {
                let NatureChance = {
                    0:"Hardy",
                    1:"Lonely",
                    2:"Brave",
                    3:"Adamant",
                    4:"Naughty",
                    5:"Bold",
                    6:"Docile",
                    7:"Relaxed",
                    8:"Impish",
                    9:"Lax",
                    10:"Timid",
                    11:"Hasty",
                    12:"Serious",
                    13:"Jolly",
                    14:"Naive",
                    15:"Modest",
                    16:"Mild",
                    17:"Quiet",
                    18:"Bashful",
                    19:"Rash",
                    20:"Calm",
                    21:"Gentle",
                    22:"Sassy",
                    23:"Careful",
                    24:"Quirky"
                };
                let spawnNature = Math.floor(Math.random() *25) +1;
                let spawnHp = Math.floor(Math.random() * 31) + 1;
                let spawnAtk = Math.floor(Math.random() * 31) + 1;
                let spawnDef = Math.floor(Math.random() * 31) + 1;
                let spawnSpAtk = Math.floor(Math.random() * 31) + 1;
                let spawnSpDef = Math.floor(Math.random() * 31) + 1;
                let spawnSpeed = Math.floor(Math.random() * 31) + 1;
                let ivTotal = (((spawnHp + spawnAtk + spawnDef + spawnSpAtk + spawnSpDef + spawnSpeed)/186)*100)
                let _nature = NatureChance[spawnNature];
                if(!player[message.author.id]) player[message.author.id] = {
                    pokecredits : 0,
                    pokemon:{
                        id: [{
                            id: 1,
                            pokemon: `${poke}`,
                            level: 5,
                            nature: _nature,
                            iv:{
                                ivHp: spawnHp,
                                ivAtk: spawnAtk,
                                ivDef: spawnDef,
                                ivSpAtk: spawnSpAtk,
                                ivSpDef: spawnSpDef,
                                ivSpe: spawnSpeed
                            },
                        }],
                        team:{

                        }
                    }
                }
            }
            console.log(player[message.author.id])
        fs.writeFile(playerFile, JSON.stringify(player), (err) => {
            if(err) console.log(err);
        })
        if(!selected[message.author.id]) selected[message.author.id] = {
            id: 1
        }
        fs.writeFile(selectedFile, JSON.stringify(selected), (err) => {
            if(err) console.log(err);
        })
        let totalExp = (5 * (Math.floor(Math.pow(5, 3))) / 20) + 1;
        
        fs.writeFile(expFile, JSON.stringify(exp), (err) => {
            if(err) console.log(err);
        })
        /**
         * if(!exp[message.author.id]) exp[message.author.id] = {
            pokemon:[{
                id:{
                id: 0,
                total_exp:totalExp,
                current: 0
                }
            }]
         */
    }

        if(cmd === `${prefix}pokemon`){
            for (var key in  player[message.author.id].pokemon.id) {
                console.log(key);
                console.log( player[message.author.id].pokemon.id[key]);
                message.channel.send(`${key}-${ player[message.author.id].pokemon.id[key].pokemon}`);
            }
    }
    if(cmd === `${prefix}length`){
        message.channel.send(`${player[message.author.id].pokemon.id.length}`);
    }
    if(cmd === `${prefix}info`){
        let requestId = args[0];
        let _id;
        if(!requestId)
        _id = selected[message.author.id].id;
        else
            _id = requestId - 1;

        if(!player[message.author.id]) return message.channel.send(`you need a starter before you can catch pokemon(type in 'p.start'`);
        const infoPokemon = oakdexPokedex.findPokemon(`${player[message.author.id].pokemon.id[_id].pokemon}`)
        console.log(infoPokemon.base_stats);
        let _hp = player[message.author.id].pokemon.id[_id].iv.ivHp;
        let _lvl = player[message.author.id].pokemon.id[_id].level;
        let _atk = player[message.author.id].pokemon.id[_id].iv.ivAtk;
        let _def = player[message.author.id].pokemon.id[_id].iv.ivDef;
        let _spatk = player[message.author.id].pokemon.id[_id].iv.ivSpAtk;
        let _spdef = player[message.author.id].pokemon.id[_id].iv.ivSpDef;
        let _spe = player[message.author.id].pokemon.id[_id].iv.ivSpe;
        let HP = ((2 * infoPokemon.base_stats.hp + _hp + 100) * _lvl) /100 + 10;
        console.log(HP);
        if(player[message.author.id].pokemon.id[_id].nature === 'Hardy'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100);
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100);
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100);
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100);
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100);
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Lonely'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100) * 1.10;
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100) / 1.10;
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100);
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100);
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100);
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Brave'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100) * 1.10;
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100);
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100);
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100);
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100) / 1.10;
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Adamant'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100) * 1.10;
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100);
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100) / 1.10;
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100);
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100);
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Naughty'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100) * 1.10;
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100);
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100);
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100) / 1.10;
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100);
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Bold'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100) / 1.10;
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100) * 1.10;
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100);
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100);
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100);
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Docile'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100);
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100);
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100);
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100);
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100);
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Relaxed'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100);
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100) * 1.10;
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100);
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100);
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100) / 1.10;
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Impish'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100);
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100) * 1.10;
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100) / 1.10;
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100);
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100);
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Lax'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100);
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100) * 1.10;
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100);
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100) / 1.10;
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100);
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Timid'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100) / 1.10;
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100);
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100);
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100);
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100) * 1.10;
        }        
        if(player[message.author.id].pokemon.id[_id].nature === 'Hasty'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100);
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100) / 1.10;
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100);
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100);
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100) * 1.10;
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Serious'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100);
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100);
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100);
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100);
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100);
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Jolly'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100);
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100);
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100) / 1.10;
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100);
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100) * 1.10;
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Naive'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100);
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100);
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100);
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100) / 1.10;
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100) * 1.10;
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Modest'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100) / 1.10;
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100);
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100) / 1.10;
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100);
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100);
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Mild'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100);
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100) / 1.10;
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100) * 1.10;
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100);
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100);
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Quiet'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100);
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100);
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100) * 1.10;
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100);
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100) / 1.10;
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Bashful'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100);
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100);
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100);
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100);
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100);
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Rash'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100);
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100);
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100) * 1.10;
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100) / 1.10;
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100);
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Calm'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100) / 1.10;
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100);
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100);
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100) * 1.10;
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100);
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Gentle'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100);
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100) / 1.10;
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100);
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100) * 1.10;
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100);
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Sassy'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100);
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100);
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100);
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100) * 1.10;
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100) / 1.10;
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Careful'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100);
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100);
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100) / 1.10;
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100) * 1.10;
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100);
        }
        if(player[message.author.id].pokemon.id[_id].nature === 'Quirky'){
            atk = (((2 * infoPokemon.base_stats.atk + _atk) * _lvl) / 100 + 100);
            def = (((2 * infoPokemon.base_stats.def + _def) * _lvl) / 100 + 100);
            spatk = (((2 * infoPokemon.base_stats.sp_atk + _spatk) * _lvl) / 100 + 100);
            spdef = (((2 * infoPokemon.base_stats.sp_def + _spdef) * _lvl) / 100 + 100);
            spe = (((2 * infoPokemon.base_stats.speed + _spe) * _lvl) / 100 + 100);
        }
        if(oakdexPokedex.findPokemon(`${player[message.author.id].pokemon.id[_id].pokemon}`).national_id <= 9){
            pokesprite = '00' + oakdexPokedex.findPokemon(`${player[message.author.id].pokemon.id[_id].pokemon}`).national_id;
        }
        else if(oakdexPokedex.findPokemon(`${player[message.author.id].pokemon.id[_id].pokemon}`).national_id <= 99){
            pokesprite = '0' + oakdexPokedex.findPokemon(`${player[message.author.id].pokemon.id[_id].pokemon}`).national_id;
        }
        else{
            pokesprite = oakdexPokedex.findPokemon(`${player[message.author.id].pokemon.id[_id].pokemon}`).national_id;
        }
        let ivTotal = (((player[message.author.id].pokemon.id[_id].iv.ivHp + player[message.author.id].pokemon.id[_id].iv.ivAtk + player[message.author.id].pokemon.id[_id].iv.ivDef + player[message.author.id].pokemon.id[_id].iv.ivSpAtk + player[message.author.id].pokemon.id[_id].iv.ivSpDef + player[message.author.id].pokemon.id[_id].iv.ivSpe)/186)*100)
        let infoEmbed = new Discord.RichEmbed()
        .setTitle(`${message.author.username}'s ${player[message.author.id].pokemon.id[_id].pokemon}`)
        .setDescription(`Level: ${player[message.author.id].pokemon.id[_id].level}\nNature: ${player[message.author.id].pokemon.id[_id].nature}`)
        .attachFile(`${sprites}/${pokesprite}.png`)
        .addField("xp", `${exp[message.author.id].pokemon[_id].current}/ ${exp[message.author.id].pokemon[_id].total_exp}`)
        //.setImage(pokemonGif(player[message.author.id].pokemon.id[_id].pokemon))
        .addField('Hp:', `${Math.floor(Math.round(HP))}| ${player[message.author.id].pokemon.id[_id].iv.ivHp}/31`)
        .addField('Atk:', `${Math.floor(Math.round(atk))}| ${player[message.author.id].pokemon.id[_id].iv.ivAtk}/31`)
        .addField('Def:', `${Math.floor(Math.round(def))}| ${player[message.author.id].pokemon.id[_id].iv.ivDef}/31`)
        .addField('Sp.Atk:', `${Math.floor(Math.round(spatk))}| ${player[message.author.id].pokemon.id[_id].iv.ivSpAtk}/31`)
        .addField('Sp.Def:', `${Math.floor(Math.round(spdef))}| ${player[message.author.id].pokemon.id[_id].iv.ivSpDef}/31`)
        .addField('Speed:', `${Math.floor(Math.round(spe))}| ${player[message.author.id].pokemon.id[_id].iv.ivSpe}/31`)
        .addField(`Total IV: `, `${Math.floor(Math.round(ivTotal))}%`);
        message.channel.send(infoEmbed)
    }
    if(cmd === `${prefix}help`){
        let helpEmbed = new Discord.RichEmbed()
        .setTitle("Help")
        .addField(`✅${prefix}start`, "Allows you to pick a starter pokemon to start your adventures")
        .addField(`✅${prefix}catch <pokemon name>`, 'When a pokemon appers, you can use this command to catch it.')
        .addField(`✅${prefix}info {pokemon Id}`, "Allows you to see information about your pokemon")
        .addField(`✅${prefix}pokemon`, 'Lets you see all your pokemon')
        .addField(`${prefix}team <options>`, `lets you do stuff to your team such as setting what pokemon in what solt, or adding a pokemon, etc.`)
        .addField(`${prefix}claim`, "Lets you claim some credits every 12 hours")
        .addField(`${prefix}shop`, "with your credits you can buy items, zmoves, mega stones, etc.")
        .addField(`${prefix}moves`, 'shows your current moves on your pokemon, and what you can learn.')
        .addField(`${prefix}learn <move name> <solt>`, "lets your pokemon learn a move")
        .addField(`${prefix}duel <@who>`, "Lets you duel someone in a 6v6 single battle.")
        .addField(`${prefix}trade <@who>`, "lets you trade stuff with other people.")
        
        message.channel.send(helpEmbed)
    }
}

});
bot.login(botconfig.token);
//HP = ((2*infoPokemon.base_stats.hp + player[message.author.id].pokemon.id[_id].iv.ivHp + 100) * player[message.author.id].pokemon.id[_id].level) / 100 + 10
//Stat = (((2*Base + IV + EV/4) * Level) / 100 + 5) * Nature
/**
 * atk = (((2 * infoPokemon.base_stats.atk) * _lvl) / 100 + 100) * Nature
 *  hp = ((2*infoPokemon.base_stats.hp + player[message.author.id].pokemon.id[_id].iv.ivHp + 100) * player[message.author.id].pokemon.id[_id].level) / 100 + 10
 */
/**
            * Natures
            * 0:"Hardy: --, --"
            * 1:"Lonely: Increase Attack, Decrease Defense"
            * 2:"Brave: Increase Attack, Decrease Speed"
            * 3:"Adamant: Increase Attack, Decrease Sp. Attack"
            * 4:"Naughty: Increase Attack, Decrease Sp. Defense"
            * 5:"Bold: Increase Defense, Decrease Attack"
            * 6:"Docile: --, --"
            * 7:"Relaxed: Increase Defense, Decrease Speed"
            * 8:"Impish: Increase Defense, Decrease Sp. Attack"
            * 9:"Lax: Increase Defense, Decrease Sp.Defense"
            * 10:"Timid: Increase Speed, Decrease Attack"
            * 11:"Hasty: Increase Speed, Decrease Defense"
            * 12:"Serious:, --, --"
            * 13:"Jolly: Increase Speed, Decrease Sp. Attack"
            * 14:"Naive: Increase Speed, Decrease Sp. Defense"
            * 15:"Modest: Increase Sp. Attack, Decrease Attack"
            * 16:"Mild: Increase Sp. Attack, Decrease Defense"
            * 17:"Quiet: Increase Sp. Attack, Decrease Speed"
            * 18:"Bashful: --, --"
            * 19:"Rash: Increase Sp. Attack, Decrease Sp.Defense"
            * 20:"Calm: Increase Sp. Defense, Decrease Attack"
            * 21:"Gentle: Increase Sp. Defense, Decrease Defense"
            * 22:"Sassy: Increase Sp. Defense, Decrease Speed"
            * 23:"Careful: Increase Sp. Defense, Decrease Sp. Attack"
            * 24:"Quirky: --, --"
            */