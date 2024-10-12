<template>
    <template v-if="$route.path === '/myExam'">
        <div class="button-container">
            <el-button type="primary" @click="query(false)">{{ $t('message.all') }}</el-button>
            <el-button type="primary" @click="query('Sejarah')">{{ $t('message.sejarah') }}</el-button>
            <el-button type="primary" @click="query('Mathematics')">{{ $t('message.math') }}</el-button>
            <el-button type="primary" @click="query('Biology')">{{ $t('message.bio') }}</el-button>
            <el-button type="primary" @click="query('Chemistry')">{{ $t('message.chem') }}</el-button>
            <el-button type="primary" @click="query('Physics')">{{ $t('message.physics') }}</el-button>
        </div>
        <el-form :model="queryForm" size="large" class="query">
            <el-form-item label="" class="query-input">
                <el-input v-model="queryForm.examName" :placeholder="$t('message.searchbar')" @keydown.enter.prevent="query()"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="query()">
                    <Iconfont icon="icon-search" color="white">&nbsp;{{ $t('message.search') }}</Iconfont>
                </el-button>
            </el-form-item>
        </el-form>
        <div class="list">
            <div class="no-results" v-if="listpage.list.length === 0">
                {{ $t('message.noresults') }}
            </div>
            <Griddata 
                v-for="myExam in listpage.list" 
                :menu="[
                    {   name: `${myExam.state === 3 ? $t('message.review') : $t('message.startpaper')}`, 
                        icon: `${myExam.state === 3 ? 'icon-search' : 'icon-peixunkaoshi'}`, 
                        event: () => examIn(myExam)
                    },
                    ]" 
                >
                <template #title>
                    {{ myExam.examName }}
                </template>
                <template #content>
                    <el-row justify="center">
                        <el-col :span="8">
                            {{ $t('message.score') }}：{{ myExam.totalScore || '-' }} / {{ myExam.examTotalScore }}
                        </el-col>
                    </el-row>
                </template>
            </Griddata>
            <el-pagination 
                style="width:100%"
                v-model:current-page="listpage.curPage"
                v-model:page-size="listpage.pageSize" 
                :total="listpage.total" 
                background
                layout="prev, pager, next" 
                :hide-on-single-page="true" 
                @size-change="query"
                @current-change="query"
                @prev-click="query"
                @next-click="query"
            />
        </div>
    </template>
    <RouterView v-else></RouterView>
</template>
  
<script lang="ts" setup>
import { reactive, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router'
import http from "@/request"
import dayjs from "dayjs"
import Griddata from '@/components/Griddata.vue';
import { ElMessage } from 'element-plus';
import Gridadd from '@/components/Gridadd.vue';
import { useDictStore } from '@/stores/dict';
import CountDown from '@/components/CountDown.vue';

//  定义变量
const dictStore = useDictStore() // 字典缓存
const route = useRoute()
const router = useRouter()
const queryForm = reactive({// 查询表单
    examName: '', // 考试名称
})
const listpage = reactive({// 分页列表
    curPage: 1,
    pageSize: 6,
    total: 0,
    list: [] as any[],
})

// 组件挂载完成后，执行如下方法
onMounted(() => {
    query()
})

// 如果是跳转到列表页，重新查询
watch(() => route.path, (n, o) => {
    if (n === '/myExam') {
        query()
    }
})

// 查询
async function query() {
    const { data: { code, data } } = await http.post('myExam/listpage', {
        examName: queryForm.examName,
        curPage: listpage.curPage,
        pageSize: listpage.pageSize,
    })

    if (code !== 200) {
        return
    }

    listpage.list = data.list.map((myExam : any) => {
        return myExam
    })
    listpage.total = data.total
}

// 考试进入
async function examIn(myExam: any) {
    if (myExam.state !== 3) {
        let { data: { data } } = await http.post("login/sysTime", {  })
        let curTime = dayjs(data, 'YYYY-MM-DD HH:mm:ss').toDate()
        let examStartTim = dayjs(myExam.examStartTime, 'YYYY-MM-DD HH:mm:ss').toDate()
        if (examStartTim.getTime() > curTime.getTime()) {
            ElMessage.error('考试未开始，请等待...')
            return
        }
    }

    router.push(`/myExam/paper/${myExam.examId}`)
    // if (screenfull.isEnabled) {
    //     screenfull.request();
    //     screenfull.onchange((e) => {
    //         if(!screenfull.isFullscreen) {
    //             router.push(`/myExam`)
    //         }
    //     })
    // }
}
</script>

<style lang="scss">
.el-header {
    display: initial;
}
</style>
<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.list {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    font-family: Poppins;
    :deep(.grid-content) {
        width: 100%;
        .el-col {
            text-align: center;
        }
    }
}

.button-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    gap: 0px;
    margin-bottom: 15px;
}

button {
    width: 100%;
    margin: 0px;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.2s;
    font-family: 'Poppins';
}

.query {
    display: flex;
    width: 100%;
    justify-content: space-between;
    margin: 0;
    padding: 0;
    font-family: 'Poppins';

    .query-input {
        flex: 1; 
        margin-right: 10px;
    }

    .query-button {
        flex-shrink: 0;
        width: auto;
    }
}

.no-results {
    width: 100%;
    text-align: center;
    font-size: 20px;
}

</style>
  
