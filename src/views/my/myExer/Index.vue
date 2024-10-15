<template>
    <template v-if="$route.path === '/myExer'">
            <div class="container" v-for="subject in structuredData" :key="subject.id">
                <div class="group">
                    <div class="label-wrapper">
                        <span class="toggle-button plus" @click="handleDropdownButtonClick"></span>
                        <input type="checkbox" class="group-checkbox" @change="handleCheckboxChange">
                        <label>
                            <span class="questionName">{{ subject.name }}</span>
                            <span class="questionNum">{{ subject.totalQuestionNum }}</span>
                        </label>
                    </div>
                    <div class="items" v-if="subject.years.length > 0">
                        <div class="item" v-for="year in subject.years" :key="year.id">
                            <div class="label-wrapper">
                                <span class="toggle-button plus" @click="handleDropdownButtonClick"></span>
                                <input type="checkbox" class="item-checkbox" @change="handleCheckboxChange">
                                <label>
                                    <span class="questionName">{{ year.name }}</span>
                                    <span class="questionNum">{{ year.totalQuestionNum }}</span>
                                </label>
                            </div>
                            <div class="subitems" v-if="year.chapters.length > 0">
                                <label v-for="chapter in year.chapters" :key="chapter.id">
                                    <input :id="chapter.id" :data-questionnum="chapter.questionNum" type="checkbox" class="subitem-checkbox" @change="handleCheckboxChange">
                                    <span class="chapterId">{{ chapter.chapterId }}</span>
                                    <span class="questionName">{{ chapter.name }}</span>
                                    <span class="questionNum">{{ chapter.questionNum }}</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
        <el-pagination 
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
            style="font-family: Poppins"
        />
    </template>
    <RouterView v-else></RouterView>
</template>
  
<script lang="ts" setup>
import http from "@/request";
import { useDictStore } from '@/stores/dict';
import dayjs from 'dayjs';
import { ElMessage } from "element-plus";
import { onMounted, reactive, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'
import Griddata from "@/components/Griddata.vue";
import Gridadd from "@/components/Gridadd.vue";

//  定义变量
const dictStore = useDictStore()// 字典缓存
const route = useRoute()
const router = useRouter()
const queryForm = reactive({// 查询表单
    name: '',
})
var structuredData = reactive([]);
const listpage = reactive({// 分页列表
    curPage: 1,
    pageSize: 99999,
    total: 0,
    list: [] as any[],
})

// 组件挂载完成后，执行如下方法
onMounted(() => {
    query()
})

// 如果是跳转到列表页，重新查询
watch(() => route.path, (n, o) => {
    if (n === '/myExer') {
        query()
    }
})

// 查询
async function query() {
    const { data: { code, data } } = await http.post('questionType/listpage', {
        name: queryForm.name,
        curPage: listpage.curPage,
        pageSize: listpage.pageSize,
    })

    if (code !== 200) {
        return
    }

    // listpage.list = data.list
    listpage.list = data.list.sort((a, b) => {
        const subjectA = Math.floor(a.id / 1000000); // Extract subject part
        const yearA = Math.floor((a.id % 1000000) / 10000); // Extract year part
        const chapterA = Math.floor((a.id % 10000) / 100); // Extract chapter part

        const subjectB = Math.floor(b.id / 1000000); // Extract subject part
        const yearB = Math.floor((b.id % 1000000) / 10000); // Extract year part
        const chapterB = Math.floor((b.id % 10000) / 100); // Extract chapter part

        // Sort by subject first
        if (subjectA !== subjectB) {
            return subjectA - subjectB; // Ascending order of subjects
        }

        // Then by year
        if (yearA !== yearB) {
            return yearA - yearB; // Ascending order of years
        }

        // Finally by chapter
        if (chapterA !== chapterB) {
            return chapterA - chapterB; // Ascending order of chapters
        }

        // If all are equal, sort by id as secondary criteria
        return a.id - b.id; // Ascending order of id
    });
    listpage.total = data.total

    getStructuredData()
    console.log(structuredData)

}



// 练习进入
async function toExer() {
    // let { data: { data } } = await http.post("login/sysTime", {  })
    const checkboxes = document.querySelectorAll('.subitem-checkbox');
    
        var checkedIds = [];
        let ttlq = 0;

    // Loop through all checkboxes and check if they're checked
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checkedIds.push(checkbox.id);  // Add the id of the checked checkbox
                ttlq += checkbox.getAttribute("data-questionnum");
            }
        });
        checkedIds.sort();
        
        const encodedString = checkedIds.join('&');  // "1,2,3,4,5"

    if(checkedIds.length > 0 && ttlq > 0){
        router.push(`/myExer/paper/${ encodedString }`)
    }

}


function getStructuredData() {
    let subjects = {};

    listpage.list.forEach(item => {
        const idStr = item.id.toString();
        const subjectId = idStr.slice(0, 1) + '000000';
        const yearId = idStr.slice(0, 3) + '0000';
        const chapterId = idStr.slice(3, 5);

        //subject
        if (idStr.endsWith('000000')) {
            if (!subjects[subjectId]) {
                subjects[subjectId] = { ...item, years: [] };
            }
        }
        //year
        else if (idStr.endsWith('0000')) {
            if (!subjects[subjectId]) {
                subjects[subjectId] = { years: [] }; // Create subject if not already initialized
            }
            const yearExists = subjects[subjectId].years.some(y => y.id === item.id);
            if (!yearExists) {
                subjects[subjectId].years.push({ ...item, chapters: [] });
            }
        }
        //chapter
        else {
            const year = subjects[subjectId]?.years.find(y => y.id === parseInt(yearId));
            if (year) {
                item.chapterId = chapterId;
                year.chapters.push(item);
            }
        }
    });

    // note: to do unsorted here lfdjds
    Object.values(subjects).forEach(subject => {
        subject.years.forEach(year => {
            // year.totalQuestionNum = year.chapters.reduce((sum, chapter) => sum + chapter.questionNum, 0);
            year.totalQuestionNum = year.chapters.reduce((sum, chapter) => sum + (parseInt(chapter.questionNum, 10) || 0), 0);
            // if (year.totalQuestionNum > 0) {
            //     year.chapters.push({
            //         id: year.id,
            //         name: 'Unsorted',
            //         questionnum: year.totalQuestionNum
            //     });
            // }
        });
        // subject.totalQuestionNum = subject.years.reduce((sum, year) => sum + year.totalQuestionNum, 0);
        subject.totalQuestionNum = subject.years.reduce((sum, year) => sum + (parseInt(year.totalQuestionNum, 10) || 0), 0);
    });

    return structuredData = Object.values(subjects);
}



// Function to handle dropdown button click
function handleDropdownButtonClick(event) {
    const button = event.target;
    const items = button.closest('.item') ? button.closest('.item').querySelector('.subitems') :
        button.closest('.group') ? button.closest('.group').querySelector('.items') : null;
    if (items) {
        items.classList.toggle('show');
        button.classList.toggle('plus');
        button.classList.toggle('minus');
    }
}

// Function to update parent checkboxes
function updateParentCheckboxes() {
    document.querySelectorAll('.group').forEach(group => {
        const groupCheckbox = group.querySelector('.group-checkbox');
        const allItems = group.querySelectorAll('.item-checkbox');
        const allCheckedItems = Array.from(allItems).every(item => item.checked);
        groupCheckbox.checked = allCheckedItems;
        groupCheckbox.indeterminate = !allCheckedItems && Array.from(allItems).some(item => item.checked);
    });

    document.querySelectorAll('.item').forEach(item => {
        const itemCheckbox = item.querySelector('.item-checkbox');
        const allSubitems = item.querySelectorAll('.subitem-checkbox');
        const allCheckedSubitems = Array.from(allSubitems).every(subitem => subitem.checked);
        itemCheckbox.checked = allCheckedSubitems;
        itemCheckbox.indeterminate = !allCheckedSubitems && Array.from(allSubitems).some(subitem => subitem.checked);
    });
}

// Function to handle checkbox changes
function handleCheckboxChange(event) {
  const checkbox = event.target;
  const isChecked = checkbox.checked;

  if (checkbox.classList.contains('subitem-checkbox')) {
    const itemCheckbox = checkbox.closest('.item').querySelector('.item-checkbox');
    const allSubitemsChecked = Array.from(checkbox.closest('.item').querySelectorAll('.subitem-checkbox')).every(subitem => subitem.checked);
    itemCheckbox.checked = allSubitemsChecked;
  }

  if (checkbox.classList.contains('group-checkbox')) {
    const items = checkbox.closest('.group').querySelectorAll('.item-checkbox');
    items.forEach(itemCheckbox => itemCheckbox.checked = isChecked);
    const subitems = checkbox.closest('.group').querySelectorAll('.subitem-checkbox');
    subitems.forEach(subitemCheckbox => subitemCheckbox.checked = isChecked);
  } else if (checkbox.classList.contains('item-checkbox')) {
    const subitems = checkbox.closest('.item').querySelectorAll('.subitem-checkbox');
    subitems.forEach(subitemCheckbox => subitemCheckbox.checked = isChecked);
  }

  updateParentCheckboxesStates();
}

function updateParentCheckboxesStates() {
  const groupCheckboxes = document.querySelectorAll('.group-checkbox');
  groupCheckboxes.forEach(groupCheckbox => {
    const items = groupCheckbox.closest('.group').querySelectorAll('.item-checkbox');
    const allItemsChecked = Array.from(items).every(item => item.checked);
    groupCheckbox.checked = allItemsChecked;
  });
}

// Attach event listeners to dropdown buttons and checkboxes
document.querySelectorAll('.toggle-button').forEach(button => {
    button.addEventListener('click', handleDropdownButtonClick);
});

document.querySelectorAll('.group-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', handleCheckboxChange);
});

document.querySelectorAll('.item-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', handleCheckboxChange);
});

document.querySelectorAll('.subitem-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', handleCheckboxChange);
});

</script>

<style lang="scss" scoped>

@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

.container {
    font-family: Poppins;
    margin: 20px;
}
.group, .item {
    margin: 10px 0;
}
.items, .subitems {
    display: none; /* Initially hide items and subitems */
    margin-left: 20px;
}
.items.show, .subitems.show {
    display: block; /* Show items and subitems when needed */
}
.toggle-button {
    cursor: pointer;
    font-size: 18px;
    margin-right: 10px;
    border: none;
    background: none;
    color: #007BFF;
    vertical-align: middle;
}
.toggle-button:hover {
    color: #0056b3;
}
.toggle-button.plus::before {
    content: '+';
}
.toggle-button.minus::before {
    content: '−';
}
.label-wrapper {
    display: flex;
    align-items: center;
}
.label-wrapper .toggle-button {
    margin-right: 10px; /* Space between the button and checkbox */
}
.label-wrapper input[type="checkbox"] {
    margin-right: 10px; /* Space between checkbox and label text */
}
label {
    display: block;
}

.list {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
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
  
