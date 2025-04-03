<template>
  <div>
    <v-overlay :value="overlay" style="z-index:100000000">

      <v-progress-circular
          :size="50"
          color="lime accent-1"
          indeterminate
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>
<script>
  export default {
    data() {
      return {
	      overlay:false,
      }
    },
    created() {
      this.$eventBus.$on('overlay', this.overlayToggle);
    },
    methods: {
	    overlayToggle(cmd) {
          if(cmd=='hide') {
	          this.overlay = false;
          } else this.overlay = true;
        },
    }
  }
</script>
