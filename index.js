const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

const token = '5879221356:AAFnrixLzjmM_LuQ1ONNMcOXZDAhVdOGpqA';
const delivUrl = 'https://fabulous-pegasus-42f6c8.netlify.app';
const mainUrl = 'https://klubnichnysalut.ru';
const vkGroup = 'https://vk.com/public197624505';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

    if(text === '/start') {
        await bot.sendMessage(chatId, 'Заказывайте лучшие сорта клубники у Нас! Доставкой или рассылкой', {
           reply_markup: {
            keyboard:[
                [{text:'Заполнить форму обратной связи' ,web_app: {url:delivUrl + '/form2'}}]
            ]
           } 
        })
         await bot.sendMessage(chatId, 'Используйте официальный сайт ЛПХ "Клубничный салют" для быстрого и удобного заказа:', {
            reply_markup: {
             inline_keyboard:[
                 [{text:'Сайт ЛПХ "Клубничный салют"' ,web_app: {url:mainUrl}}]
             ]
            } 
         })
         await bot.sendMessage(chatId, 'Присоединяйся к нашей группе ВК и следите за новинками', {
            reply_markup: {
             inline_keyboard:[
                 [{text:'ЛПХ "Клубничный салют" в VK' ,web_app: {url:vkGroup}}]
             ]
            } 
         })
        


         if(msg?.web_app_data?.data) {
            try {
                const data = JSON.parse(msg?.web_app_data?.data)
                console.log(data)
                await bot.sendMessage(chatId, 'Спасибо за заявку '+ data?.name)
                
                setTimeout(async () => {
                    await bot.sendMessage(chatId, 'С Вами свяжуться по номеру ' +  data?.phone + ' для уточнения заказа в ближайшее время.');
                }, 3000)
            } catch (e) {
                console.log(e);
            }  
         }
    }
});

app.post('/web-data', async (req, res) => {
    const {queryId, products, totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Покупка',
            input_message_content: {message_text: 'Вы оформили заказ на сумму ' + totalPrice}
        })
        return res.status(200).json({})
    } catch (e) {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Ошибка',
            input_message_content: {message_text: 'Не удалось приобрести'}
        })
        return res.status(500).json({})
    }
    
 })


const PORT = 8000;

app.listen(PORT, () => console.log('server started on port : ' + PORT))
