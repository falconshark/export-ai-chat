<template>
  <div class="container">
    <div class="wrapper">
      <h1>AI Chat 記錄匯出器</h1>
      <div class="form-group">
      </div>
        <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" @vdropzone-success="onUploaded"></vue-dropzone>
      </div>
      <div class="action-buttons">
        <button class="btn btn-primary" v-on:click="startExport">
          開始匯出
        </button>
      </div>
      <div class="result">
        匯出內容：
        <div class="textarea">
          <div v-for="msg in resultArray">
            <div class="question">
              問題：{{ msg.question }}
            </div>
            <div class="answer">
              {{ msg.answer }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone';
import 'vue2-dropzone/dist/vue2Dropzone.min.css';
export default {
  name: 'Exporter',
  components: {
    vueDropzone: vue2Dropzone
  },
  data(){
    return {
      resultArray: null,
      dropzoneOptions: {
        url: import.meta.env.VITE_API_URL,
        uploadMultiple: false,
        autoProcessQueue: false,
        addRemoveLinks: true,
        parallelUploads: 100,
        dictDefaultMessage: '將檔案拖至此或點擊上傳',
        acceptedFiles:'.html',
        headers: {'Access-Control-Allow-Origin': '*'}
      }
    };
  },
  methods: {
    onUploaded(files, response){
      //Call api, get result and change the default text of dropzone
      this.resultArray = response.result;
      this.$refs.myVueDropzone.removeAllFiles();
      const dropzoneText = document.querySelector('.dz-message span');
      dropzoneText.textContent = '上載完成！如要繼續匯出，請再次將檔案拖至此或點擊上傳';
    },
    startExport(){
      this.$refs.myVueDropzone.processQueue();
    }
  },
}
</script>

<style lang="scss" scoped>
h1{
  margin-bottom: 1em;
}

.container{
  margin-top: 50px;
}

.dropzone{
  margin-bottom: 50px;
}
.uploaded-files{
  margin-top: 1em;
}

.files-list{
  margin-top: 1em;
}

.result{
  font-size: 1.5em;
  margin-top: 50px;
}

.question{
  margin-bottom: 20px;
}
.answer{
  font-weight: bold;
  margin-bottom: 30px;
}

.textarea {
  width: 100%;
  min-height: 300px;
  padding: 12px 20px;
  box-sizing: border-box;
  border: 2px solid #ccc;
  border-radius: 4px;
  background-color: white;
  font-size: 16px;
  resize: none;
}
</style>
