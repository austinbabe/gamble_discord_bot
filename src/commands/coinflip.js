const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'coinflip',
  description: 'this is a coinflip command!',
  aliases: ['cf'],
  async execute(msg, args, client) {
    const leverageUtil = require('../utility/leverage');
    const emoji = client.emojis.cache.get('889219097752129667');
    if (args.length < 1) {
      msg.channel.send(`擲硬幣指令錯誤! \n` + `範例: \`coinflip tails 50\`\n` + `請重新輸入`);
      return;
    }
    const acceptArgs = ['h', 'heads', 't', 'tails'];
    const input = args.shift().toLocaleLowerCase().substring(0, 1);
    if (!acceptArgs.includes(input)) {
      msg.channel.send(`擲硬幣參數錯誤! \n` + `範例: \`coinflip tails\`\n` + `請重新輸入`);
      return;
    }
    let leverage = 0;
    const currentLeverage = await leverageUtil.get(msg);
    const acceptAmountArgs = ['a', 'all'];
    if (!args.length) {
      msg.channel.send(`籌碼數量參數錯誤! 未輸入數量 \n` + `範例: \`coinflip tails 50\`\n` + `請重新輸入`);
      return;
    }
    if (isNaN(args[0]) && !acceptAmountArgs.includes(`${args[0].toLocaleLowerCase()}`)) {
      msg.channel.send(`籌碼數量參數錯誤! 請輸入數字或是 **all** \n` + `範例: \`coinflip tails 50\`\n` + `請重新輸入`);
      return;
    }

    if (parseInt(args[0]) <= 0) {
      msg.channel.send(`籌碼數量參數錯誤! 數量請大於0 \n` + `範例: \`coinflip tails 50\`\n` + `請重新輸入`);
      return;
    }

    if (currentLeverage == 0) {
      msg.channel.send(`籌碼數量錯誤! 籌碼為 0 \n` + `範例: \`coinflip tails 50\`\n` + `請重新輸入`);
      return;
    }

    if (acceptAmountArgs.includes(`${args[0].toLocaleLowerCase()}`)) {
      leverage = currentLeverage;
    } else {
      leverage = Math.floor(parseInt(args.shift()));
    }

    const isEnough = currentLeverage >= leverage ? true : false;
    if (!isEnough) {
      msg.channel.send(
        `籌碼數量錯誤! 沒有足夠的籌碼 \n` +
          `目前籌碼數量為 ${currentLeverage} ${emoji}\n` +
          `範例: \`coinflip tails 50\`` +
          `請重新輸入`
      );
      return;
    }

    //random flip result
    const flip = acceptArgs[getRandomInt(4)].substring(0, 1);
    const result = input == flip ? true : false;
    const gaining = result == true ? leverage : -leverage;
    const coinImgMap = new Map();
    const total = await leverageUtil.add(msg, gaining);
    coinImgMap.set('h', 'https://i.imgur.com/aO5MiC8.png');
    coinImgMap.set('t', 'https://i.imgur.com/qt6tqBM.png');
    const resultString = () => {
      return (
        `\u200B\n` +
        `結果為**${flip == 'h' ? '正面' : '反面'}** \n` +
        `你${result ? '贏得了' : '損失了'} ${Math.abs(gaining)} ${emoji} \n` +
        `現在籌碼數量為${total} ${emoji} \n`
      );
    };
    // prettier-ignore
    const resultEmbed = new MessageEmbed()
      .setColor('#0099ff')
      .setAuthor(msg.author.username, msg.author.displayAvatarURL({ dynamic: true }))
      .setThumbnail(coinImgMap.get(flip))
      .addField('Coinflip', resultString())
      .setTimestamp();

    msg.channel.send({ embeds: [resultEmbed] });
  },
};

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};
