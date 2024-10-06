<template>
    <div class="register">
        <el-form ref="formRef" :model="form" :rules="formRules" class="register-form" size="large">
            <div class="register-form-title">
                欢迎登录
            </div>
            <el-form-item label="" prop="username">
                <el-input v-model.trim="form.username" placeholder="username" />
            </el-form-item>
            <el-form-item label="" prop="email">
                <el-input v-model.trim="form.email" placeholder="email" />
            </el-form-item>
            <el-form-item label="" prop="pwd">
                <el-input v-model.trim="form.pwd" type="password" show-password placeholder="password" />
            </el-form-item>
             <el-form-item label="" prop="cpwd">
                <el-input v-model.trim="form.cpwd" type="cpassword" show-password placeholder="confirm password" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="register">{{ $t("login") }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'
import http from "@/request/index"
import { useUserStore } from '@/stores/user';
import { useDictStore } from '@/stores/dict';

// 定义变量
const router = useRouter()
const formRef = ref<FormInstance>()// 表单引用

const form = ref({
  username: '',
  email: '',
  pwd: '',
  cpwd: ''
});

function logData() {
  const data = {
    username: form.value.username,
    email: form.value.email,
    password: form.value.pwd
  };
  console.log(JSON.stringify(data));
}

const formRules = reactive<FormRules>({// 表单规则
    username: [
        { required: true, message: '请输入账号', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '请输入账号', trigger: 'blur' },
    ],
    pwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
    ],
    cpwd: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { validator: validatePwd, trigger: 'blur' },
    ],
})

function validatePwd(rule, value, callback) {
    if (value !== form.value.pwd) {
        callback(new Error('pws dont match'));
    } else {
        callback();
    }
}

const keyDown = (e:KeyboardEvent) => {
  if (e.keyCode == 13) {
    register()
  }
}

// 组件挂载完成后，执行如下方法
onMounted(() => {
    window.addEventListener('keydown', keyDown)
})

// 组件被卸载之后，执行如下方法
onUnmounted(() => {
  window.removeEventListener('keydown', keyDown, false)
})

// 登录
async function register() {
    router.push("/validation")
}

</script>

<style lang="scss" scoped>
.register {
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;

    .register-form {
        position: relative;
        width: 35%;
        height: auto;
        padding: 60px;
        box-sizing: border-box;
        background: #fff;
        border-radius: 3px;
        box-shadow: 0 0 16px 3px rgb(0 0 0 / 5%);
        margin-bottom: 100px;

        .register-form-title {
            font-size: 22px;
            font-weight: bold;
            color: var(--el-text-color-regular);
            padding-bottom: 20px;
        }

        .el-button {
            width: 100%;
            height: 45px;
        }
    }
}
</style>
