<template>
  <div class="main">
    <div class="main-img">
    </div>
    <div class="contents">
      <div class="title">
        <span class="title-line-box">
          채팅상담 프로그램
        </span>
      </div>
      <div class="description-box">
        채팅상담 솔루션에 대한 소개가 들어갑니다<br>
        채팅상담 솔루션에 대한 소개가 들어갑니다<br>
        채팅상담 솔루션에 대한 소개가 들어갑니다<br>

      </div>
      <div class="title">
        <span class="title-line-box">
          System Flow
        </span>
      </div>
      <div class="description-box">
        채팅상담 솔루션에 대한 소개가 들어갑니다<br>
        채팅상담 솔루션에 대한 소개가 들어갑니다<br>
        채팅상담 솔루션에 대한 소개가 들어갑니다<br>

      </div>
      <div class="title">
        <span class="title-line-box">
          Simple Demo
        </span>
      </div>
      <div class="description-box">
        <div class="round-box">
          <div class="user-box">
            <div class="chat-container">
              <div class="chat-message">
                <div  :class="'message-header '+userView">
                  고객
                </div>
                <div class="message-box">
                  <div class="message-data" v-for="msg in msgList">
                    <div :class="'rdate '+msg.gclass">{{msg.rdate}}</div>
                    <span :class="msg.gclass" v-html="msg.message"></span>
                    <div style="clear:both"></div>

                  </div>
                </div>
                <div class="message-input">
                  <textarea v-model="message"></textarea>
                  <button class="send-button" @click="sendMessage()">전송</button>
                </div>
              </div>
            </div>
          </div>
          <div class="admin-box">
            <div class="show-box">
              <i class="fas fa-bell" :style="{'color':noticeColor}" @click="showNoticeList()"></i>
            </div>
            <div class="chat-container" v-for="udata in userMessageList">
              <div class="chat-message">
                <div :class="'message-header '+udata.noticeView">
                  상담원
                </div>
                <div class="message-box">
                  <div class="message-data" v-for="msg in udata.msgList">
                    <div :class="'rdate '+msg.gclass">{{msg.rdate}}</div>
                    <span :class="msg.gclass" v-html="msg.message"></span>
                    <div style="clear:both"></div>
                  </div>
                </div>
                <div class="message-input">
                  <textarea v-model="admMessage[udata.from]"></textarea>
                  <button class="send-button" @click="admSendMessage(udata.from)">전송</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="title">
        <span class="title-line-box">
          System language
        </span>
        </div>
        <div class="description-box">
          Front  : vue.js
          <br>
          Back end : java, kurent json rpc

        </div>
      </div>

    </div>

  </div>
</template>

<style lang="scss" scoped="true">
  .main {
    .contents {
      .title {
        margin-top:60px;
      }
      .description-box {
      }
      .sub-title-box {
        display: flex;
        padding: 10px 0 20px 0;
        .sub-title {
          width: 80%;
        }

      }
      .chat-container {
        position: relative;
        top: 0;
        left: 0;
        .chat-message {
          .message-header {
            &.alertbox {
              background: #F23565;
            }
            &.alertUser {
              background: #FF7B00;
            }
          }
        }
      }
      .round-box {
        margin:40px 0;
        position: relative;
        .show-box {
          width: 100%;
          position: absolute;
          text-align: right;
          top: 10px;
          right: 50px;
          i {
            font-size: 30pt;
          }
        }
        height: 720px;
        width: 100%;
        display: flex;
        padding: 40px;
        border-radius: 10px;
        background: #fff;
        -webkit-box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.2);
        -moz-box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.1);
        box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.2);
        .user-box {
          width:50%;
          margin-top:30px;
          height:auto;
          border-right:solid 1px #dfdfdf;
        }
        .admin-box {
          width:50%;
          padding:30px 0 0 110px;

        }
      }
    }
  }
</style>

<script>

  export default {
    name: 'chateSholutionMain',
    data() {
      return {
        msgList: [],
        message: '',
        admMessage: {},
        userMessageList: [],
        noticeColor: '#ccc',
        userView:'',

      };
    },
    methods: {
      goPage(url) {
        this.$router.push(url);
      },
      getFormatDate(date) {
        let year = date.getFullYear();
        let month = (1 + date.getMonth());
        month = month >= 10 ? month : '0' + month;
        let day = date.getDate();
        day = day >= 10 ? day : '0' + day;
        let hour = date.getHours();
        hour = (hour >= 10) ? hour : '0' + hour;
        let min = date.getMinutes();
        min = (min >= 10) ? min : '0' + min;
        return year + '-' + month + '-' + day + ' ' + hour + ':' + min;
      },
      sendMessage() {
        if (!this.message) {
          let alertParams = {
            message: '메세지를 입력하세요',
          };
          this.$eventBus.$emit('modalOpen', alertParams);
          return;
        }

        let messageHtml = this.message.replaceAll("\n", "<br>");
        let nowDate = new Date();
        let item = {gclass: 'me', message: messageHtml, rdate: this.getFormatDate(nowDate)}
        this.msgList.push(item)
        this.message = '';


        this.noticeColor = '#f00'
        this.userView = '';
        let from = '12';
        let sendRdate = this.getFormatDate(nowDate);

        item = {gclass: 'admin', message: messageHtml, rdate: sendRdate}
        let isUser = false;
        for (let user of this.userMessageList) {
          if (user.from == from) {
            user.noticeView = 'alertbox';
            user.msgList.push(item);
            isUser = true;
            break;
          }
        }
        if (!isUser) {
          let userData = {from: from, msgList: [], noticeView: 'alertbox'}
          userData.msgList.push(item)
          this.userMessageList.push(userData)
          this.admMessage[from] = '';
        }
      },
      admSendMessage(from) {
        let message = this.admMessage[from];
        if (!message) {
          let alertParams = {
            message: '메세지를 입력하세요',
          };
          this.$eventBus.$emit('modalOpen', alertParams);
        }
        this.userView = 'alertUser';
        let messageHtml = message.replaceAll("\n", "<br>");
        let nowDate = new Date();
        let item = {gclass: 'me', message: messageHtml, rdate: this.getFormatDate(nowDate)}

        for (let user of this.userMessageList) {
          if (user.from == from) {
            user.noticeView = '';
            user.msgList.push(item);
          }
        }
        this.admMessage[from] = '';

        item = {gclass: 'admin', message: messageHtml, rdate: this.getFormatDate(nowDate)}
        this.msgList.push(item)


      },
    }
  }
</script>
