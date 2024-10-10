<template>
    <div class="register">
        <el-form ref="formRef" :model="form" :rules="formRules" class="register-form" size="large">
            <div class="register-form-title" style="text-align: center">
                <img src="@/assets/images/Aceterus_logo.png" alt="logo" width="100">
            </div>
            <el-form-item label="" prop="username">
                <el-input v-model.trim="form.username" :placeholder="$t('message.username')" />
            </el-form-item>
            <el-form-item label="" prop="email">
                <el-input v-model.trim="form.email" :placeholder="$t('message.email')" />
            </el-form-item>
            <el-form-item label="" prop="pwd">
                <el-input v-model.trim="form.pwd" type="password" show-password :placeholder="$t('message.pwd')" />
            </el-form-item>
             <el-form-item label="" prop="cpwd">
                <el-input v-model.trim="form.cpwd" type="cpassword" show-password :placeholder="$t('message.cpwd')" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="register">{{ $t('message.reg') }}</el-button>
            </el-form-item>
            <div class="reg-links">
                <router-link to="/login">{{ $t('message.hvacc') }}</router-link>
            </div>
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
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

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
        { required: true, message: t('message.usernamepls'), trigger: 'blur' },
    ],
    email: [
        { required: true, message: t('message.emailpls'), trigger: 'blur' },
    ],
    pwd: [
        { required: true, message: t('message.pwdpls'), trigger: 'blur' },
    ],
    cpwd: [
        { required: true, message: t('message.cpwdpls'), trigger: 'blur' },
        { validator: validatePwd, trigger: 'blur' },
    ],
})

function validatePwd(rule, value, callback) {
    if (value !== form.value.pwd) {
        callback(new Error(t('message.pwdmatch')));
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
    // 校验数据有效性
    if (!formRef.value) return
    await formRef.value.validate(async (valid, fields) => {
        if (!valid) {
            return
        }
    })

    router.push("/verify-account")
}

</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.register {
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
    font-family: 'Poppins';

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

        .reg-links {
            margin-top: 10px;
            text-align: center;
            display: flex;
            flex-direction: column;
        }
    }
}
</style>
