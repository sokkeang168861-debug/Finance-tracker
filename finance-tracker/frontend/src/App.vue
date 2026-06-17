<template>
  <div class="max-w-6xl mx-auto p-6">
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-gray-800">ប្រព័ន្ធគ្រប់គ្រងហិរញ្ញវត្ថុ</h1>
    </header>

    <div v-if="error" class="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{{ error }}</div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-1 space-y-6">
        <h2 class="text-xl font-semibold text-gray-700">កាបូបលុយ</h2>
        <div v-for="account in accounts" :key="account.id" class="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <div class="text-sm font-medium text-gray-400 uppercase">{{ account.name }}</div>
          <div class="text-2xl font-bold mt-1" :class="account.balance >= 0 ? 'text-green-600' : 'text-red-600'">
            ${{ Number(account.balance).toFixed(2) }}
          </div>
        </div>

        <div class="p-6 bg-white rounded-xl shadow-sm border border-gray-200">
          <h3 class="text-lg font-bold mb-4">កត់ត្រាថ្មី</h3>
          <form @submit.prevent="submitTransaction" class="space-y-4">
            <div>
              <label class="block text-sm">គណនី</label>
              <select v-model="form.account_id" class="w-full p-2 border rounded-md" required>
                <option v-for="acc in accounts" :key="acc.id" :value="acc.id">{{ acc.name }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm">ប្រភេទ</label>
              <select v-model="form.type" class="w-full p-2 border rounded-md" required>
                <option value="INCOME">ចំណូល (+)</option>
                <option value="EXPENSE">ចំណាយ (-)</option>
              </select>
            </div>
            <div>
              <label class="block text-sm">ចំនួនទឹកប្រាក់ ($)</label>
              <input type="number" step="0.01" v-model.number="form.amount" class="w-full p-2 border rounded-md" required />
            </div>
            <div>
              <label class="block text-sm">ការពិពណ៌នា</label>
              <input type="text" v-model="form.description" class="w-full p-2 border rounded-md" />
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded-md font-bold">រក្សាទុក</button>
          </form>
        </div>
      </div>

      <div class="lg:col-span-2">
        <h2 class="text-xl font-semibold text-gray-700 mb-4">ប្រវត្តិប្រតិបត្តិការ</h2>
        <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="tx in transactions" :key="tx.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-500">{{ new Date(tx.date).toLocaleDateString() }}</td>
                <td class="px-6 py-4 text-sm font-medium text-gray-900">{{ tx.account_name }}</td>
                <td class="px-6 py-4 text-sm text-gray-500">{{ tx.description || '-' }}</td>
                <td class="px-6 py-4 text-sm font-bold text-right" :class="tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'">
                  {{ tx.type === 'INCOME' ? '+' : '-' }}${{ Number(tx.amount).toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000/api';

export default {
  data() {
    return {
      accounts: [],
      transactions: [],
      error: null,
      form: { account_id: '', type: 'EXPENSE', amount: null, description: '' }
    };
  },
  mounted() { this.fetchData(); },
  methods: {
    async fetchData() {
      try {
        const [accRes, txRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/accounts`),
          axios.get(`${API_BASE_URL}/transactions`)
        ]);
        this.accounts = accRes.data;
        this.transactions = txRes.data;
        if (this.accounts.length > 0 && !this.form.account_id) this.form.account_id = this.accounts[0].id;
      } catch (err) { this.error = 'Cannot connect to backend server'; }
    },
    async submitTransaction() {
      try {
        await axios.post(`${API_BASE_URL}/transactions`, this.form);
        this.form.amount = null; this.form.description = '';
        this.fetchData();
      } catch (err) { this.error = 'Submission failed'; }
    }
  }
};
</script>