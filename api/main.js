const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('@koa/cors');
const fs = require('fs');
const log4js = require('koa-log4')

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
  let totalCount = 0;
  const fileList = [];
  const funList = [];
  for(let i = 0; i < filesKeys.length; i++){
    const fileKey = filesKeys[i];
    const fileName = files[fileKey].name;
    const filePath = files[fileKey].path;
    const fileType = files[fileKey].type;
    const file = fs.readFileSync(filePath);
    const count = await countText(file, fileType, option);

    totalCount+= count;
    fileList.push(fileName);
  }
  ctx.body = JSON.stringify(
    { files: fileList,
      totalCount,
    }
  );
});


app.listen(8000, () => {
  infoLogger.info('Word Count API is now running on port 8000 ∠( ᐛ 」∠)＿');
});
