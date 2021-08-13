import firebase from "firebase/app"
export default {
  actions: {
    async fetchCategories({ dispatch }) {
      const uid = await dispatch('getUid')
      const categories = (await firebase.database().ref(`/users/${uid}/categories`).once('value')).val() || {}
      return Object.keys(categories).map(key => ({ ...categories[key], id: key }))
    },
    async updateCategory({ dispatch, commit }, { title, limit, id }) {
      try {
        const uid = await dispatch('getUid')
        await firebase.database().ref(`/users/${uid}/categories`).child(id).update({ title, limit })
      } catch (e) {
        commit('setError', e)
        throw e
      }
    },


    async createCategory({ dispatch, commit }, { title, limit }) {
      try {
        const uid = await dispatch('getUid')
        const category = await firebase.database().ref(`/users/${uid}/categories`).push({ title, limit })
        return { title, limit, id: category.key }
      } catch (e) {
        commit('setError', e)
        throw e
      }
    }
  }
}