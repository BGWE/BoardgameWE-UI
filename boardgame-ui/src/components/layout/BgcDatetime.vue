<template>
  <span>{{ formattedDatetime }}</span>
</template>

<script>
import * as helper from '@/utils/helper';  
export default {
  name: 'BgcDatetime',
  props: {
    datetime: {
      type: String,
      required: true
    },
    asdate: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    formattedDatetime() {
      return this.asdate ? helper.formatDate(this.datetime) : helper.formatDatetime(this.datetime); 
    }
  }
};
</script>