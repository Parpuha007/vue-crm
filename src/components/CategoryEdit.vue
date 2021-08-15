<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>{{ 'Cat_Edit' | localize }}</h4>
      </div>

      <form @submit.prevent="submitHandler">
        <div class="input-field">
          <select ref="select" v-model="current">
            <option v-for="c in categories" :key="c.id" :value="c.id">
              {{ c.title }}
            </option>
          </select>
          <label>{{ 'Cat_Select' | localize }}</label>
        </div>

        <div class="input-field">
          <input
            id="edit-name"
            type="text"
            v-model.trim="title"
            :class="{ invalid: $v.title.$dirty && !$v.title.required }"
          />
          <label for="edit-name">{{ 'Cat_Label' | localize }}</label>
          <span
            v-if="$v.title.$dirty && !$v.title.required"
            class="helper-text invalid"
            >{{ 'Cat_CatName' | localize }}</span
          >
        </div>

        <div class="input-field">
          <input
            id="edit-limit"
            type="number"
            v-model.number="limit"
            :class="{ invalid: $v.limit.$dirty && !$v.limit.minValue }"
          />
          <label for="edit-limit">{{ 'Cat_Limit' | localize }}</label>
          <span
            v-if="$v.limit.$dirty && !$v.limit.minValue"
            class="helper-text invalid"
            >{{ 'Cat_MinValue' | localize }}
            {{ $v.limit.$params.minValue.min }}</span
          >
        </div>

        <button class="btn waves-effect waves-light" type="submit">
          {{ 'Update' | localize }}
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators'
export default {
  data: () => ({
    select: null,
    title: '',
    limit: 1,
    current: null,
  }),
  validations: {
    title: { required },
    limit: { minValue: minValue(100) },
  },
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
  watch: {
    current(catId) {
      const { title, limit } = this.categories.find((c) => c.id === catId)
      this.title = title
      this.limit = limit
    },
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }

      try {
        const categoryData = {
          id: this.current,
          title: this.title,
          limit: this.limit,
        }
        await this.$store.dispatch('updateCategory', categoryData)
        this.$message('Категория успешно обновлена')
        this.$emit('updated', categoryData)
      } catch (e) {
        console.log(e)
      }
    },
  },
  created() {
    const { id, title, limit } = this.categories[0]
    this.current = id
    this.title = title
    this.limit = limit
  },
  mounted() {
    window.M.updateTextFields()
    this.select = window.M.FormSelect.init(this.$refs.select)
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy()
    }
  },
}
</script>