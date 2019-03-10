<template>
  <div>
    <b-table 
      :data="data" 
      :mobile-cards=false
      :paginated="paginated"
      :pagination-simple=true
      :per-page="perPage"
      :row-class="onRowClass"
      :loading="loading">

      <template slot-scope="props">
        <b-table-column 
          v-for="col in columns"
          v-bind:key="col.field"
          :field="col.field" 
          :label="col.label">
          <div v-if="'formatter' in col" v-html="col.formatter(props.row[col.field], col.field)">
          </div>
          <div v-else>
            {{props.row[col.field]}}
          </div>
        </b-table-column>
      </template>

    </b-table>
  </div>
</template>


<script>
import * as Constants from '@/utils/constants';

export default {
  props: {
    columns: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    onRowClass: {
      type: Function,
      default: () => ''
    },
    perPage: {
      type: Number,
      default: 5
    }
  },

  data() {
    return {
    };
  },

  computed: {
    loading() {
      if(!this.data) {
        return true;
      }

      return false;
    },

    paginated() {
      if(!this.data) {
        return false;
      }
      
      return this.data.length > this.perPage;
    }
  },
};
</script>

<style scoped>

</style>