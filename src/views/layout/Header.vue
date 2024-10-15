<template>
    <div class="header">
        <div v-if="isMobile" class="mobile-notification" v-show="showNotification">
            <span>Mobile version is coming soon! For now, please use a desktop for the best experience.</span>
            <button @click="hideNotification" class="close-button">×</button>
        </div>
        <div class="header-top">
            <img src="@/assets/images/Aceterus_logo.png" alt="logo" height="40" style="margin-left:30px">
            <span class="header-top-orgname"></span>
            <el-menu :default-active="$route.path" mode="horizontal" :router="true" class="header-top-menu">
                <el-menu-item index="/home">{{ $t('message.mockexam') }}</el-menu-item>
                <el-menu-item index="/myExer">{{ $t('message.twpractice') }}</el-menu-item>
                <el-menu-item index="/myExam">{{ $t('message.history') }}</el-menu-item>
            </el-menu>
            <el-menu class="header-top-username" :router="true">
                <el-menu-item v-if="!userStore.id" index="/login">{{ $t('message.login') }}</el-menu-item>
            </el-menu>

            <el-dropdown v-if="userStore.id" @command="dropdownCmd" :teleported="false" class="header-top-username">
                <span class="el-dropdown-link">
                    {{ userStore.name }}
                    <span class="iconfont icon-arrow-down" style="font-size: 12px;font-weight: bold;color: #409eff;"></span>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="pwdUpdate"><span class="iconfont icon-edit"></span>&nbsp;&nbsp;{{ $t('message.changepwd') }}</el-dropdown-item>
                        <el-dropdown-item command="out"><span class="iconfont icon-login-out" style="font-size: 14px;"></span>&nbsp;&nbsp;{{ $t('message.logout') }}</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <el-divider />
    </div>
    <el-drawer :title="$t('message.changepwd')" style="font-family: Poppins" v-model="form.show" :size="550" @close="form.oldPwd = ''; form.newPwd = '';">
        <el-form ref="formRef" :model="form" :rules="formRules" label-width="100" size="large">
            <el-form-item prop="oldPwd">
                <el-input v-model.trim="form.oldPwd" type="password"  :placeholder="$t('message.oldpwd')"/>
            </el-form-item>
            <el-form-item prop="newPwd">
                <el-input v-model.trim="form.newPwd" type="password"  :placeholder="$t('message.newpwd')"/>
            </el-form-item>
            <el-form-item prop="newPwd2">
                <el-input v-model.trim="form.newPwd2" type="password"  :placeholder="$t('message.cnewpwd')"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="pwdUpdate">{{ $t('message.change') }}</el-button>
            </el-form-item>
        </el-form>
    </el-drawer>
</template>

<script lang="ts" setup>
import http from '@/request';
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user';
import { onMounted, reactive, ref } from 'vue';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';

// 定义变量
const userStore = useUserStore()
const router = useRouter()
const ent = reactive({
    logoUrl: `${ http.defaults.baseURL }login/logo`,
    name: ''
})
const formRef = ref<FormInstance>()// 表单引用
const form = reactive({// 密码修改表单
    show: false,
    oldPwd: '',
    newPwd: '',
    newPwd2: '',
})
const formRules = reactive<FormRules>({// 密码修改表单校验规则
    oldPwd: [
        { required: true, message: '请输入旧密码', trigger: 'blur' },
    ],
    newPwd: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度介于6-20', trigger: 'blur' },
    ],
    newPwd2: [{
        trigger: 'blur',
        validator: (rule: any, value: any, callback: any) => {
            if (!value) {
                return callback(new Error('请输入新密码'))
            }
            if (form.newPwd != form.newPwd2) {
                return callback(new Error('两次密码不一致'))
            }
            return callback()
        }
    }],
})
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const showNotification = ref(true);

// Check if the notification has been dismissed
if (isMobile) {
    const notificationDismissed = localStorage.getItem('notificationDismissed');
    showNotification.value = !notificationDismissed; // Show if not dismissed
}
function hideNotification() {
    showNotification.value = false;
    localStorage.setItem('notificationDismissed', 'true'); // Set the flag in localStorage
}

// 组件挂载完成后，执行如下方法
onMounted(async () => {
    // 更新页面标题
    // let { data: { data } } = await http.post('login/ent', {})
    ent.name = "Aceterus"
    document.title = "Aceterus"

    // 更新页面logo
    let favicon = document.querySelector('link[rel="icon"]') as any;
    favicon.href = "@/assets/images/Aceterus_logo.png";
})

// 下拉菜单命令
async function dropdownCmd (command: string) {
    if (command === 'pwdUpdate') {
        form.show = true
        return
    }

    if (command === 'out') {
        await http.post('login/out', {})
        sessionStorage.removeItem('user');
        router.push('/login')
        return
    }
}

// 密码修改
async function pwdUpdate() {
    if (!formRef.value) return
    await formRef.value.validate(async (valid, fields) => {
        if (!valid) {
            return
        }

        let { data: { code, msg } } = await http.post("login/pwd", { ...form })
        if (code !== 200) {
            return
        }
        
        ElMessage.success('修改成功')
        form.oldPwd = ''// 提交后重置表单
        form.newPwd = ''
        form.show = false
    })
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.header {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;
    font-family: 'Poppins';

    .header-top {
        width: 1200px;
        height: 60px;
        display: flex;
        align-items: center;

        .header-top-logo {
            height: 45px;
            width: 45px;
        }

        .header-top-orgname {
            padding: 0px 40px 0px 10px;
            font-weight: bold;
            line-height: 45px;
        }

        .header-top-menu {
            flex: 1;
            border-bottom: 0;

            .el-menu-item {
                font-size: 13px;
                font-weight: bold;
                color: var(--el-text-color-regular);

                &:hover,
                &:focus {
                    background-color: initial;
                }
            }

            :deep(.el-sub-menu) {
                .el-sub-menu__title {
                    font-size: 13px;
                    font-weight: bold;
                    color: var(--el-text-color-regular);
                }
            }
        }

        .header-top-username {
            cursor: pointer;
            line-height: 45px;

            :hover {
                color: var(--el-color-primary);
            }

            :deep(.el-popper) {
                border-radius: 10px;

                .el-scrollbar {

                    border-radius: 10px;

                    .el-dropdown-menu__item {
                        padding: 5px 40px 5px 25px;
                        font-size: 12px;

                        i {
                            margin-right: 6px;
                            font-size: 16px;
                        }
                    }
                }
            }
        }
    }

    .el-divider--horizontal {
        margin: 0;
    }

}
.mobile-notification {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    width: 100vw;

    background-color: var(--el-color-primary);
    color: #000;
    text-align: center;
    padding: 10px;
    z-index: 1000; // Ensure it stays on top

    .close-button {
        background: none;
        border: none;
        color: inherit;
        font-size: 18px;
        cursor: pointer;
        margin-left: 15px;
    }
}
</style>
