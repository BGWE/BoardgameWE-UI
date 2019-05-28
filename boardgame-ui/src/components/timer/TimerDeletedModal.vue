<template>
  <b-modal :active="this.active" scroll="keep" :has-modal-card="true" :canCancel="false">
    <div class="card">
      <div class="card-content">
        <div class="content">{{this.content}}</div>
      </div>
      <footer class="card-footer">
        <a href="#" class="card-footer-item card-footer-item-danger" @click="this.onLeave">
          <span class="icon"><i class="fas fa-sign-out-alt"></i></span>
          <span>{{$t('label.leave')}}</span>
        </a>
      </footer>
    </div>
  </b-modal>
</template>

<script>
export default {
  name: 'TimerDeletedModal',
  props: {
    onLeave: {
      type: Function, 
      required: true
    }, 
    active: {
      type: Boolean 
    }, 
    content: {
      type: String,
      required: true
    }
  },
};
</script>

<style scoped>
.card-footer-item-danger {
  color: hsl(348, 100%, 61%);
}
</style>
