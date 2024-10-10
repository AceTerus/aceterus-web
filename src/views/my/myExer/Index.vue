<template>
    <template v-if="$route.path === '/myExer'">
        <div class="container">
            <div class="group">
                <div class="label-wrapper">
                    <span class="toggle-button plus" @click="handleDropdownButtonClick"></span>
                    <input type="checkbox" class="group-checkbox" @change="handleCheckboxChange">
                    <label>Group 1</label>
                </div>
                <div class="items">
                    <div class="item">
                        <div class="label-wrapper">
                            <span class="toggle-button plus" @click="handleDropdownButtonClick"></span>
                            <input type="checkbox" class="item-checkbox" @change="handleCheckboxChange">
                            <label>Item 1.1</label>
                        </div>
                        <div class="subitems">
                            <label><input type="checkbox" class="subitem-checkbox" @change="handleCheckboxChange"> Subitem 1.1.1</label>
                            <label><input type="checkbox" class="subitem-checkbox" @change="handleCheckboxChange"> Subitem 1.1.2</label>
                        </div>
                    </div>
                    <div class="item">
                        <div class="label-wrapper">
                            <span class="toggle-button plus" @click="handleDropdownButtonClick"></span>
                            <input type="checkbox" class="item-checkbox" @change="handleCheckboxChange">
                            <label>Item 1.2</label>
                        </div>
                        <div class="subitems">
                            <label><input type="checkbox" class="subitem-checkbox" @change="handleCheckboxChange"> Subitem 1.2.1</label>
                            <label><input type="checkbox" class="subitem-checkbox" @change="handleCheckboxChange"> Subitem 1.2.2</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="group">
                <!-- <label><input type="checkbox" class="subitem-checkbox" @change="handleCheckboxChange"> Subitem 2.1.1</label> -->
                <!-- <label v-for="questionType in listpage.list"> -->
                <!--     <input id="{{ questionType.name }}" type="checkbox" class="subitem-checkbox" @change="handleCheckboxChange">{{ questionType.name }} -->
                <!-- </label> -->
                <label v-for="questionType in listpage.list" :key="questionType.name">
                    <input :id="questionType.id" :data-questionnum="questionType.questionNum" type="checkbox" class="subitem-checkbox" @change="handleCheckboxChange">   
                    <span class="questionName">{{ questionType.name }}</span>
                    <span class="questionNum">{{ questionType.questionNum }}</span>
                </label>
            </div>
            <el-button type="primary" @click="toExer">Start Practice</el-button>
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

    listpage.list = data.list
    listpage.total = data.total
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
  
