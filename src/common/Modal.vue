<template>
  <div>
    <v-dialog
        v-model="dialog"
        width="370"
        style="z-index:100000000000000000"
    >
      <v-card>
        <v-card-title class="headline">
         {{title}}
        </v-card-title>
        <v-card-text class="message-box">
          <div  class="message-content" v-html="message"></div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              text
              v-if="action" @click="hideModal()"
          >
            취소
          </v-btn>
          <v-btn
              color="primary"
              text
              @click="somethingModal()"
          >
            확인
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</div>
</template>
<style lang="scss" scoped="true">
  .message-box {
    min-height:160px;
    .message-content {
      padding-top:30px;
    }
  }
</style>
<script>
  export default {
  	watch: {
	    dialog(val) {
	    	if(!val && this.doAction) {
			    if(!this.action) {
				    this.doAction();
			    }
		    }
        }
    },
    data() {
      return {
	      dialog:false,
          message: '',
          title: '알림',
          action: false,
          doAction: '',
      }
    },
    created() {
      this.$eventBus.$on('modalOpen', this.openModal);
    },
    methods: {
      openModal(params) {
        if (params.title) this.title = params.title;
        else this.title = '알림';

        if (params.message) this.message = params.message;
        else if(params.content) this.message = params.content;

        switch(params.type) {
            case 'confirm':
              this.action = true;
              break;
            case 'timeout':
	            this.action = false;
	            setTimeout(()=>{
		            this.dialog = false;
	            },2000);
            	break;
            default:
	            this.action = false;
	            break;

        }

        if (params.doAction) {
          this.doAction = params.doAction;
        } else this.doAction = '';

        this.dialog = true;
      },
      hideModal() {
	      this.dialog = false;


      },
      somethingModal() {
        if (this.doAction) {
          this.doAction();
        }
	      this.dialog = false;


      }
    }
  }
</script>
