<template>
  <form class="card auth-card" @submit.prevent="submitHandler">
    <div class="card-content">
      <span class="card-title">{{ 'AppName' | localize }}</span>
      <div class="input-field">
        <input
          id="email"
          type="text"
          v-model.trim="email"
          :class="{
            invalid:
              ($v.email.$dirty && !$v.email.required) ||
              ($v.email.$dirty && !$v.email.email),
          }"
        />
        <label for="email">Email</label>
        <small
          v-if="$v.email.$dirty && !$v.email.required"
          class="helper-text invalid"
          >{{ 'Login_EmailValidate1' | localize }}</small
        >
        <small
          v-else-if="$v.email.$dirty && !$v.email.email"
          class="helper-text invalid"
          >{{ 'Login_EmailValidate1' | localize }}</small
        >
      </div>
      <div class="input-field">
        <input
          id="password"
          type="password"
          autocomplete="off"
          v-model.trim="password"
          :class="{
            invalid:
              ($v.password.$dirty && !$v.password.required) ||
              ($v.password.$dirty && !$v.password.minLength),
          }"
        />
        <label for="password">{{ 'Password' | localize }}</label>
        <small
          v-if="$v.password.$dirty && !$v.password.required"
          class="helper-text invalid"
          >{{ 'Enter_Password' | localize }}</small
        >
        <small
          v-else-if="$v.password.$dirty && !$v.password.minLength"
          class="helper-text invalid"
          >{{ 'Login_PasswordMin' | localize }}
          {{ $v.password.$params.minLength.min }}
        </small>
      </div>
    </div>
    <div class="card-action">
      <div>
        <button class="btn waves-effect waves-light auth-submit" type="submit">
          {{ 'Login' | localize }}
          <i class="material-icons right">send</i>
        </button>
      </div>

      <p class="center">
        {{ 'HaveAcc' | localize }}
        <router-link to="/register">{{ 'Register' | localize }}</router-link>
      </p>
    </div>
  </form>
</template>

<script>
import { email, required, minLength } from 'vuelidate/lib/validators'
import messages from '@/utils/messages'
export default {
  name: 'login',
  metaInfo() {
    return {
      title: this.$title('Login'),
    }
  },
  data: () => ({
    email: '',
    password: '',
  }),
  validations: {
    email: { email, required },
    password: { required, minLength: minLength(6) },
  },
  mounted() {
    if (messages[this.$route.query.message]) {
      this.$message(messages[this.$route.query.message])
    }
  },
  methods: {
    async submitHandler() {
      if (this.$v.$invalid) {
        this.$v.$touch()
        return
      }
      const formData = {
        email: this.email,
        password: this.password,
      }
      try {
        await this.$store.dispatch('login', formData)
        this.$router.push('/')
      } catch (e) {
        console.log(e)
      }
    },
  },
}
</script>