<template>
  <n-form ref="formRef" :model="formData" :rules="rules">
    <n-card title="Участки и высоты" class="section-form">
      <n-space vertical>
        <n-space justify="end">
          <n-button @click="loadFromStorage" type="info">
            Загрузить сохраненные данные
          </n-button>
          <n-button @click="exportToCsv" type="success">
            Экспорт в CSV
          </n-button>
        </n-space>

        <n-table :bordered="false" :single-line="false">
          <thead>
            <tr>
              <th style="width: 40%">
                Участок (км)
                <n-button text style="margin-left: 8px" @click="toggleSort">
                  {{ sortAscending ? '↑' : '↓' }}
                </n-button>
              </th>
              <th style="width: 40%">Высота (м)</th>
              <th style="width: 20%">Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in sortedData" :key="index">
              <td>
                <n-input-number 
                  v-model:value="row.section" 
                  :min="0"
                  :precision="2"
                  placeholder="Введите длину участка"
                  class="full-width"
                />
              </td>
              <td>
                <n-input-number 
                  v-model:value="row.height" 
                  :min="0"
                  :precision="2"
                  placeholder="Введите высоту"
                  class="full-width"
                />
              </td>
              <td>
                <n-button type="error" @click="confirmRemoveRow(index)" text>
                  Удалить
                </n-button>
              </td>
            </tr>
          </tbody>
        </n-table>

        <n-space justify="space-between">
          <n-button type="primary" @click="addRow" :disabled="formData.length >= maxRows">
            Добавить строку
          </n-button>
          <n-space>
            <n-button type="warning" @click="saveToStorage">
              Сохранить
            </n-button>
            <n-button type="primary" @click="submitForm">
              Применить
            </n-button>
          </n-space>
        </n-space>

        <n-alert v-if="formData.length >= maxRows" type="warning">
          Достигнуто максимальное количество строк ({{ maxRows }})
        </n-alert>
      </n-space>
    </n-card>
  </n-form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMessage, useDialog } from 'naive-ui'

const message = useMessage()
const dialog = useDialog()
const formRef = ref(null)
const sortAscending = ref(true)
const maxRows = 10

const rules = {
  section: { required: true, type: 'number', trigger: 'blur', message: 'Введите длину участка' },
  height: { required: true, type: 'number', trigger: 'blur', message: 'Введите высоту' }
}

const formData = ref([
  { section: 1, height: 100 },
  { section: 5, height: 50 },
  { section: 10, height: 300 }
])

const sortedData = computed(() => {
  return [...formData.value].sort((a, b) => {
    const diff = a.section - b.section
    return sortAscending.value ? diff : -diff
  })
})

const toggleSort = () => {
  sortAscending.value = !sortAscending.value
}

const addRow = () => {
  if (formData.value.length < maxRows) {
    formData.value.push({
      section: null,
      height: null
    })
  }
}

const confirmRemoveRow = (index) => {
  dialog.warning({
    title: 'Подтверждение удаления',
    content: 'Вы уверены, что хотите удалить эту строку?',
    positiveText: 'Да',
    negativeText: 'Нет',
    onPositiveClick: () => removeRow(index)
  })
}

const removeRow = (index) => {
  formData.value.splice(index, 1)
  message.success('Строка удалена')
}

const saveToStorage = () => {
  try {
    localStorage.setItem('sectionData', JSON.stringify(formData.value))
    message.success('Данные успешно сохранены')
  } catch (error) {
    message.error('Ошибка при сохранении данных')
  }
}

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem('sectionData')
    if (saved) {
      formData.value = JSON.parse(saved)
      message.success('Данные успешно загружены')
    } else {
      message.info('Сохраненных данных не найдено')
    }
  } catch (error) {
    message.error('Ошибка при загрузке данных')
  }
}

const exportToCsv = () => {
  try {
    const headers = ['Участок (км)', 'Высота (м)']
    const rows = sortedData.value.map(row => [row.section, row.height])
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sections.csv'
    a.click()
    window.URL.revokeObjectURL(url)
    
    message.success('Файл успешно экспортирован')
  } catch (error) {
    message.error('Ошибка при экспорте файла')
  }
}

const submitForm = () => {
  formRef.value?.validate((errors) => {
    if (errors) {
      message.error('Пожалуйста, проверьте правильность заполнения всех полей')
      return
    }

    // Здесь можно добавить логику обработки данных
    console.log('Отправленные данные:', formData.value)
    message.success('Форма успешно отправлена')
  })
}
</script>

<style scoped>
.section-form {
  max-width: 1000px;
  margin: 0 auto;
}

.full-width {
  width: 100%;
}

:deep(.n-input-number) {
  width: 100%;
}
</style>