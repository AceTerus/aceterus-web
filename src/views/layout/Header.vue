<template>
    <div class="header">
        <div class="header-top">
            <el-image :src="ent.logoUrl" :fit="'contain'" class="header-top-logo">
                <template #error>logo</template>
            </el-image>
            <span class="header-top-orgname">{{ ent.name }}</span>
            <el-menu :default-active="$route.path" mode="horizontal" :router="true" class="header-top-menu">
                <el-menu-item index="/home">Mock Exam</el-menu-item>
                <el-menu-item v-if="userStore.type === 0 || userStore.type === 2" index="/questionType">题库</el-menu-item>
                <el-menu-item v-if="userStore.type === 0 || userStore.type === 2" index="/exer">练习</el-menu-item>
                <el-menu-item v-if="userStore.type === 1" index="/myExer">Topic-Wise Practice</el-menu-item>
                <el-menu-item v-if="userStore.type === 1" index="/myExam">History</el-menu-item>
                <el-menu-item v-if="userStore.type === 0 || userStore.type === 2" index="/exam">考试</el-menu-item>
                <el-menu-item v-if="userStore.type === 3" index="/myMark">阅卷</el-menu-item>
                <el-sub-menu v-if="userStore.type === 0" index="/user">
                    <template #title>用户</template>
                    <el-menu-item index="/org">机构管理</el-menu-item>
                    <el-menu-item index="/user">考试用户</el-menu-item>
                    <el-menu-item index="/subAdmin">子管理员</el-menu-item>
                    <el-menu-item index="/markUser">阅卷用户</el-menu-item>
                </el-sub-menu>
                <el-sub-menu v-if="userStore.type === 2" index="/user">
                    <template #title>用户</template>
                    <el-menu-item index="/examUser">考试用户</el-menu-item>
                    <el-menu-item index="/markUser">阅卷用户</el-menu-item>
                </el-sub-menu>
                <el-sub-menu v-if="userStore.type === 0" index="/sys">
                    <template #title>系统</template>
                    <el-menu-item index="/bulletin">公告管理</el-menu-item>
                    <el-menu-item index="/parm">系统配置</el-menu-item>
                    <el-menu-item index="/cron">定时任务</el-menu-item>
                    <el-menu-item index="/dict">数据字典</el-menu-item>
                    <el-menu-item index="/cache">缓存服务</el-menu-item>
                </el-sub-menu>
            </el-menu>
            <el-dropdown @command="dropdownCmd" :teleported="false" class="header-top-username">
                <span class="el-dropdown-link">
                    {{ userStore.name }}
                    <span class="iconfont icon-arrow-down" style="font-size: 12px;font-weight: bold;color: #409eff;"></span>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="pwdUpdate"><span class="iconfont icon-edit"></span>&nbsp;&nbsp;修改密码</el-dropdown-item>
                        <el-dropdown-item command="out"><span class="iconfont icon-login-out" style="font-size: 14px;"></span>&nbsp;&nbsp;退出</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
        <el-divider />
    </div>
    <el-drawer title="密码修改" v-model="form.show" :size="550" @close="form.oldPwd = ''; form.newPwd = '';">
        <el-form ref="formRef" :model="form" :rules="formRules" label-width="100" size="large">
            <el-form-item label="旧密码" prop="oldPwd">
                <el-input v-model.trim="form.oldPwd" type="password"  placeholder="请输入旧密码"/>
            </el-form-item>
            <el-form-item label="新密码" prop="newPwd">
                <el-input v-model.trim="form.newPwd" type="password"  placeholder="请输入新密码"/>
            </el-form-item>
            <el-form-item label="再次确认" prop="newPwd2">
                <el-input v-model.trim="form.newPwd2" type="password"  placeholder="请输入新密码"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="pwdUpdate">修改</el-button>
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

// 组件挂载完成后，执行如下方法
onMounted(async () => {
    // 更新页面标题
    let { data: { data } } = await http.post('login/ent', {})
    ent.name = data.name
    document.title = data.name

    // 更新页面logo
    let favicon = document.querySelector('link[rel="icon"]') as any;
    favicon.href = ent.logoUrl;
})

// 下拉菜单命令
async function dropdownCmd (command: string) {
    if (command === 'pwdUpdate') {
        form.show = true
        return
    }

    if (command === 'out') {
        await http.post('login/out', {})
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
.header {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: white;

    .header-top {
        width: 1200px;
        height: 45px;
        display: flex;

        .header-top-logo {
            height: 45px;
            width: 45px;
        }

        .header-top-orgname {
            padding: 0px 100px 0px 10px;
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
</style>
