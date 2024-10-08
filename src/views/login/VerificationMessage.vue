<template>
    <div class="register">
        <el-form ref="formRef" :model="form" :rules="formRules" class="register-form" size="large">
            <div class="register-form-title">
                uh check ur inbox
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
