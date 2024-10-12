<template>
    <div class="home-content">
        <div class="home-left">
            <el-card class="home-left-top" shadow="never">
                <!--<template #header>-->
                    <!--<span>考试概览</span>-->
                <!--</template>-->
                <div class="home-left-top-content">
                    <div v-if="userStore.type === 1" class="home-left-top-content-item" style="cursor: pointer" @click="$router.push('/myExam')">
                        <Iconfont icon="icon-mark-paper" :size="27" color="#0094e5;" :width="48" :height="48"
                            background-color="#e5f4fd" />
                        <div>
                            <div class="home-left-top-content-item-num" style="cursor: pointer">{{ statis.examNum }}</div>
                            <div class="home-left-top-content-item-desc">{{ $t('message.paperscompleted') }}</div>
                        </div>
                    </div>
                    <div v-if="userStore.type === 1" class="home-left-top-content-item">
                        <Iconfont icon="icon-shiti" :size="28" color="#fb901b;" :width="48" :height="48"
                            background-color="#fff4e7" />
                        <div>
                            <div class="home-left-top-content-item-num">{{ countdownspmamali }}</div>
                            <div class="home-left-top-content-item-desc">{{ $t('message.spmamali') }}</div>
                        </div>
                    </div>
                    <div v-if="userStore.type === 1" class="home-left-top-content-item">
                        <Iconfont icon="icon-mark-paper" :size="27" color="#0094e5;" :width="48" :height="48"
                            background-color="#e5f4fd" />
                        <div>
                            <div class="home-left-top-content-item-num">{{ countdownspmtutur }}</div>
                            <div class="home-left-top-content-item-desc">{{ $t('message.spmtutur') }}</div>
                        </div>
                    </div>
                    <div v-if="userStore.type === 1" class="home-left-top-content-item">
                        <Iconfont icon="icon-ai-users" :size="29" color="#eb5b5b;" :width="48" :height="48"
                            background-color="#fdeeee" />
                        <div>
                            <div class="home-left-top-content-item-num">{{ countdownspmtulis }}</div>
                            <div class="home-left-top-content-item-desc">{{ $t('message.spmtulis') }}</div>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
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
                <el-input v-model="queryForm.examName" :placeholder="$t('message.searchbar')" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="query()">
                    <Iconfont icon="icon-search" color="white">&nbsp;{{ $t('message.search') }}</Iconfont>
                </el-button>
            </el-form-item>
        </el-form>
        <div class="list">
            <div class="no-results" v-if="listpage.list.length === 0">
                No results.
            </div>
            <Griddata 
                v-for="myExam in listpage.list" 
                :menu="[
                    {   name: 'Start Exam', 
                        icon: 'icon-peixunkaoshi', 
                        event: () => examIn(myExam)
                    },
                    ]" 
                >
                <template #tag>
                    <el-tag size="small">{{ myExam.id }}</el-tag>
                    <!-- <CountDown v-if="myExam.state === 1 && myExam.markState === 1" :expireTime="dayjs(myExam.examStartTime, 'YYYY-MM-DD HH:mm:ss').toDate()" preTxt="距考试："></CountDown>
                    <template v-else>
                        <el-tag size="small">{{ dictStore.getValue("EXAM_STATE", myExam.state) }}</el-tag>
                        &nbsp;<el-tag type="success" size="small">{{ dictStore.getValue("MARK_STATE", myExam.markState) }}</el-tag>
                    </template> -->
                </template>
                <template #title>
                    {{ myExam.name }}
                </template>
                <template #content>
                    <!-- <div style="margin-bottom: 10px;text-align: center;">
                        考试时间：{{ myExam.examStartTime }}（{{ Math.ceil((dayjs(myExam.examEndTime, 'YYYY-MM-DD HH:mm:ss').toDate().getTime() 
                                        - dayjs(myExam.examStartTime, 'YYYY-MM-DD HH:mm:ss').toDate().getTime()) / (60 * 1000)) + '分钟' }}）
                    </div>
                    <el-row>
                        <el-col :span="8">
                            答题：{{ myExam.state === 3 
                                    ? Math.ceil((dayjs(myExam.answerEndTime, 'YYYY-MM-DD HH:mm:ss').toDate().getTime() 
                                        - dayjs(myExam.answerStartTime, 'YYYY-MM-DD HH:mm:ss').toDate().getTime()) / (60 * 1000)) + '分钟'
                                    : '-' }}
                        </el-col>
                        <el-col :span="8">
                            分数：{{ myExam.totalScore || '-' }} / {{ myExam.examTotalScore }}
                        </el-col>
                        <el-col :span="8">
                            排名：{{ myExam.no || '-' }} / {{ myExam.userNum || '-' }}
                        </el-col>
                    </el-row> -->
                </template>
            </Griddata>
            <el-pagination 
                style="width: 100%"
                v-model:current-page="listpage.curPage"
                v-model:page-size="listpage.pageSize" 
                :total="listpage.total" 
                background
                layout="prev, pager, next" 
                :hide-on-single-page="true" 
                @size-change="query2"
                @current-change="query2"
                @prev-click="query2"
                @next-click="query2"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from 'vue'
import dayjs from "dayjs";
import { useUserStore } from '@/stores/user';
import http from '@/request';
import isBetween from 'dayjs/plugin/isBetween'
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRoute, useRouter } from 'vue-router'
import Griddata from '@/components/Griddata.vue';
import Gridadd from '@/components/Gridadd.vue';
import { useDictStore } from '@/stores/dict';
import CountDown from '@/components/CountDown.vue';

//  定义变量
dayjs.extend(isBetween)
const router = useRouter()
const userStore = useUserStore()
const calendarRef = ref()// 日历引用
const calendar = ref()// 日历当前日期
const statis = reactive({// 首页统计
    examNum: 0,// 考试数量
    questionNum: 0,// 试题数量
    exerNum: 0,// 练习数量
    userNum: 0,// 用户数量
    unExamNum: 0,// 待考数量
    unMarkNum: 0,// 待阅数量
    passExamNum: 0,// 及格次数
    topRank: 0,// 最高排名
})
const taskList = ref([] as any[])// 任务列表（日历悬浮展示）
const todoExamList = ref([] as any[])// 未完成考试列表
const todoExerList = ref([] as any[])// 未完成练习列表
const bulletinListpage = reactive({// 公告分页列表
    curPage: 1,
    pageSize: 100,
    total: 0,
    list: [] as any[],
})
const custom = reactive({// 自定义内容
    title: '',
    content: '',
})

//  定义变量
const dictStore = useDictStore() // 字典缓存
const route = useRoute()
const queryForm = reactive({// 查询表单
    name: '', // 考试名称
})
const listpage = reactive({// 分页列表
    curPage: 1,
    pageSize: 6,
    total: 0,
    list: [] as any[],
})

// 组件挂载完成后，执行如下方法
onMounted(() => {
    query2()
})

// 如果是跳转到列表页，重新查询
watch(() => route.path, (n, o) => {
    if (n === '/') {
        query2()
    }
})
async function query2() {
    const { data: { code, data } } = await http.post('exam/listpage', {
        name: queryForm.name,
        curPage: listpage.curPage,
        pageSize: listpage.pageSize,
    })

    if (code !== 200) {
        return
    }

    listpage.list = data.list
    listpage.total = data.total
}

function daysUntil(dateString) {
    const targetDate = new Date(dateString);
    const currentDate = new Date();

    targetDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);
    
    const difference = targetDate - currentDate;

    const daysRemaining = Math.floor(difference / (1000 * 60 * 60 * 24));
    
    return daysRemaining;
}

const countdownspmamali = daysUntil("2024-12-02");
const countdownspmtutur = daysUntil("2024-12-02");
const countdownspmtulis = daysUntil("2025-01-02");

// 组件挂载完成后，执行如下方法
// onMounted(() => {
// })

// 如果是跳转到列表页，重新查询
// watch(() => route.path, (n, o) => {
//     if (n === '/myExam') {
//         query()
//     }
// })

// async function qsej() {
//     queryForm.examName = "qq"
//     query()
// }
// 查询
async function query(searchterm: any) {
    if(searchterm == false){
        queryForm.examName = ""
    }else{
        queryForm.examName = searchterm || queryForm.examName
    }
    const { data: { code, data } } = await http.post('exam/listpage', {
        name: queryForm.examName,
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
    if (myExam.state !== 3 && userStore.id && userStore.type === 1) {
        const { data: { data: data4 } } = await http.post('exam/addUser', {
            examId: myExam.id,
        })
        router.push(`/myExam/paper/${myExam.id}`)
    } else {
        router.push(`/login`)
    }

        // 如果是用户登录
        // let { data: { data } } = await http.post("login/sysTime", {  })
        // let curTime = dayjs(data, 'YYYY-MM-DD HH:mm:ss').toDate()
        // let examStartTim = dayjs(myExam.examStartTime, 'YYYY-MM-DD HH:mm:ss').toDate()
        // if (examStartTim.getTime() > curTime.getTime()) {
        //     ElMessage.error('考试未开始，请等待...')
        //     return
        // }


    // router.push(`/myExam/paper/${myExam.examId}`)
    // if (screenfull.isEnabled) {
    //     screenfull.request();
    //     screenfull.onchange((e) => {
    //         if(!screenfull.isFullscreen) {
    //             router.push(`/myExam`)
    //         }
    //     })
    // }
}

// 组件挂载完成后，执行如下方法
onMounted(async () => {
    // if (!userStore.id) {
    //     router.push('/login')
    // }

    // 任务查询
    if (userStore.id && userStore.type === 1) {// 如果是用户登录

        // console.log(userStore.type)
        let { data: { data } } = await http.post("report/user/home", {  })// 首页统计
        statis.examNum = data.examNum
        statis.exerNum = data.exerNum
        statis.passExamNum = data.passExamNum
        statis.topRank = data.topRank

        let { data: { data: data2 } } = await http.post("myExam/listpage", { pageSize: 100, todo: true })// 未完成的考试列表
        todoExamList.value.push(...data2.list) 

        let { data: { data: data3 } } = await http.post("myExer/listpage", { pageSize: 100, todo: true })// 未完成的练习列表
        todoExerList.value.push(...data3.list)
    }

    // 公告查询
    // let { data: { data: data2 } } = await http.post('bulletin/listpage', {
    //     notice: true,
    //     curPage: 1,
    //     pageSize: 10,
    // })

    // bulletinListpage.list = data2.list.map((bulletin: any) => {
    //     bulletin.content = bulletin.content.replaceAll('\n', '<br/>')
    //     return bulletin
    // })
    // bulletinListpage.total = data2.total

    // 自定义信息查询
    // let { data: { data:data3 } } = await http.post('login/custom', { })
    // custom.title = data3.title
    // custom.content = data3.content.replaceAll('\n', '<br/>')
    query()
})

// 任务列表获取
function getTaskList(curDate: Date) {
    return taskList.value.filter(task => {
        return (dayjs(curDate).isBetween(
                dayjs(task.startTime, 'YYYY-MM-DD HH:mm:ss').startOf('day').toDate(),// 考试开始时间的00:00:00
                dayjs(task.startTime, 'YYYY-MM-DD HH:mm:ss').endOf('day').toDate(),// 考试开始时间的23:59:59
                null, 
                '[]'))// 包含边界
    })
}

// 公告显示
function bulletinShow(bulletin: any) {
    ElMessageBox.alert(bulletin.content, bulletin.title, {
        customClass: 'el-message-box-ex',
        dangerouslyUseHTMLString: true,
    })
}

</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.pagination{
    margin-top: -70px;
}

.home-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    height: 100vh;
    font-family: 'Poppins';

    :deep(.el-card) {
        margin-bottom: 15px;
        position: relative;

        .el-card__header {
            padding: 15px 15px 15px 30px;
            font-size: 14px;
            font-weight: bold;
        }

        .el-card__header::after {
            content: "";
            display: block;
            width: 4px;
            height: 16px;
            background: #409EFF;
            position: absolute;
            top: 15px;
            left: 15px;
        }

        .el-card__body {
            font-size: 12px;
            color: var(--el-text-color-regular);
        }
    }

    .home-left {
        width: 100%;
        display: flex;
        flex-direction: column;

        .home-left-top {
            overflow: initial;
            width: 100%;
            .home-left-top-content {
                display: flex;

                .home-left-top-content-item {
                    flex: 1;
                    display: flex;
                    justify-content: center;

                    .home-left-top-content-item-num {
                        font-size: 28px;
                        height: 30px;
                        padding-left: 15px;
                    }

                    .home-left-top-content-item-desc {
                        font-weight: bold;
                        padding-left: 15px;
                        color: var(--el-text-color-secondary);
                    }
                }
            }
        }

        .home-left-bottom {
            flex: 1;
            display: flex;
            :deep(.home-left-bottom-left) {
                width: 330px;
                .home-left-bottom-left-calendar {
                    width: 300px;
                    height: 330px;
                    font-size: 14px;

                    .el-calendar__header {
                        padding: 12px 20px 8px 20px;

                        span {
                            line-height: 28px;
                        }
                    }

                    td[class*="is-selected"] {
                        .el-calendar-day {
                            background-color: #409EFF;
                            border-radius: 5px;
                            position: relative;
                            span {
                                color: white;
                            }
                            .home-left-bottom-left-calendar-task {
                                background-color: var(--el-color-white);
                            }
                        }
                    }

                    td {
                        border: 0;
                        border-radius: 5px;
                        position: relative;

                        .el-calendar-day {
                            height: 35px;
                            width: 35px;
                            margin: 1px 2px;

                            span {
                                text-align: center;
                                display: inline-block;
                                width: 100%;
                                height: 100%;
                                line-height: 24px;
                            }
                            .home-left-bottom-left-calendar-task {
                                display: block;
                                position: absolute;
                                bottom: 2px;
                                transform: translateX(-50%);
                                left: 50%;
                                width: 6px;
                                height: 6px;
                                background-color: var(--el-color-primary);
                                border-radius: 50%;
                                font-size: 12px;
                            }
                            &:hover {
                                background-color: var(--el-color-primary);
                                border-radius: 5px;

                                span {
                                    color: var(--el-color-white);
                                }
                                .home-left-bottom-left-calendar-task {
                                    background-color: var(--el-color-white);
                                }
                            }
                        }
                    }
                }
            }
            :deep(.home-left-bottom-right) {
                flex: 1;
                display: flex;
                flex-direction: column;
                margin-left: 15px;
                .el-card {
                    flex: 1;
                    .el-card__body {
                        padding-top: 0px;
                        .home-left-bottom-right-row {
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-end;
                            border-bottom: 1px solid var(--el-border-color);
                            padding: 20px 10px 10px 10px;
                            div {
                                .el-text {
                                    font-size: 13px;
                                }
                            }
                            .el-button {
                                border: 0;
                            }
                        }
                    }
                }
            }
        }
    }

    .home-right {
        flex: 1;
        width: 0;
        display: flex;
        flex-direction: column;

        .home-right-menu {

            .home-right-menu-content {
                display: flex;
                flex-wrap: wrap;
                color: var(--el-text-color-secondary);
                font-weight: bold;

                .home-right-menu-content-item {
                    width: 33%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;

                    span {
                        display: block;
                        padding-top: 10px;
                        padding-bottom: 20px;
                    }
                }
            }
        }

        .home-right-bulletin {
            flex: 1;
            font-weight: bold;

            .home-right-bulletin-content {
                display: flex;
                justify-content: space-between;
                cursor: pointer;
                padding-bottom: 10px;

                .home-right-bulletin-content-name {
                    word-break: keep-all;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                }
            }

        }

        .home-right-custom {
            font-weight: bold;
        }
    }
}
</style>
<style lang="scss">
.el-message-box-ex {
    max-width: 600px;
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
    background-color: #564fcb;
    transition: background-color 0.2s;
    font-family: 'Poppins';
}
  
button:active {
    background-color: #263bb3;
}

.el-header {
    display: initial;
}

.list {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    margin: 0;
    font-family: 'Poppins';
    :deep(.grid-content) {
        width: 100%;
        display: flex;
        .el-col {
            flex: 1;
            text-align: center;
        }
    }
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
