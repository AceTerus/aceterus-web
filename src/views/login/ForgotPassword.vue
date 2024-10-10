<template>
    <div class="fp">
        <el-form ref="formRef" :model="form" :rules="formRules" class="fp-form" size="large">
            <div class="fp-form-title">
                {{ $t('message.forgotpwd') }}
            </div>
            <div class="fp-form-text">
                insert message later
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
.fp {
    display: flex;
    height: 100vh;
    justify-content: center;
    align-items: center;

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
            font-size: 20px;
            color: var(--el-text-color-regular);
        }

        .el-button {
            width: 100%;
            height: 45px;
        }
    }
}
</style>