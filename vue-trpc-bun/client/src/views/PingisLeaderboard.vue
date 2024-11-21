<script setup lang="ts">
import { trpc } from '../trpc'
import { useQuery, useMutation } from '@tanstack/vue-query'
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

const columns = [
  { field: 'name', header: 'Player' },
  { field: 'matches', header: 'Matches' },
  { field: 'wins', header: 'Wins' },
  { field: 'winRate', header: 'Win Rate' },
]

const matchData = ref({
  player1: '',
  player2: '',
  player1Score: 0,
  player2Score: 0,
})

const { data: leaderboard, refetch } = useQuery({
  queryKey: ['leaderboard'],
  queryFn: () => trpc.pingis.getLeaderboard.query(),
})

const recordMatchMutation = useMutation({
  mutationFn: (data: typeof matchData.value) => trpc.pingis.recordMatch.mutate(data),
  onSuccess: () => {
    matchData.value = {
      player1: '',
      player2: '',
      player1Score: 0,
      player2Score: 0,
    }
    refetch()
  },
})

const handleSubmit = () => {
  recordMatchMutation.mutate(matchData.value)
}
</script>

<template>
  <div class="card">
    <h1 class="text-3xl font-bold mb-4">Pingis Leaderboard</h1>

    <Card class="mb-4">
      <template #title>Record New Match</template>
      <template #content>
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-2">
            <label>Player 1</label>
            <InputText v-model="matchData.player1" />
            <label>Score</label>
            <InputNumber v-model="matchData.player1Score" :min="0" />
          </div>
          <div class="flex flex-col gap-2">
            <label>Player 2</label>
            <InputText v-model="matchData.player2" />
            <label>Score</label>
            <InputNumber v-model="matchData.player2Score" :min="0" />
          </div>
        </div>
        <div class="flex justify-end mt-4">
          <Button
            label="Record Match"
            @click="handleSubmit"
            :loading="recordMatchMutation.isPending.value"
          />
        </div>
      </template>
    </Card>

    <DataTable
      v-if="leaderboard"
      :value="leaderboard"
      :paginator="true"
      :rows="10"
      stripedRows
      tableStyle="min-width: 50rem"
    >
      <Column
        v-for="col in columns"
        :key="col.field"
        :field="col.field"
        :header="col.header"
        sortable
      >
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <span class="font-bold">{{ data[col.field] }}</span>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.card {
  background: var(--surface-card);
  padding: 2rem;
  border-radius: 10px;
  margin: 2rem;
  box-shadow:
    0 2px 1px -1px rgba(0, 0, 0, 0.2),
    0 1px 1px 0 rgba(0, 0, 0, 0.14),
    0 1px 3px 0 rgba(0, 0, 0, 0.12);
}

:deep(.p-progressbar) {
  height: 0.8rem;
}

:deep(.bg-success) .p-progressbar-value {
  background: var(--green-500);
}

:deep(.bg-warning) .p-progressbar-value {
  background: var(--yellow-500);
}

:deep(.bg-danger) .p-progressbar-value {
  background: var(--red-500);
}
</style>
