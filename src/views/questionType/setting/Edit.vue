<template>
    <el-card class="edit" shadow="never">
        <template #header>
            <div class="edit-title">题库信息</div>
            <div class="edit-desc">{{ $route.path.indexOf('questionType/add') !== -1 ? '添加' : '修改' }}</div>
        </template>
        <el-form ref="formRef" :model="form" :rules="formRules" label-width="100" size="large">
            <el-form-item label="名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入名称"/>
            </el-form-item>
            <el-form-item>
                <el-button v-if="$route.path.indexOf('questionType/add') !== -1" type="primary" @click="add">
                    添加
                </el-button>
                <el-button v-else type="primary" @click="edit">修改</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>
  
<script lang="ts" setup>
import { reactive, ref, onMounted } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import http from '@/request'
import { useRouter, useRoute } from 'vue-router'

// 定义变量
const route = useRoute()
const router = useRouter()
const formRef = ref<FormInstance>()// 表单引用
const form = reactive({// 表单
    id: null,
    name: null,
})
const formRules = reactive<FormRules>({// 表单校验规则
    name: [
        { required: true, message: '请输入名称', trigger: 'blur' },
        { min: 1, max: 16, message: '长度介于1-16', trigger: 'blur' },
    ],
})

// 组件挂载完成后，执行如下方法
onMounted(async () => {
    if (route.path.indexOf('questionType/add') !== -1) {// 添加
    } else {// 修改
        let { data: { data } } = await http.post("questionType/get", { id: route.params.id })
        form.id = data.id
        form.name = data.name
    }
})

// 添加
async function add() {
    if (!formRef.value) return
    await formRef.value.validate(async (valid, fields) => {
        if (!valid) {
            return
        }

        let { data: { code } } = await http.post("questionType/add", {...form})
        if (code !== 200) {
            return
        }

        router.push("/questionType")
    })
}

// 修改
async function edit() {
    if (!formRef.value) return
    await formRef.value.validate(async (valid, fields) => {
        if (!valid) {
            return
        }

        let { data: { code } } = await http.post("questionType/edit", {...form})
        if (code !== 200) {
            return
        }

        router.push("/questionType")
    })
}
</script>
  
<style lang="scss" scoped>
.edit {
    padding: 10px;

    :deep(.el-card__header) {
        padding-bottom: 0px;

        .edit-title {
            font-size: 14px;
            font-weight: bold;
            padding-bottom: 5px;
        }

        .edit-desc {
            font-size: 12px;
            color: var(--el-text-color-secondary);
        }
    }

}
</style>