<template>
    <div class="fp">
        <el-form ref="formRef" :model="form" :rules="formRules" class="fp-form" size="large">
            <div class="fp-form-title">
                {{ $t('message.forgotpwd') }}
            </div>
            <div class="fp-form-text">
                Don't worry! Contact us at admin@aceterus.com with your username and new password to continue your learning journey. Click <router-link to="/login">here</router-link> to  return to login.
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

const router = useRouter()
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.fp {
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;
    font-family: 'Poppins';

    .fp-form {
        position: relative;
        width: 35%;
        height: auto;
        padding: 60px;
        box-sizing: border-box;
        background: #fff;
        border-radius: 3px;
        box-shadow: 0 0 16px 3px rgb(0 0 0 / 5%);
        margin-bottom: 100px;

        .fp-form-title {
            font-size: 25px;
            font-weight: bold;
            color: var(--el-text-color-regular);
            padding-bottom: 20px;
        }

        .fp-form-text {
            font-size: 15px;
            color: var(--el-text-color-regular);
        }

        .el-button {
            width: 100%;
            height: 45px;
        }
    }
}
</style>