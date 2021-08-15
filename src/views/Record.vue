<template>
  <div>
    <div class="page-title">
      <h3>{{ 'Record_Title' | localize }}</h3>
    </div>
    <Loader v-if="loading" />
    <p v-else-if="!categories.length" class="center">
      Категорий пока нет.
      <router-link to="/categories">{{ 'Add' | localize }}</router-link>
    </p>
    <form v-else class="form" @submit.prevent="submitHandler">
      <div class="input-field">
        <select ref="select" v-model="category">
          <option v-for="c in categories" :key="c.id" :value="c.id">
            {{ c.title }}
          </option>
        </select>
        <label>{{ 'Record_Category' | localize }}</label>
      </div>

      <p>
        <label>
          <input
            v-model="type"
            class="with-gap"
            name="type"
            type="radio"
            value="income"
          />
          <span>{{ 'Income' | localize }}</span>
        </label>
      </p>

      <p>
        <label>
          <input
            v-model="type"
            class="with-gap"
            name="type"
            type="radio"
            value="outcome"
          />
          <span>{{ 'Outcome' | localize }}</span>
        </label>
      </p>

      <div class="input-field">
        <input
          id="amount"
          type="number"
          v-model.number="amount"
          :class="{ invalid: $v.amount.$dirty && !$v.amount.minValue }"
        />
        <label for="amount">{{ 'History_Amount' | localize }}</label>
        <span
          class="helper-text invalid"
          v-if="$v.amount.$dirty && !$v.amount.minValue"
          >{{ 'Record_Min' | localize }}
          {{ $v.amount.$params.minValue.min }}</span
        >
      </div>

      <div class="input-field">
        <input
          id="description"
          type="text"
          v-model="description"
          :class="{
            invalid: $v.description.$dirty && !$v.description.required,
          }"
        />
        <label for="description">{{ 'Detail_Description' | localize }}</label>
        <span
          class="helper-text invalid"
          v-if="$v.description.$dirty && !$v.description.required"
          >{{ 'Record_Description' | localize }}</span
        >
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        {{ 'Record_Create' | localize }}
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators'
import { mapGetters } from 'vuex'
export default {
  metaInfo() {
    return {
      title: this.$title('Menu_Record'),
    }
  },
  name: 'record',
  data: () => ({
    select: null,
    loading: true,
    categories: [],
    category: null,
    type: 'outcome',
    amount: 1,
    description: '',
  }),
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      if (this.canCreateRecord) {
        try {
          await this.$store.dispatch('createRecord', {
            categoryId: this.category,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON(),
          })
          const bill =
            this.type === 'income'
              ? this.info.bill + this.amount
              : this.info.bill - this.amount
          await this.$store.dispatch('updateInfo', { bill })
          this.$message('Запись успешно создана')
          this.$v.$reset()
          this.amount = 1
          this.description = ''
        } catch (e) {
          console.log(e)
        }
      } else {
        this.$message(
          `Недостаточно средств на счете (${this.amount - this.info.bill})`
        )
      }
    },
  },
  computed: {
    ...mapGetters(['info']),
    canCreateRecord() {
      if (this.type === 'income') {
        return true
      }
      return this.info.bill >= this.amount
    },
  },
  async mounted() {
    this.categories = await this.$store.dispatch('fetchCategories')
    this.loading = false

    if (this.categories) {
      this.category = this.categories[0].id
    }
    setTimeout(() => {
      this.select = window.M.FormSelect.init(this.$refs.select)
      window.M.updateTextFields()
    }, 0)
  },
  validations: {
    amount: { minValue: minValue(1) },
    description: { required },
  },
}
</script>