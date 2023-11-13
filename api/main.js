const Koa = require('koa');
const { koaBody } = require('koa-body');
const cors = require('@koa/cors');
const cheerio = require('cheerio');
const fs = require('fs');
const log4js = require('koa-log4');

const infoLogger = log4js.getLogger('info');
infoLogger.level = 'info';

const errorLogger = log4js.getLogger('error');
errorLogger.level = 'error';

const app = new Koa();
app.use(koaBody({ multipart: true }));
app.use(cors());

app.use(async ctx => {
  const files = ctx.request.files;

  if(!files){
    ctx.body = JSON.stringify({'message' :'Please provide html file to here.'});
    return;
  }
  ctx.set('Content-Type', 'application/json; charset=utf-8');
  const filesKeys = Object.keys(files);
  const fileKey = filesKeys[0];
  const filePath = files[fileKey].filepath;
  const file = fs.readFileSync(filePath, 'utf8');

  //Use cherrio to loading the content
  const $ = cheerio.load(file);

  const msgLists = $('.msg-item');
  const msgResults = [];
  for(let i = 0; i < msgLists.length; i++){
    const msg = $(msgLists[i]);
    const question = $(msg).find('.msg-input').text();
    const answer = $(msg).find('.answer-text').text();
    const msgResult = {
      question,
      answer
    };
    msgResults.unshift(msgResult);
  }

  ctx.body = JSON.stringify(
    {
      result: msgResults,
    }
  );
});


app.listen(8000, () => {
  infoLogger.info('Export AI Chat API is now running on port 8000 ∠( ᐛ 」∠)＿');
});
