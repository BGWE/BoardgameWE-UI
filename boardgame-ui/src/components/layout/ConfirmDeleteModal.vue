<template>
  <b-modal :active="this.active" scroll="keep" :has-modal-card="true" :canCancel="true" :onCancel="this.onCancel">
    <div class="card">
      <div class="card-content">
        <div class="content">{{this.content}}</div>
      </div>
      <footer class="card-footer">
        <a class="card-footer-item" @click="onCancel">{{$t('label.cancel')}}</a>
        <a class="card-footer-item card-footer-item-danger" @click="this.onDelete">
          <span class="icon"><i class="far fa-trash-alt"></i></span>
          <span>{{confirmLabel || $t('label.delete')}}</span>
        </a>
      </footer>
    </div>
  </b-modal>
</template>

<script>
export default {
  props: {
    'onCancel': Function,
    'onDelete': Function,
    'active': Boolean,
    'content': String,
    'confirmLabel': String
  },
};
</script>

<style scoped>
.card-footer-item-danger {
  color: hsl(348, 100%, 61%);
}
</style>
